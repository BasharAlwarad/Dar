import { createContext, useContext, useReducer, useEffect } from 'react';
import authReducer from '../reducers/AuthReducer';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config.jsx';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [{ user, loading, error, message }, dispatch] = useReducer(
    authReducer,
    initialState
  );

  const handleSignin = async (data) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      toast.success('Sign in successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        toast,
        handleSignin,
        handleSignup,
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
  return context;
};
