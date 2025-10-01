import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB4Lcm36gvIon6hM93f_O4vBFubDe7PB5U',
  authDomain: 'rajhans001-fa156.firebaseapp.com',
  projectId: 'rajhans001-fa156',
  storageBucket: 'rajhans001-fa156.firebasestorage.app',
  messagingSenderId: '372023550449',
  appId: '1:372023550449:web:4410d181e6315ed9976450',
  measurementId: 'G-Y2YY37ET32'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

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