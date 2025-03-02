import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { db } from '../firebase.config';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Spinner } from '../components';

export const CreateListing = () => {
  const [imageUrls, setImageUrls] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const isMounted = useRef(true);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setValue('imageUrls', files);
    setImageUrls(URL.createObjectURL(watch('imageUrls')[0]));
    console.log(register('imageUrls'));
  };

  const handleCreateListing = async (data) => {
    console.log(data);
    // try {
    //   await addDoc(collection(db, 'listings'), data);
    //   toast.success('Listing created successfully');
    //   navigate('/');
    // } catch (error) {
    //   toast.error('Could not create listing');
    // }
  };

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          setValue('userRef', user.uid);
          console.log(watch());
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

  if (loading) return <Spinner />;

  return (
    <div className="card bg-base-300 rounded-box grid p-4 place-items-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit(handleCreateListing)}
          className="flex flex-col space-y-1"
        >
          <h2 className="text-2xl font-semibold text-center">
            Add a new Listing
          </h2>
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
            className="w-full btn btn-secondary"
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
            type="text"
            id="location"
            {...register('location', {
              required: 'Location is required',
            })}
            className="w-full input input-bordered pl-12 pr-10"
            placeholder="Location"
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}

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

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="lat"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>
              <input
                type="number"
                id="lat"
                {...register('geolocation.lat', {
                  required: 'Latitude is required',
                })}
                className="w-full input input-bordered"
              />
              {errors.geolocation?.lat && (
                <p className="text-red-500">{errors.geolocation.lat.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lng"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>
              <input
                type="number"
                id="lng"
                {...register('geolocation.lng', {
                  required: 'Longitude is required',
                })}
                className="w-full input input-bordered"
              />
              {errors.geolocation?.lng && (
                <p className="text-red-500">{errors.geolocation.lng.message}</p>
              )}
            </div>
          </div>

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

          <label className="flex items-center space-x-3">
            <span>Offer</span>
            <input
              type="checkbox"
              id="offer"
              {...register('offer')}
              className="checkbox"
            />
          </label>

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isSubmitting}
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
