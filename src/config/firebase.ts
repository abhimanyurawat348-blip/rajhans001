import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use environment variables for Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB4Lcm36gvIon6hM93f_O4vBFubDe7PB5U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rajhans001-fa156.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rajhans001-fa156",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rajhans001-fa156.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "372023550449",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:372023550449:web:4410d181e6315ed9976450",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y2YY37ET32"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export let analytics: ReturnType<typeof getAnalytics> | null = null;
// Initialize Analytics only when supported and in browser
(async () => {
  try {
    if (typeof window !== 'undefined' && (await analyticsIsSupported())) {
      analytics = getAnalytics(app);
    }
  } catch {
    analytics = null;
  }
})();

export default app;