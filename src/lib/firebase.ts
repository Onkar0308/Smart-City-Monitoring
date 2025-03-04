import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABBuJMkO38Xs0eGHX1CYaDPt5R2mFlXuQ",
  authDomain: "smart-city-monitoring-ee406.firebaseapp.com",
  projectId: "smart-city-monitoring-ee406",
  storageBucket: "smart-city-monitoring-ee406.firebasestorage.app",
  messagingSenderId: "326178520415",
  appId: "1:326178520415:web:0f078ec3de8b0b31b1caea",
  measurementId: "G-3H16XMZ68Q"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;

// Export instances
export { auth, db, analytics };
export default firebaseApp;