import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Themes } from '../components';
import { Link, useNavigate } from 'react-router-dom';

export const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(auth.currentUser);
    console.log('Profile:', auth.currentUser);
  }, []);

  const handleSignout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div>
      {user ? (
        <>
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">
              {user?.displayName}, would you like to Sign out?
            </h2>
            <button onClick={handleSignout} className="btn btn-primary">
              Sign out!
            </button>
          </div>
        </>
      ) : (
        <Link to="/signin">Sign in</Link>
      )}
      <Themes />
    </div>
  );
};
