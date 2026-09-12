import { initializeApp } from 'firebase/app';
import { type Analytics, isSupported as isAnalyticsSupported, getAnalytics, logEvent as logAnalyticsEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web config is not a secret — it identifies the project, it does
// not authorize access. Security is enforced by Firestore/Auth rules and the
// Authorized domains list, not by hiding these values. It's pulled from env
// vars anyway for cleanliness and to keep secret scanners quiet — see
// .env.example.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

let analytics: Analytics | undefined;
isAnalyticsSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

export function logEvent(eventName: string, params?: Record<string, unknown>) {
  if (analytics) logAnalyticsEvent(analytics, eventName, params);
}
