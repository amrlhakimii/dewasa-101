import { initializeApp } from 'firebase/app';
import { type Analytics, isSupported as isAnalyticsSupported, getAnalytics, logEvent as logAnalyticsEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web config is not a secret — it identifies the project, it does
// not authorize access. Security is enforced by Firestore/Auth rules and the
// Authorized domains list, not by hiding these values.
const firebaseConfig = {
  apiKey: 'AIzaSyCvqkxK6VLpIe6W05ujJdJi2HBKYHFPbGc',
  authDomain: 'dewasa-db1c4.firebaseapp.com',
  projectId: 'dewasa-db1c4',
  storageBucket: 'dewasa-db1c4.firebasestorage.app',
  messagingSenderId: '558341510725',
  appId: '1:558341510725:web:7197fecf29f48a8c64752c',
  measurementId: 'G-6NPMYDYXVV',
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
