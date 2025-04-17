// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBI04NJH6_t7mWEQcoC9D1mDq57J-fSm9c",
  authDomain: "dashboard-29b41.firebaseapp.com",
  projectId: "dashboard-29b41",
  storageBucket: "dashboard-29b41.firebasestorage.app",
  messagingSenderId: "39995091808",
  appId: "1:39995091808:web:805417ea6d6abca18d0c05",
  measurementId: "G-QWXZXJ0R1T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // 👈 Exporter ça aussi
const analytics = getAnalytics(app);
