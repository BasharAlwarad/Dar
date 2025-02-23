import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  lockIcon,
  keyboardArrowRightIcon as arrow,
  visibilityIcon,
  personIcon,
} from '../assets/index.js';

export const Signin = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignin = async (data) => {
    try {
      console.log('handleLogin', data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSignout = async () => {
    try {
      console.log('handleLogout');
    } catch (error) {
      setMessage('Logout failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {user ? (
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">
              Welcome, {user.name}!
            </h2>
            <button onClick={handleSignout} className="w-full btn btn-primary">
              Sign out
            </button>
            {message && (
              <div className="mt-4 shadow-lg alert alert-success">
                <span>{message}</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSignin)} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Sign in</h2>

            {message && (
              <div className="shadow-lg alert alert-error">
                <span>{message}</span>
              </div>
            )}

            <div className="form-control flex flex-col space-y-3">
              <div className="relative">
                <img
                  src={personIcon}
                  alt="email icon"
                  className="absolute left-3 top-[3rem] transform -translate-y-1/2 w-6 h-6 text-gray-400"
                />
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  required
                  type={'email'}
                  className="w-full input input-bordered pl-12 pr-10"
                />
              </div>

              <div className="relative">
                <label htmlFor="password">Password</label>
                <img
                  src={lockIcon}
                  alt="Lock Icon"
                  className="absolute left-3 top-[3rem] transform -translate-y-1/2 w-6 h-6 text-gray-400"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="w-full input input-bordered pl-12 pr-10"
                />

                <img
                  src={visibilityIcon}
                  alt="Toggle Password Visibility"
                  className="absolute top-[3rem] right-3 transform -translate-y-1/2 cursor-pointer w-6 h-6"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button type="submit" className="w-full btn btn-primary">
              Sign in
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/forgot-password')}
                className="btn btn-outline ml-2 text-blue-500"
              >
                Forgot password?
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate('/register')}
                className="ml-2 text-blue-500 text-center flex justify-center flex-row hover:underline"
              >
                <span>Sign up</span> <img src={arrow} alt="arrow" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
