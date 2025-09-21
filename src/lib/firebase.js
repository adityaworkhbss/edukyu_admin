import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
  // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID

  apiKey: "AIzaSyDD-BryPOIVRk4BzKN_m5GmV3O_vCimoyw",
  authDomain: "edukyuadmin.firebaseapp.com",
  projectId: "edukyuadmin",
  storageBucket: "edukyuadmin.firebasestorage.app",
  messagingSenderId: "886723884559",
  appId: "1:886723884559:web:50c676c0c7b9200c92557a",
  measurementId: "G-0Z3391L40H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;