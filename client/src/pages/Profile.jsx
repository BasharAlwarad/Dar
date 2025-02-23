import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Themes } from '../components';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
    console.log('Profile:', auth.currentUser);
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome {user.displayName}</h1>
          <Link to="/signout">Sign out</Link>
        </>
      ) : (
        <Link to="/signin">Sign in</Link>
      )}
      <Themes />
    </div>
  );
};
