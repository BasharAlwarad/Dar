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
import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024,
  },
});

const router = express.Router();

router.get('/', getListings);
router.get('/more', fetchMoreListings);
router.get('/:listingId', getListing);
router.post('/', upload.array('imageUrls', 6), createListing);
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
