import { toast } from 'react-toastify';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  lockIcon,
  keyboardArrowRightIcon,
  visibilityIcon,
  personIcon,
} from '../assets/index.js';
import { OAuth } from '../components';

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSignin = async (data) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      toast.success('Signin successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      toast.error('Error: Signin failed');
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
    // <div className="flex items-center justify-center  bg-gray-100">
    <div className="flex flex-col border-opacity-50">
      <div className="card bg-base-300 rounded-box grid p-4 mt-5 place-items-center">
        <OAuth />
      </div>
      <div className="divider">OR</div>
      <div className="card bg-base-300 rounded-box grid p-4 place-items-center">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit(handleSignin)} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Sign In</h2>
            <div className="form-control flex flex-col space-y-3">
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
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/forgot-password')}
                className="btn btn-outline text-blue-500"
              >
                Forgot password?
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate('/signup')}
                className="ml-2 text-blue-500 text-center flex items-center hover:underline"
              >
                <span>Sign up</span>
                <img src={icons.arrow} alt="arrow" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    // </div>
  );
};
