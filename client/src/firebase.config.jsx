// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

const firebaseConfig = {
  apiKey: 'AIzaSyCJ__eHr6OSASdbW-iTUwAYIAKhWncOK7Q',
  authDomain: 'darapp-536f4.firebaseapp.com',
  projectId: 'darapp-536f4',
  storageBucket: 'darapp-536f4.firebasestorage.app',
  messagingSenderId: '919737320436',
  appId: '1:919737320436:web:d72ac707756a2f514b2fa1',
  measurementId: 'G-8C8GBXV29D',
};

initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore();
