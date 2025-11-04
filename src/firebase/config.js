// src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhpwrztqBBudSNBlBRD1CSIstE7D8vTHA",
  authDomain: "career-side-cfa25.firebaseapp.com",
  projectId: "career-side-cfa25",
  storageBucket: "career-side-cfa25.appspot.com",
  messagingSenderId: "700464838327",
  appId: "1:700464838327:web:04eb0e891a935f82757f32",
  measurementId: "G-S441HDJ16Q"
};

// ✅ Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Collections
export const COLLECTIONS = {
  ADMINS: 'admins',
  INSTITUTIONS: 'institutions',
  STUDENTS: 'students',
  COMPANIES: 'companies',
  FACULTIES: 'faculties',
  COURSES: 'courses',
  APPLICATIONS: 'applications',
  JOB_POSTINGS: 'job_postings',
  JOB_APPLICATIONS: 'job_applications',
  NOTIFICATIONS: 'notifications',
  TRANSCRIPTS: 'transcripts'
};

export { auth, db, storage };
export default app;
