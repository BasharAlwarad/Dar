import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useListings } from '../contexts/ListingsContext';
import { useAuth } from '../contexts/AuthContext';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Spinner } from '../components';

export const EditListing = () => {
  const { handleUpdateListing, fetchListing, loading, listing } = useListings();
  const { user } = useAuth();
  const { listingId } = useParams();
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

  const update = (data) => {
    return handleUpdateListing(data, user, listingId, geolocationEnabled);
  };

  useEffect(() => {
    fetchListing(listingId);
  }, [listingId]);

  useEffect(() => {
    setValue('name', listing?.name);
    setValue('location', listing?.location);
    setValue('type', listing?.type);
    setValue('offer', listing?.offer);
    setValue('furnished', listing?.furnished);
    setValue('parking', listing?.parking);
    setValue('bathrooms', listing?.bathrooms);
    setValue('bedrooms', listing?.bedrooms);
    setValue('regularPrice', listing?.regularPrice);
    setValue('discountedPrice', listing?.discountedPrice);
    setValue('imageUrls', listing?.imageUrls);
    setValue('geolocation', listing?.geolocation);
  }, [listing]);

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
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  if (listing?.length === 0) return <></>;
  if (loading) return <Spinner />;

  return (
    <div className="card bg-base-300 rounded-box grid p-4 place-items-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit(update)}
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
              watch('imageUrls')?.length > 0 ? 'btn-success' : 'btn-white'
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
