// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_API_KEY);

initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore();
