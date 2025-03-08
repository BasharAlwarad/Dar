import {
  createContext,
  useMemo,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import authReducer from '../reducers/AuthReducer';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
  message: null,
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

  return (
    <AuthContext.Provider
      value={{ user, loading, error, toast, message, handleSignin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log('useAuth must be used within an AuthProvider');
    // throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// export const useAuth = () => useContext(AuthContext);
