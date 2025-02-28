import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { Nav } from './components';

import {
  Offers,
  Explore,
  Profile,
  Signin,
  Signup,
  ForgotPassword,
  PrivateRoute,
  Category,
  Sell,
  Rent,
} from './pages';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
