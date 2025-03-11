import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase-admin/storage'; // Use Firebase Admin SDK
import { getAuth } from 'firebase/auth';
import { firebaseConfig, serviceAccount } from './config.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'darapp-536f4.appspot.com', // Ensure this matches your Firebase Storage bucket
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(); // Use Firebase Admin SDK
const auth = getAuth(app);

export { db, storage, auth, admin };

// import admin from 'firebase-admin';
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getAuth } from 'firebase/auth';

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://darapp-536f4.firebaseio.com',
// });

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const auth = getAuth(app);

// export { db, storage, auth, admin };
