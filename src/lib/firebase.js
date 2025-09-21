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

  apiKey: "AIzaSyCU4sW45ln5H4Idg1tayTpZWRrCh53_vng",
  authDomain: "edukyuadminpanel.firebaseapp.com",
  projectId: "edukyuadminpanel",
  storageBucket: "edukyuadminpanel.firebasestorage.app",
  messagingSenderId: "274103392220",
  appId: "1:274103392220:web:332b286542ce55e391a119"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCU4sW45ln5H4Idg1tayTpZWRrCh53_vng",
//   authDomain: "edukyuadminpanel.firebaseapp.com",
//   projectId: "edukyuadminpanel",
//   storageBucket: "edukyuadminpanel.firebasestorage.app",
//   messagingSenderId: "274103392220",
//   appId: "1:274103392220:web:332b286542ce55e391a119"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);