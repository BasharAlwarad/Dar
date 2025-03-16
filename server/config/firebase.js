import admin from 'firebase-admin';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  serviceAccount,
  storageBucket,
  firebaseConfig,
} from '../config/config.js';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
  });
}

// Initialize Firebase Client SDK
const firebaseApp = initializeApp(firebaseConfig);

// Get Firestore and Auth
const db = admin.firestore();
const auth = getAuth(firebaseApp);

export { db, auth, admin };
