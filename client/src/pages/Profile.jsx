import React from 'react';
import { Themes } from '../components';
import { Link } from 'react-router-dom';

export const Profile = () => {
  return (
    <div>
      <Link to="/signin">Signin</Link>
      <Themes />
    </div>
  );
};
