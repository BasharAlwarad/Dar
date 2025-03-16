import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth, admin } from '../config/firebase.js';
// import admin from '../config/firebaseAdmin.js'; // Import Firebase Admin SDK
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

export const signinUser = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await admin.auth().getUser(decodedToken.uid);

    // Set the ID token in a cookie
    res.cookie('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({
      message: 'Sign in successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Sign In Error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
});

// User Sign In
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
//     console.log(auth);
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

// export const signinUser = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     // Authenticate user with email and password
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Generate a Firebase custom token for the user
//     const customToken = await admin.auth().createCustomToken(user.uid);

//     // Set the token in a cookie
//     res.cookie('token', customToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//     });

//     // Respond with user details
//     res.status(200).json({
//       message: 'Sign in successful',
//       user: {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//       },
//     });
//   } catch (error) {
//     console.error('Sign In Error:', error);
//     res.status(401).json({ message: 'Invalid email or password' });
//   }
// });

// export const signinUser = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   try {
//     // Verify the user's email and retrieve user data
//     const userRecord = await admin.auth().getUserByEmail(email);

//     // Generate a custom Firebase token for the user
//     const customToken = await admin.auth().createCustomToken(userRecord.uid);

//     // Set the custom token in a cookie
//     res.cookie('token', customToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // Ensure 'secure' flag is true in production
//       sameSite: 'Strict', // Prevent the cookie from being sent in cross-origin requests
//     });

//     // Respond with user data
//     res.status(200).json({
//       message: 'Sign in successful',
//       user: {
//         uid: userRecord.uid,
//         email: userRecord.email,
//         displayName: userRecord.displayName,
//       },
//       token: customToken, // You can send this if needed in the response
//     });
//   } catch (error) {
//     console.error('Sign In Error:', error);
//     next(new CustomError('Sign in failed', 401)); // Error handler
//   }
// });

// export const signinUser = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     // Instead of using signInWithEmailAndPassword, use admin.auth() for server-side authentication
//     const userRecord = await admin.auth().getUserByEmail(email);

//     // You can now generate a custom token or perform additional actions here
//     const customToken = await admin.auth().createCustomToken(userRecord.uid);

//     // Send custom token or any user-related information
//     res.status(200).json({
//       message: 'Sign in successful',
//       user: {
//         uid: userRecord.uid,
//         email: userRecord.email,
//         displayName: userRecord.displayName,
//       },
//       token: customToken, // Example of sending a token to the client
//     });
//   } catch (error) {
//     console.error('Sign In Error:', error);
//     next(new CustomError('Sign in failed', 401));
//   }
// });

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
    console.log('Profile updated');

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
    console.log('Received token:', token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('decodedToken', decodedToken);
    const user = await admin.auth().getUser(decodedToken.uid);
    console.log('user', user);

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
