import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
// const firebaseConfig = process.env.FIREBASE_CONFIG;
const firebaseConfig = JSON.parse(process.env.FIREBASE_API_KEY);

export { PORT, CLIENT_URL, firebaseConfig };
