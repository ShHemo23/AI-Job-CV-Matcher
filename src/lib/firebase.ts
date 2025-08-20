
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "freelancezen-jateh",
  "appId": "1:783020198975:web:9745f187e0dd103511bc8a",
  "storageBucket": "freelancezen-jateh.firebasestorage.app",
  "apiKey": "AIzaSyBQ7gF0EpbZ0-AUzccVy2qRJus7OZhONhI",
  "authDomain": "freelancezen-jateh.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "783020198975"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
