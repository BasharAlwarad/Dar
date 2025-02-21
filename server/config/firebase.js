// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();

// STORAGE RULES

// rules_version = '2';
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if
//       request.auth != null &&
//       request.resource.size < 2 * 1024 * 1024 && //2MB
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }

// FIRESTORE RULES

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /listings/{listing} {
//     	allow read;
//       allow create: if request.auth != null && request.resource.data.imgUrls.size() < 7;
//     	allow delete: if resource.data.userRef == request.auth.uid;
//     }

//     match /users/{user} {
//     	allow read;
//     	allow create;
//     	allow update: if request.auth.uid == user
//     }
//   }
// }
