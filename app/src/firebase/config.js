// ============================================================================
// Firebase configuration
// ----------------------------------------------------------------------------
// Replace the placeholder values below with your own Firebase project's
// config, found in Firebase Console > Project Settings > General > Your apps.
// It is recommended to load these from environment variables (.env) rather
// than committing real keys to source control. A .env.example is provided.
// ============================================================================
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAEyv2U0RlHh2VH2ryWNQwYXqWqSLVo08g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hospital-manage-e7c3c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hospital-manage-e7c3c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hospital-manage-e7c3c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "329568082586",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:329568082586:web:03e0c7709ea9b2cf5fdd23",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y4WHB7C33H"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
