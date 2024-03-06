import Firebase, { FirebaseConfig } from "firebase-utils";
export type { AuthPopupProvider } from "firebase-utils";

const firebaseConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID!,
    appId: import.meta.env.VITE_FIREBASE_APP_ID!,
};

const firebase = new Firebase(firebaseConfig);

export default firebase;
