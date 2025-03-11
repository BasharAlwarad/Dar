import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase.js';
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// User Sign In
export const signinUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    user: userCredential.user,
  });
});

// User Logout
export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logout successful' });
};

// Check Session
export const checkSession = (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};

// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
//   getAuth,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   onAuthStateChanged,
// } from 'firebase/auth';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../config/firebase.js';
// import { CustomError } from '../utils/errorHandler.js';
// import asyncHandler from '../utils/asyncHandler.js';
// // import User from '../models/userModel.js';
// // import jwt from 'jsonwebtoken';
// // import bcrypt from 'bcrypt';
// // import { bucket } from '../config/firebase.js';

// // // Get all users
// // export const getUsers = asyncHandler(async (req, res, next) => {
// //   const users = await User.find();
// //   res.status(200).json(users);
// // });

// // // Get user by ID
// // export const getUserById = asyncHandler(async (req, res, next) => {
// //   const user = await User.findById(req.params.id);
// //   if (!user) {
// //     throw new CustomError('User not found', 404);
// //   }
// //   res.status(200).json(user);
// // });

// // // Create a new user

// // export const createUser = asyncHandler(async (req, res, next) => {
// //   const { name, email, password, role } = req.body;
// //   const image = req.file;
// //   const hashedPassword = await bcrypt.hash(password, 10);

// //   const newUser = new User({
// //     name,
// //     email,
// //     password: hashedPassword,
// //     role,
// //   });

// //   if (image) {
// //     try {
// //       const blob = bucket.file(
// //         `images/${name}/${Date.now()}_${image.originalname}`
// //       );
// //       const blobStream = blob.createWriteStream({
// //         metadata: { contentType: image.mimetype },
// //       });

// //       await new Promise((resolve, reject) => {
// //         blobStream.on('error', (err) =>
// //           reject(new CustomError('Image upload failed', 500))
// //         );
// //         blobStream.on('finish', resolve);
// //         blobStream.end(image.buffer);
// //       });

// //       // Get signed URL after upload
// //       const signedUrl = await blob.getSignedUrl({
// //         action: 'read',
// //         expires: '03-01-2500',
// //       });
// //       newUser.image = signedUrl[0];
// //     } catch (error) {
// //       return next(new CustomError('Image upload failed', 500));
// //     }
// //   }

// //   await newUser.save();
// //   res.status(201).json(newUser);
// // });

// // // Update user by ID
// // export const updateUser = asyncHandler(async (req, res, next) => {
// //   const userId = req.params.id;
// //   const updates = req.body;

// //   if (updates.password) {
// //     updates.password = await bcrypt.hash(updates.password, 10);
// //   }

// //   const updatedUser = await User.findByIdAndUpdate(userId, updates, {
// //     new: true,
// //     runValidators: true,
// //   });

// //   if (!updatedUser) {
// //     throw new CustomError('User not found', 404);
// //   }

// //   res.status(200).json(updatedUser);
// // });

// // // Delete user by ID
// // export const deleteUser = asyncHandler(async (req, res, next) => {
// //   const userId = req.params.id;

// //   const deletedUser = await User.findByIdAndDelete(userId);
// //   if (!deletedUser) {
// //     throw new CustomError('User not found', 404);
// //   }

// //   res.status(204).json({ message: 'User deleted successfully' });
// // });

// // User Sign In
// export const signInUser = asyncHandler(async (req, res, next) => {
//   const data = req.body;
//   console.log(data);

//   const auth = getAuth();
//   const userCredential = await signInWithEmailAndPassword(
//     auth,
//     data.email,
//     data.password
//   );

//   res.status(200).json({
//     message: 'Sign in successful',
//     userCredential,
//   });
// });

// // // User Logout
// // export const logoutUser = (req, res) => {
// //   res.clearCookie('token', {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === 'production',
// //     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
// //     path: '/',
// //   });

// //   res.status(200).json({ message: 'Logout successful' });
// // };

// // // Check Session
// // export const checkSession = (req, res) => {
// //   if (req.user) {
// //     res.json({ authenticated: true, user: req.user });
// //   } else {
// //     res.json({ authenticated: false });
// //   }
// // };
