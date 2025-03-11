import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  serviceAccount,
  firebaseConfig,
  storageBucket,
} from '../config/config.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket,
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, admin };
