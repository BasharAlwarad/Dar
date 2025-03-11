import express from 'express';
import {
  getListings,
  fetchMoreListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
} from '../controllers/listingControllers.js';

const router = express.Router();

router.get('/', getListings);
router.get('/more', fetchMoreListings);
router.get('/:listingId', getListing);
router.post('/', createListing);
router.put('/:listingId', updateListing);
router.delete('/:listingId', deleteListing);
router.get('/user/:userId', getUserListings);

export default router;

// import express from 'express';
// import {
//   getListings,
//   //   signupUser,
//   //   logoutUser,
//   //   resetPassword,
//   //   checkSession,
// } from '../controllers/listingControllers.js';

// const router = express.Router();

// router.get('/', getListings);

// export default router;
