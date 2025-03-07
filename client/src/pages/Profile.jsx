import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { set, useForm } from 'react-hook-form';
import { getAuth, updateProfile, updatePassword } from 'firebase/auth';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';

import { ListingItem, Spinner } from '../components';

import {
  lockIcon,
  keyboardArrowRightIcon,
  visibilityIcon,
  personIcon,
} from '../assets/index.js';

export const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setUser(auth.currentUser);
        setValue('name', auth.currentUser.displayName || '');

        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('user', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchUserListings();
  }, [auth.currentUser, setValue]);

  const handleSignout = () => {
    auth.signOut();
    navigate('/');
  };

  // TODO: fix update password
  const handleUpdate = async (data) => {
    console.log(user, data);
    try {
      if (data.name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.name });
        await updateDoc(doc(db, 'users', user.uid), { displayName: data.name });
      }
      if (data.password) {
        await updatePassword(auth.currentUser, data.password);
      }
      toast.success('Profile updated successfully!');
      setShowForm(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const icons = useMemo(
    () => ({
      lock: lockIcon,
      arrow: keyboardArrowRightIcon,
      visibility: visibilityIcon,
      person: personIcon,
    }),
    []
  );

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
              <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
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
      {loading && <Spinner />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {listings?.map(({ data, id }) => (
          <ListingItem key={id} listing={{ ...data, id }} />
        ))}
      </div>
    </div>
  );
};
