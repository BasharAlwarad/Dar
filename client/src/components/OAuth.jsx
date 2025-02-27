import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config.jsx';
import { toast } from 'react-toastify';
import { googleIcon } from '../assets';

export const OAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const icons = useMemo(
    () => ({
      google: googleIcon,
    }),
    []
  );

  const handleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          timeStamp: serverTimestamp(),
        });
      }
      toast.success('Signin successful!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      toast.error('Error: Signin failed');
    }
  };

  return (
    <div>
      <button onClick={handleClick} className="btn btn-primary btn-block">
        <img src={icons.google} alt="google" className="w-6 h-6" />
        <span>
          Sign {location.pathname === '/signup' ? 'up' : 'in'} with Google
        </span>
      </button>
    </div>
  );
};
