import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { db } from '../firebase.config.jsx';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import {
  lockIcon,
  keyboardArrowRightIcon,
  visibilityIcon,
  personIcon,
} from '../assets/index.js';

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSignup = async (data) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });

      const formDataCopy = {
        ...data,
        uid: userCredential.user.uid,
        timeStamp: serverTimestamp(),
      };
      delete formDataCopy.password;
      toast.success('Signup successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      toast.error('Error: Signup failed');
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
          <div className="form-control flex flex-col space-y-3">
            <div className="relative">
              <img
                src={icons.person}
                alt="Person Icon"
                className="absolute left-3 top-[3rem] transform -translate-y-1/2 w-6 h-6 text-gray-400"
              />
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                })}
                className="w-full input input-bordered pl-12 pr-10"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="relative">
              <img
                src={icons.person}
                alt="Email Icon"
                className="absolute left-3 top-[3rem] transform -translate-y-1/2 w-6 h-6 text-gray-400"
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full input input-bordered pl-12 pr-10"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password">Password</label>
              <img
                src={icons.lock}
                alt="Lock Icon"
                className="absolute left-3 top-[3rem] transform -translate-y-1/2 w-6 h-6 text-gray-400"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full input input-bordered pl-12 pr-10"
              />
              <img
                src={icons.visibility}
                alt={showPassword ? 'Hide Password' : 'Show Password'}
                aria-label="Toggle Password Visibility"
                className="absolute top-[3rem] right-3 transform -translate-y-1/2 cursor-pointer w-6 h-6"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              />
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
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate('/signin')}
              className="ml-2 text-blue-500 text-center flex items-center hover:underline"
            >
              <span>Sign in</span>
              <img src={icons.arrow} alt="arrow" className="ml-1 w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
