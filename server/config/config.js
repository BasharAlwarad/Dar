import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const firebaseConfig = process.env.FIREBASE_CONFIG;

export { PORT, CLIENT_URL, firebaseConfig };
