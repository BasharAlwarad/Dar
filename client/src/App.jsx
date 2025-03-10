// FIX:
// HACK:
// FIXME:
// DEBUG:
// TODO:
// REVIEW:
// OPTIMIZE:

import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ListingsProvider } from './contexts/ListingsContext';
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
  CreateListing,
  Listing,
  Contact,
  EditListing,
} from './pages';
export default function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          {/* DONE:  */}
          <Route path="/category/:categoryName" element={<Category />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/contact/:userId" element={<Contact />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <ToastContainer />
      </ListingsProvider>
    </AuthProvider>
  );
}
