import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

if (typeof window !== "undefined") {
  app = getApps().length
    ? (getApp() as FirebaseApp)
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
  authInstance = getAuth(app);
}

export const firebaseApp = app;
export const auth = authInstance;

