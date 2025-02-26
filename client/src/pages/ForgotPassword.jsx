import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { set, useForm } from 'react-hook-form';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import {
  keyboardArrowRightIcon as arrow,
  visibilityIcon as visibility,
} from '../assets';

export const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const icons = useMemo(
    () => ({
      arrow,
      visibility,
    }),
    []
  );

  const handleUpdate = async (data) => {
    console.log(data);
    try {
      const x = await sendPasswordResetEmail(getAuth(), data.email);
      console.log(x);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Password reset email failed!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="form-control flex flex-col space-y-3">
          <div className="relative">
            <label htmlFor="email">Email</label>
            <input
              id="mail"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email',
                },
              })}
              className="w-full input input-bordered"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
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
              className="absolute right-3 top-1/2 transform -translate-y-1/6"
            >
              <img
                src={icons.visibility}
                alt="Toggle Password Visibility"
                className="w-6 h-6"
              />
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full btn mt-3 btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      <Link to="/signin" className="text-sm text-primary">
        Back to Sign in
      </Link>
    </div>
  );
};
