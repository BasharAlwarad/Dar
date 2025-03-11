import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, serviceAccount } from './config.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://darapp-536f4.firebaseio.com',
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, admin };
