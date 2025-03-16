import axios from 'axios';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

const API_URL = import.meta.env.VITE_API_URL;

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
    //     const checkSession = async () => {
    //   try {
    //     const res = await axios.get(`${API_URL}/user/session`, {
    //       withCredentials: true, // Ensures cookies are sent with the request
    //     });

    //     if (res.data.authenticated) {
    //       dispatch({ type: 'SET_USER', payload: res.data.user });
    //     } else {
    //       dispatch({ type: 'SET_USER', payload: null });
    //     }
    //   } catch (error) {
    //     console.error('Session check failed:', error);
    //     dispatch({ type: 'SET_USER', payload: null });
    //   } finally {
    //     dispatch({ type: 'SET_LOADING', payload: false });
    //   }
    // };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch({ type: 'SET_USER', payload: currentUser });
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => unsubscribe();
  }, []);

  const handleSignin = async (data) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const idToken = await userCredential.user.getIdToken();

      const res = await axios.post(
        `${API_URL}/user/signin`,
        { idToken },
        { withCredentials: true }
      );
      dispatch({ type: 'SET_USER', payload: res.data.user });

      console.log('Server response:', res.data);
      toast.success('Sign in successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // navigate('/');
    } catch (error) {
      toast.error('Error: Sign in failed');
    }
  };

  const handleForgetPassword = async (data) => {
    try {
      await sendPasswordResetEmail(getAuth(), data.email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Password reset email failed!');
    }
  };

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

      await setDoc(doc(db, 'users', userCredential.user.uid), formDataCopy);

      toast.success('Signup successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      toast.error('Error: Signup failed');
    }
  };

  const handleSignout = () => {
    const auth = getAuth();
    auth.signOut();
    navigate('/');
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
