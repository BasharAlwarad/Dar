import axios from 'axios';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [{ user, loading }, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/v1/user/session',
          {
            withCredentials: true,
          }
        );
        if (res.data.authenticated) {
          dispatch({ type: 'SET_USER', payload: res.data.user });
        }
      } catch (error) {
        console.error('Session check failed', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkSession();
  }, []);

  const handleSignin = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/user/signin',
        data,
        { withCredentials: true }
      );

      // Update the user state
      dispatch({ type: 'SET_USER', payload: res.data?.user });

      toast.success('Sign in successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      toast.error('Error: Sign in failed');
    }
  };

  const handleSignup = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/user/signup',
        data,
        { withCredentials: true }
      );

      // Update the user state
      dispatch({ type: 'SET_USER', payload: res.data?.user });

      toast.success('Sign up successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      toast.error('Error: Sign up failed');
    }
  };

  const handleSignout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/v1/user/logout',
        {},
        { withCredentials: true }
      );
      dispatch({ type: 'SET_USER', payload: null });
      toast.success('Sign out successful!');
      navigate('/');
    } catch (error) {
      toast.error('Error: Sign out failed');
    }
  };

  const handleForgetPassword = async (data) => {
    try {
      await axios.post(
        'http://localhost:8080/api/v1/user/reset-password',
        data
      );
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Password reset email failed!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        handleSignin,
        handleSignup,
        handleSignout,
        handleForgetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const {
    user,
    loading,
    handleSignin,
    handleSignup,
    handleSignout,
    handleForgetPassword,
  } = context;
  return {
    user,
    loading,
    handleSignin,
    handleSignup,
    handleSignout,
    handleForgetPassword,
  };
};
