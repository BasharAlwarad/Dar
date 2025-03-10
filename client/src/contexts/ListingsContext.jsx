import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listingReducer from '../reducers/ListingsReducer.jsx';
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
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';

import { v4 as uuidv4 } from 'uuid';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { toast } from 'react-toastify';

const ListingsContext = createContext();

const initialState = {
  user: null,
  loading: true,
  listings: [],
  listing: null,
  lastFetchedListings: null,
};

export const ListingsProvider = ({ children }) => {
  const navigate = useNavigate();

  const [{ user, loading, listings, listing, lastFetchedListings }, dispatch] =
    useReducer(listingReducer, initialState);

  const fetchListings = async (categoryName) => {
    try {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('type', '==', categoryName),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      dispatch({
        type: 'SET_LAST_FETCHED_LISTING',
        payload: lastVisible,
      });
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'SET_LISTINGS', payload: listings });
    } catch (error) {
      toast.error('Error: Fetching listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const onFetchMoreListings = async (categoryName) => {
    try {
      console.log('lastFetchedListings', lastFetchedListings);
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('type', '==', categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListings),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot?.docs[querySnapshot.docs.length - 1];
      console.log(querySnapshot.docs);
      console.log(lastVisible);

      if (lastVisible === undefined) {
        toast.info('No more listings to fetch');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      dispatch({ type: 'SET_LAST_FETCHED_LISTING', payload: lastVisible });
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: 'SET_SHOW_MORE_LISTINGS', payload: listings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error: Fetching listings failed');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchListing = async (listingId) => {
    try {
      const listingRef = doc(db, 'listings', listingId);
      const listingSnapshot = await getDoc(listingRef);
      const listingData = listingSnapshot?.data();
      dispatch({ type: 'SET_LISTING', payload: listingData });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error fetching listing:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this listing?')) {
        return;
      }
      console.log(listingId);
      await deleteDoc(doc(db, 'listings', listingId));
      toast.success('Listing deleted successfully');
      new Promise((resolve) => setTimeout(resolve, 2000));
      navigate(-1);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const fetchUserListings = async (user) => {
    try {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('user', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() });
      });
      dispatch({ type: 'SET_LISTINGS', payload: listings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      toast.error('Error fetching listings');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleCreateListing = async (
    data,
    user,
    reset,
    geolocationEnabled = true
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!user) {
        toast.error('You must be logged in to create a listing');
        return;
      }
      if (parseInt(data.regularPrice) <= parseInt(data.discountedPrice)) {
        toast.error('Discounted Price must be less than Regular Price');
        return;
      }
      if (data.imageUrls.length > 6) {
        toast.error('You can only upload a maximum of 6 images');
        return;
      }

      let geolocation = {};
      let location;

      if (geolocationEnabled) {
        console.log(data.location);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${
            data?.location
          }&key=${import.meta.env.VITE_GEOCODER_API_KEY}`
        );

        const geoRes = await response.json();
        console.log(geoRes);
        if (geoRes.status === 'ZERO_RESULTS') {
          toast.error('Invalid location');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        geolocation = {
          lat: geoRes.results[0]?.geometry.location.lat ?? 0,
          lng: geoRes.results[0]?.geometry.location.lng ?? 0,
        };

        location =
          geoRes.status === 'ZERO_RESULTS'
            ? undefined
            : geoRes.results[0]?.formatted_address;

        if (location === undefined || location.includes('undefined')) {
          dispatch({ type: 'SET_LOADING', payload: false });
          toast.error('Please enter a correct address');
          return;
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
        [...data.imageUrls].map(async (image) => await storeImage(image))
      ).catch((error) => {
        dispatch({ type: 'SET_LOADING', payload: false });
        toast.error('Could not upload images');
        throw new Error('Image upload failed');
      });

      const formDataCopy = {
        ...data,
        imageUrls,
        geolocation,
        location,
        timestamp: serverTimestamp(),
        user: user.uid,
      };

      console.log(formDataCopy);

      const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
      toast.success('Listing created successfully');
      dispatch({ type: 'SET_LOADING', payload: false });
      reset();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/category/${formDataCopy.type}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Could not create listing');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleUpdateListing = async (
    data,
    user,
    listingId,
    geolocationEnabled = true
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!user) {
        toast.error('You must be logged in to create a listing');
        return;
      }
      if (parseInt(data.regularPrice) <= parseInt(data.discountedPrice)) {
        toast.error('Discounted Price must be less than Regular Price');
        return;
      }
      if (data.imageUrls.length > 6) {
        toast.error('You can only upload a maximum of 6 images');
        return;
      }

      let geolocation = {};
      let location;

      if (geolocationEnabled) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${
            data?.location
          }&key=${import.meta.env.VITE_GEOCODER_API_KEY}`
        );

        const geoRes = await response.json();
        if (geoRes.status === 'ZERO_RESULTS') {
          toast.error('Invalid location');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        geolocation = {
          lat: geoRes.results[0]?.geometry.location.lat ?? 0,
          lng: geoRes.results[0]?.geometry.location.lng ?? 0,
        };

        location =
          geoRes.status === 'ZERO_RESULTS'
            ? undefined
            : geoRes.results[0]?.formatted_address;

        if (location === undefined || location.includes('undefined')) {
          dispatch({ type: 'SET_LOADING', payload: false });
          toast.error('Please enter a correct address');
          return;
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
        [...data.imageUrls].map(async (image) => await storeImage(image))
      ).catch((error) => {
        dispatch({ type: 'SET_LOADING', payload: false });
        toast.error('Could not upload images');
        throw new Error('Image upload failed');
      });

      const formDataCopy = {
        ...data,
        imageUrls: imageUrls || listing?.imageUrls,
        geolocation,
        location,
        timestamp: serverTimestamp(),
        user: user.uid,
      };

      const docRef = await updateDoc(
        doc(db, 'listings', listingId),
        formDataCopy
      );
      toast.success('Listing updated successfully');
      dispatch({ type: 'SET_LOADING', payload: false });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/category/${formDataCopy.type}`);
    } catch (error) {
      toast.error('Could not update listing');
    }
  };

  return (
    <ListingsContext.Provider
      value={{
        user,
        loading,
        listings,
        listing,
        fetchListings,
        onFetchMoreListings,
        fetchListing,
        handleDeleteListing,
        handleCreateListing,
        handleUpdateListing,
        fetchUserListings,
        dispatch,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  const {
    user,
    loading,
    listings,
    listing,
    fetchListings,
    onFetchMoreListings,
    fetchListing,
    handleDeleteListing,
    handleCreateListing,
    handleUpdateListing,
    fetchUserListings,
    dispatch,
  } = context;
  return {
    user,
    loading,
    listings,
    listing,
    fetchListings,
    onFetchMoreListings,
    fetchListing,
    handleDeleteListing,
    handleCreateListing,
    handleUpdateListing,
    fetchUserListings,
    dispatch,
  };
};
