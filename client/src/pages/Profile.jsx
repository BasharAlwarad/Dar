import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';

import { ListingItem, Spinner } from '../components';

import {
  lockIcon,
  keyboardArrowRightIcon,
  visibilityIcon,
  personIcon,
} from '../assets/index.js';

export const Profile = () => {
  const { user, handleUpdateUser, handleSignout } = useAuth();
  const { fetchUserListings, loading, listings } = useListings();
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    if (user) {
      console.log(user?.displayName);
      setValue('name', user?.displayName);
      fetchUserListings(user?.uid);
    }
  }, [user]);

  const icons = useMemo(
    () => ({
      lock: lockIcon,
      arrow: keyboardArrowRightIcon,
      visibility: visibilityIcon,
      person: personIcon,
    }),
    []
  );

  if (loading) return <Spinner />;

  return (
    <div>
      {user ? (
        <>
          <div className="text-center">
            <button onClick={handleSignout} className="btn btn-primary">
              Sign out!
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-secondary"
            >
              Change Profile
            </button>
          </div>
          {showForm && (
            <div className="max-w-md mx-auto mt-6 p-4 bg-base-200 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center mb-4">
                Update Profile
              </h3>
              <form
                onSubmit={handleSubmit((data) => handleUpdateUser(data))}
                className="space-y-6"
              >
                <div className="form-control flex flex-col space-y-3">
                  <div className="relative">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      {...register('name', {
                        minLength: {
                          value: 3,
                          message: 'Name must be at least 3 characters',
                        },
                      })}
                      className="w-full input input-bordered"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className="w-full input input-bordered"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <img
                        src={icons.visibility}
                        alt="Toggle Password Visibility"
                        className="w-6 h-6"
                      />
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <Link to="/sign-in">Sign in</Link>
      )}
      <button className="btn btn-secondary">
        <Link to={`/create-listing`}>Add a new Listing</Link>
      </button>
      {/* {loading && <Spinner />} */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {user &&
          listings?.map((listing) => (
            <ListingItem key={listing?.id} listing={listing} />
          ))}
      </div>
    </div>
  );
};
