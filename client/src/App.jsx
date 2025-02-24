import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './components';

import {
  Offer,
  Explore,
  Profile,
  Signin,
  Signup,
  ForgotPassword,
} from './pages';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
