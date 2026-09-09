import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// Long-polling fallback handles networks and proxies that block WebChannel.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
// Analytics should only run in the browser.
// In SSR/Node contexts, `getAnalytics` can throw due to missing browser globals.
if (typeof window !== "undefined") {
  try {
    getAnalytics(app);
  } catch(error) {
    console.error("Analytics init failed", error)
  }
}