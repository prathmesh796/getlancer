import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// Firestore instance used across the app (realtime chat, etc.)
export const db = getFirestore(app);
// Analytics should only run in the browser.
// In SSR/Node contexts, `getAnalytics` can throw due to missing browser globals.
if (typeof window !== "undefined") {
  try {
    getAnalytics(app);
  } catch {
    // Ignore analytics init errors (not critical for chat functionality).
  }
}