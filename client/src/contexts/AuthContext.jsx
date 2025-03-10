import { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user, loading, handleSignin, handleSignup, handleForgetPassword } =
    context;
  return { user, loading, handleSignin, handleSignup, handleForgetPassword };
};

// import { createContext, useContext, useReducer, useEffect } from 'react';
// import authReducer from '../reducers/AuthReducer';
// import { useNavigate } from 'react-router-dom';
// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
//   getAuth,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   onAuthStateChanged,
//   updatePassword,
// } from 'firebase/auth';
// import { setDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase.config.jsx';
// import { toast } from 'react-toastify';

// const AuthContext = createContext();

// const initialState = {
//   auth: getAuth(),
//   currentUser: getAuth().currentUser,
//   loading: true,
// };

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [{ auth, currentUser, loading }, dispatch] = useReducer(
//     authReducer,
//     initialState
//   );

//   useEffect(() => {
//     dispatch({
//       type: 'SET_CURRENT_USER',
//       payload: getAuth().currentUser,
//     });

//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       dispatch({
//         type: 'SET_CURRENT_USER',
//         payload: currentUser,
//       });
//       dispatch({
//         type: 'SET_LOADING',
//         payload: false,
//       });
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSignin = async (data) => {
//     try {
//       const auth = getAuth();
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );
//       toast.success('Sign in successful!');
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       navigate('/');
//     } catch (error) {
//       toast.error('Error: Sign in failed');
//     }
//   };

//   const handleForgetPassword = async (data) => {
//     try {
//       await sendPasswordResetEmail(getAuth(), data.email);
//       toast.success('Password reset email sent!');
//     } catch (error) {
//       toast.error('Password reset email failed!');
//     }
//   };

//   const handleSignup = async (data) => {
//     try {
//       const auth = getAuth();
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );
//       await updateProfile(auth.currentUser, {
//         displayName: data.name,
//       });

//       const formDataCopy = {
//         ...data,
//         uid: userCredential.user.uid,
//         timeStamp: serverTimestamp(),
//       };
//       delete formDataCopy.password;

//       await setDoc(doc(db, 'users', userCredential.user.uid), formDataCopy);

//       toast.success('Signup successful!');
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       navigate('/');
//     } catch (error) {
//       toast.error('Error: Signup failed');
//     }
//   };

//   // TODO: fix update password
//   const handleUpdateUser = async (data) => {
//     console.log(currentUser, data);
//     try {
//       if (data.name !== currentUser.displayName) {
//         await updateProfile(auth.currentUser, { displayName: data.name });
//         await updateDoc(doc(db, 'users', currentUser.uid), {
//           displayName: data.name,
//         });
//       }
//       if (data.password) {
//         await updatePassword(auth.currentUser, data.password);
//       }
//       toast.success('Profile updated successfully!');
//       // setShowForm(false);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleSignout = () => {
//     auth.signOut();
//     navigate('/');
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         loading,
//         toast,
//         auth,
//         handleSignin,
//         handleSignup,
//         handleSignout,
//         handleUpdateUser,
//         handleForgetPassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   const {
//     currentUser,
//     loading,
//     toast,
//     auth,
//     handleSignin,
//     handleSignup,
//     handleSignout,
//     handleUpdateUser,
//     handleForgetPassword,
//   } = context;
//   return {
//     currentUser,
//     loading,
//     toast,
//     auth,
//     handleSignin,
//     handleSignup,
//     handleSignout,
//     handleUpdateUser,
//     handleForgetPassword,
//   };
// };
