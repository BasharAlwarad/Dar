import admin from 'firebase-admin';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import {
  serviceAccount,
  storageBucket,
  firebaseConfig,
} from '../config/config.js';

// Check if Firebase is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
  });
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(firebaseApp);
// const auth = getAuth();

export { db, auth, admin };

// import admin from 'firebase-admin';
// import { initializeApp } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase/auth';
// import {
//   serviceAccount,
//   // firebaseConfig,
//   storageBucket,
// } from '../config/config.js';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCJ__eHr6OSASdbW-iTUwAYIAKhWncOK7Q',
//   authDomain: 'darapp-536f4.firebaseapp.com',
//   projectId: 'darapp-536f4',
//   storageBucket: 'darapp-536f4.firebasestorage.app',
//   messagingSenderId: '919737320436',
//   appId: '1:919737320436:web:d72ac707756a2f514b2fa1',
//   measurementId: 'G-8C8GBXV29D',
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket,
// });

// const app = initializeApp(firebaseConfig);
// const db = admin.firestore();
// // const db = getFirestore(app);
// const auth = getAuth(app);

// export { db, auth, admin };
