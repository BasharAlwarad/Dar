import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth, admin } from '../config/firebase.js';
// import admin from '../config/firebaseAdmin.js'; // Import Firebase Admin SDK
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// User Sign In
export const signinUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get the Firebase token
    const token = await user.getIdToken();

    // Send the token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send user data in the response
    res.status(200).json({
      message: 'Sign in successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    next(new CustomError('Sign in failed', 401));
  }
});

// User Sign Up
export const signupUser = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, { displayName: name });

    // Save user data to Firestore
    const formDataCopy = {
      email,
      name,
      uid: user.uid,
      timestamp: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', user.uid), formDataCopy);

    // Get the Firebase token
    const token = await user.getIdToken();

    // Send the token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send user data in the response
    res.status(201).json({
      message: 'Sign up successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    next(new CustomError('Sign up failed', 401));
  }
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

// Password Reset
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    next(new CustomError('Password reset email failed', 401));
  }
});

// Check Session
export const checkSession = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);

    res.status(200).json({
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
// } from 'firebase/auth';
// import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
// import { db, auth } from '../config/firebase.js';
// import { CustomError } from '../utils/errorHandler.js';
// import asyncHandler from '../utils/asyncHandler.js';
// import jwt from 'jsonwebtoken';

// // User Sign In
// export const signinUser = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Get the Firebase token
//     const token = await user.getIdToken();

//     // Send the token as a cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     // Send user data in the response
//     res.status(200).json({
//       message: 'Sign in successful',
//       user: {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//       },
//     });
//   } catch (error) {
//     next(new CustomError('Sign in failed', 401));
//   }
// });

// // User Sign Up
// export const signupUser = asyncHandler(async (req, res, next) => {
//   const { email, password, name } = req.body;

//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Update user profile
//     await updateProfile(user, { displayName: name });

//     // Save user data to Firestore
//     const formDataCopy = {
//       email,
//       name,
//       uid: user.uid,
//       timestamp: serverTimestamp(),
//     };
//     await setDoc(doc(db, 'users', user.uid), formDataCopy);

//     // Get the Firebase token
//     const token = await user.getIdToken();

//     // Send the token as a cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     // Send user data in the response
//     res.status(201).json({
//       message: 'Sign up successful',
//       user: {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//       },
//     });
//   } catch (error) {
//     next(new CustomError('Sign up failed', 401));
//   }
// });

// // User Logout
// export const logoutUser = (req, res) => {
//   res.clearCookie('token', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
//     path: '/',
//   });

//   res.status(200).json({ message: 'Logout successful' });
// };

// // Password Reset
// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     await sendPasswordResetEmail(auth, email);
//     res.status(200).json({ message: 'Password reset email sent!' });
//   } catch (error) {
//     next(new CustomError('Password reset email failed', 401));
//   }
// });

// // Check Session
// export const checkSession = asyncHandler(async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ authenticated: false });
//   }

//   try {
//     const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
//     const user = await auth.getUser(decodedToken.uid);

//     res.status(200).json({
//       authenticated: true,
//       user: {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//       },
//     });
//   } catch (error) {
//     res.status(401).json({ authenticated: false });
//   }
// });
