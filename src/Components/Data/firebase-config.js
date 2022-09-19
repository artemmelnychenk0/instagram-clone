import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
import "firebase/auth"
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBc_EH_7g5qpUiXvU7nMJRGR2lftvD1WC8",
    authDomain: "instagram-clone-26030.firebaseapp.com",
    projectId: "instagram-clone-26030",
    storageBucket: "instagram-clone-26030.appspot.com",
    messagingSenderId: "867686189244",
    appId: "1:867686189244:web:bca816ff08fc4803d468b9"
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
