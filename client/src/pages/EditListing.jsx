import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { set, useForm } from 'react-hook-form';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { updateDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Spinner } from '../components';

export const EditListing = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState(null);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const fileInputRef = useRef(null);
  const isMounted = useRef(true);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      location: '',
      type: 'sell',
      offer: false,
      furnished: false,
      parking: false,
      bathrooms: 1,
      bedrooms: 1,
      regularPrice: 0,
      discountedPrice: 0,
      imageUrls: [],
      geolocation: {
        lat: 0,
        lng: 0,
      },
      timestamp: serverTimestamp(),
      user: getAuth().currentUser?.uid,
    },
  });

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setValue('imageUrls', files);
    setImageUrls(URL.createObjectURL(watch('imageUrls')[0]));
  };

  const handleUpdateListing = async (data) => {
    try {
      setLoading(true);
      const user = getAuth().currentUser;
      if (!user) {
        toast.error('You must be logged in to update a listing');
        return;
      }

      if (watch('regularPrice') <= watch('discountedPrice')) {
        toast.error('Discounted Price must be less than Regular Price');
        return;
      }
      if (watch('imageUrls').length > 6) {
        toast.error('You can only upload a maximum of 6 images');
        return;
      }

      let geolocation = {};
      let location;

      if (geolocationEnabled) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${watch(
            'location'
          )}&key=${import.meta.env.VITE_GEOCODER_API_KEY}`
        );
        const data = await response.json();
        if (data.status === 'ZERO_RESULTS') {
          toast.error('Invalid location');
          return;
        }
        geolocation = {
          lat: data.results[0]?.geometry.location.lat ?? 0,
          lng: data.results[0]?.geometry.location.lng ?? 0,
        };

        location =
          data.status === 'ZERO_RESULTS'
            ? undefined
            : data.results[0]?.formatted_address;

        if (location === undefined || location.includes('undefined')) {
          setLoading(false);
          toast.error('Please enter a correct address');
          return;
        }
      } else {
        geolocation = {
          lat: watch('geolocation.lat'),
          lng: watch('geolocation.lng'),
        };
        location = watch('location');
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
        [...watch('imageUrls')].map(async (image) => await storeImage(image))
      ).catch((error) => {
        setLoading(false);
        toast.error('Could not upload images');
      });
      const formDataCopy = {
        ...data,
        imageUrls: imageUrls || listing?.imageUrls,
        geolocation,
        location,
      };
      console.log(formDataCopy);
      const docRef = await updateDoc(
        doc(db, 'listings', listingId),
        formDataCopy
      );
      console.log(docRef);
      toast.success('Listing updated successfully');
      setLoading(false);
      reset();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/category/${formDataCopy.type}`);
    } catch (error) {
      toast.error('Could not update listing');
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = doc(db, 'listings', listingId);
        const listingSnapshot = await getDoc(listingRef);
        const listingData = listingSnapshot?.data();
        console.log(listingData);
        setListing(listingData);
        setValue('name', listingData.name);
        setValue('location', listingData.location);
        setValue('type', listingData.type);
        setValue('offer', listingData.offer);
        setValue('furnished', listingData.furnished);
        setValue('parking', listingData.parking);
        setValue('bathrooms', listingData.bathrooms);
        setValue('bedrooms', listingData.bedrooms);
        setValue('regularPrice', listingData.regularPrice);
        setValue('discountedPrice', listingData.discountedPrice);
        setValue('imageUrls', listingData.imageUrls);
        setValue('geolocation', listingData.geolocation);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, setValue]);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          setValue('user', user.uid);
        } else {
          navigate('/sign-in');
        }
      });
    }
    setLoading(false);
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (listing.length === 0) return <></>;
  if (loading) return <Spinner />;

  return (
    <div className="card bg-base-300 rounded-box grid p-4 place-items-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit(handleUpdateListing)}
          className="flex flex-col space-y-1"
        >
          <h2 className="text-2xl font-semibold text-center">Edit Listing</h2>
          {imageUrls && (
            <div className="mt-4">
              <img
                src={imageUrls}
                alt="Image Preview"
                className="object-cover w-full m-3 h-32 mx-auto "
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleImageUploadClick}
            className={`w-full btn ${
              watch('imageUrls').length > 0 ? 'btn-success' : 'btn-white'
            }`}
          >
            Upload Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="imageUrls"
            style={{ display: 'none' }}
            multiple
          />
          {errors.imageUrls && (
            <p className="text-red-500">{errors.imageUrls.message}</p>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setValue('type', 'sell')}
              className={`w-5/12  btn ${
                watch('type') === 'sell' ? 'btn-success' : 'btn-white '
              }`}
            >
              Sell
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'rent')}
              className={`w-5/12  btn ${
                watch('type') === 'sell' ? 'btn-white' : 'btn-success'
              }`}
            >
              Rent
            </button>
          </div>
          {errors.type && <p className="text-red-500">{errors.type.message}</p>}

          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters',
              },
            })}
            className="w-full input input-bordered pl-12 pr-10"
            placeholder="Name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <input
            type="number"
            id="regularPrice"
            {...register('regularPrice', {
              required: 'Regular Price is required',
            })}
            className="w-full input input-bordered pl-12 pr-10"
            placeholder="Regular Price"
          />
          {errors.regularPrice && (
            <p className="text-red-500">{errors.regularPrice.message}</p>
          )}
          <input
            type="number"
            id="discountedPrice"
            {...register('discountedPrice')}
            className="w-full input input-bordered pl-12 pr-10"
            placeholder="Discounted Price"
          />

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                defaultValue={1}
                {...register('bathrooms', {
                  required: 'Bathrooms is required',
                })}
                className="w-full input input-bordered"
              />
              {errors.bathrooms && (
                <p className="text-red-500">{errors.bathrooms.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                defaultValue={1}
                {...register('bedrooms', {
                  required: 'Bedrooms is required',
                })}
                className="w-full input input-bordered"
              />
              {errors.bedrooms && (
                <p className="text-red-500">{errors.bedrooms.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-4 mb-4 p-4">
            <label className="flex flex-col items-center space-x-3">
              <span>Offer</span>
              <input
                type="checkbox"
                id="offer"
                onChange={(e) => setValue('offer', e.target.checked)}
                {...register('offer')}
                className="toggle toggle-success"
              />
            </label>
            <label className="flex flex-col items-center space-x-3">
              <span>Furnished</span>
              <input
                type="checkbox"
                id="furnished"
                onChange={(e) => setValue('furnished', e.target.checked)}
                {...register('furnished')}
                className="toggle toggle-success"
              />
            </label>
            <label className="flex flex-col items-center space-x-3">
              <span>Parking</span>
              <input
                type="checkbox"
                id="parking"
                onChange={(e) => setValue('parking', e.target.checked)}
                {...register('parking')}
                className="toggle toggle-success"
              />
            </label>
          </div>

          <textarea
            type="text"
            rows={'4'}
            id="location"
            {...register('location', {
              required: 'Location is required',
            })}
            className="w-full border  border-black  pl-12 pr-10"
            placeholder="Address"
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isSubmitting}
          >
            Update Listing
          </button>
        </form>
      </div>
    </div>
  );
};
