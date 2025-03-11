import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { v4 as uuidv4 } from 'uuid';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import { db } from '../config/firebase.js';
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// Fetch Listings
export const getListings = asyncHandler(async (req, res, next) => {
  try {
    const { category, categoryName, order, limiting } = req.query;
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where(category, '==', categoryName),
      orderBy(order, 'desc'),
      limit(limiting)
    );

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ listings, lastVisible });
  } catch (error) {
    next(new CustomError('Fetching listings failed', 401));
  }
});

// Fetch More Listings
export const fetchMoreListings = asyncHandler(async (req, res, next) => {
  try {
    const { category, categoryName, order, limiting, lastVisibleId } =
      req.query;
    const listingsRef = collection(db, 'listings');
    const lastVisibleDoc = await getDoc(doc(db, 'listings', lastVisibleId));
    const q = query(
      listingsRef,
      where(category, '==', categoryName),
      orderBy(order, 'desc'),
      startAfter(lastVisibleDoc),
      limit(parseInt(limiting))
    );

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ listings, lastVisible });
  } catch (error) {
    next(new CustomError('Fetching more listings failed', 401));
  }
});

// Fetch Single Listing
export const getListing = asyncHandler(async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const listingRef = doc(db, 'listings', listingId);
    const listingSnapshot = await getDoc(listingRef);
    const listingData = listingSnapshot.data();

    res.status(200).json({ listing: listingData });
  } catch (error) {
    next(new CustomError('Fetching listing failed', 401));
  }
});

// Create Listing
export const createListing = asyncHandler(async (req, res, next) => {
  const { data, user, geolocationEnabled = true } = req.body;

  try {
    if (!user) {
      throw new CustomError('You must be logged in to create a listing', 401);
    }
    if (parseInt(data.regularPrice) <= parseInt(data.discountedPrice)) {
      throw new CustomError(
        'Discounted Price must be less than Regular Price',
        400
      );
    }
    if (data.imageUrls.length > 6) {
      throw new CustomError('You can only upload a maximum of 6 images', 400);
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${data.location}&key=${process.env.GEOCODER_API_KEY}`
      );

      const geoRes = await response.json();
      if (geoRes.status === 'ZERO_RESULTS') {
        throw new CustomError('Invalid location', 400);
      }
      geolocation = {
        lat: geoRes.results[0]?.geometry.location.lat ?? 0,
        lng: geoRes.results[0]?.geometry.location.lng ?? 0,
      };

      location = geoRes.results[0]?.formatted_address;

      if (location === undefined || location.includes('undefined')) {
        throw new CustomError('Please enter a correct address', 400);
      }
    } else {
      geolocation = {
        lat: data.geolocation.lat,
        lng: data.geolocation.lng,
      };
      location = data.location;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${user.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/listings/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      data.imageUrls.map(async (image) => await storeImage(image))
    ).catch((error) => {
      throw new CustomError('Image upload failed', 500);
    });

    const formDataCopy = {
      ...data,
      imageUrls,
      geolocation,
      location,
      timestamp: serverTimestamp(),
      user: user.uid,
    };

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    res
      .status(201)
      .json({ message: 'Listing created successfully', listingId: docRef.id });
  } catch (error) {
    next(new CustomError('Creating listing failed', 500));
  }
});

// Update Listing
export const updateListing = asyncHandler(async (req, res, next) => {
  const { data, user, listingId, geolocationEnabled = true } = req.body;

  try {
    if (!user) {
      throw new CustomError('You must be logged in to update a listing', 401);
    }
    if (parseInt(data.regularPrice) <= parseInt(data.discountedPrice)) {
      throw new CustomError(
        'Discounted Price must be less than Regular Price',
        400
      );
    }
    if (data.imageUrls.length > 6) {
      throw new CustomError('You can only upload a maximum of 6 images', 400);
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${data.location}&key=${process.env.GEOCODER_API_KEY}`
      );

      const geoRes = await response.json();
      if (geoRes.status === 'ZERO_RESULTS') {
        throw new CustomError('Invalid location', 400);
      }
      geolocation = {
        lat: geoRes.results[0]?.geometry.location.lat ?? 0,
        lng: geoRes.results[0]?.geometry.location.lng ?? 0,
      };

      location = geoRes.results[0]?.formatted_address;

      if (location === undefined || location.includes('undefined')) {
        throw new CustomError('Please enter a correct address', 400);
      }
    } else {
      geolocation = {
        lat: data.geolocation.lat,
        lng: data.geolocation.lng,
      };
      location = data.location;
    }

    const storeImage = async (image) => {
      if (image.startsWith('https')) {
        return image;
      }
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${user.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/listings/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      data.imageUrls.map(async (image) => await storeImage(image))
    ).catch((error) => {
      throw new CustomError('Image upload failed', 500);
    });

    const formDataCopy = {
      ...data,
      imageUrls: imageUrls || listing?.imageUrls,
      geolocation,
      location,
      timestamp: serverTimestamp(),
      user: user.uid,
    };

    await updateDoc(doc(db, 'listings', listingId), formDataCopy);
    res.status(200).json({ message: 'Listing updated successfully' });
  } catch (error) {
    next(new CustomError('Updating listing failed', 500));
  }
});

// Delete Listing
export const deleteListing = asyncHandler(async (req, res, next) => {
  const { listingId } = req.params;

  try {
    await deleteDoc(doc(db, 'listings', listingId));
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    next(new CustomError('Deleting listing failed', 500));
  }
});

// Fetch User Listings
export const getUserListings = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  try {
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('user', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnap = await getDocs(q);
    const listings = querySnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ listings });
  } catch (error) {
    next(new CustomError('Fetching user listings failed', 500));
  }
});

// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   startAfter,
//   doc,
//   getDoc,
//   deleteDoc,
//   addDoc,
//   updateDoc,
//   setDoc,
//   serverTimestamp,
// } from 'firebase/firestore';

// import { v4 as uuidv4 } from 'uuid';
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from 'firebase/storage';

// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
//   updateProfile,
// } from 'firebase/auth';
// import { db, auth, admin } from '../config/firebase.js';
// import { CustomError } from '../utils/errorHandler.js';
// import asyncHandler from '../utils/asyncHandler.js';

// // User Sign In
// export const getListings = asyncHandler(async (req, res, next) => {
//   try {
//     const { category, categoryName, order, limiting } = req.query;
//     const listingsRef = collection(db, 'listings');
//     const q = query(
//       listingsRef,
//       where(category, '==', categoryName),
//       orderBy(order, 'desc'),
//       limit(limiting)
//     );

//     const querySnapshot = await getDocs(q);
//     const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
//     const listings = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.status(200).json({ listings, lastVisible });
//   } catch (error) {
//     next(new CustomError('Sign in failed', 401));
//   }
// });
