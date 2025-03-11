import express from 'express';
import {
  signinUser,
  signupUser,
  logoutUser,
  resetPassword,
  checkSession,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/signin', signinUser);
router.post('/signup', signupUser);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);
router.get('/session', checkSession);

export default router;
