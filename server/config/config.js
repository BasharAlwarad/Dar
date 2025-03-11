import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
// const firebaseConfig = process.env.FIREBASE_CONFIG;
const firebaseConfig = JSON.parse(process.env.FIREBASE_API_KEY);
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

export { PORT, CLIENT_URL, firebaseConfig, serviceAccount };
