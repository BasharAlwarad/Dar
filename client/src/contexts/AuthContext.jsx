import axios from 'axios';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [{ user, loading }, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/session`, {
          withCredentials: true, // Ensures cookies are sent with the request
        });

        if (res.data.authenticated) {
          dispatch({ type: 'SET_USER', payload: res.data.user });
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkSession();
  }, []);

  const handleSignin = async (email, password) => {
    const auth = getAuth();

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken(); // ✅ Correct token

      // Send ID token to backend
      const res = await axios.post(
        `${API_URL}/user/signin`,
        { idToken },
        { withCredentials: true }
      );

      console.log('Server response:', res.data);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // const handleSignin = async (data) => {
  //   try {
  //     const res = await axios.post(`${API_URL}/user/signin`, data, {
  //       withCredentials: true, // Ensure cookies are sent
  //     });

  //     dispatch({ type: 'SET_USER', payload: res.data?.user });
  //     console.log(res.data?.user);
  //     toast.success('Sign in successful!');
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     navigate('/');
  //   } catch (error) {
  //     toast.error('Error: Sign in failed');
  //   }
  // };

  // const handleSignin = async (data) => {
  //   try {
  //     // Send a POST request to the backend
  //     const res = await axios.post(`${API_URL}/user/signin`, data, {
  //       withCredentials: true, // Ensures that cookies are sent/received
  //     });

  //     // Set user data in the global state (e.g., Redux)
  //     dispatch({ type: 'SET_USER', payload: res.data?.user });

  //     // Store the custom token from the response in a cookie if necessary
  //     document.cookie = `token=${res.data.token}; path=/; HttpOnly; Secure; SameSite=Strict`;

  //     toast.success('Sign in successful!');
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     navigate('/'); // Navigate to the homepage or dashboard after successful sign-in
  //   } catch (error) {
  //     toast.error('Error: Sign in failed');
  //   }
  // };

  // const handleSignin = async (data) => {
  //   try {
  //     const res = await axios.post(`${API_URL}/user/signin`, data, {
  //       withCredentials: true,
  //     });

  //     // Update the user state
  //     dispatch({ type: 'SET_USER', payload: res.data?.user });

  //     toast.success('Sign in successful!');
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     navigate('/');
  //   } catch (error) {
  //     toast.error('Error: Sign in failed');
  //   }
  // };

  const handleSignup = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/user/signup`, data, {
        withCredentials: true,
      });

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
      await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
      dispatch({ type: 'SET_USER', payload: null });
      toast.success('Sign out successful!');
      navigate('/');
    } catch (error) {
      toast.error('Error: Sign out failed');
    }
  };

  const handleForgetPassword = async (data) => {
    try {
      await axios.post(`${API_URL}/user/reset-password`, data);
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
