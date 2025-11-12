// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBF_cpFsJBc-cLogDDrKOj0OJatQ-9hM4w",
  authDomain: "authenticator-7d15b.firebaseapp.com",
  projectId: "authenticator-7d15b",
  storageBucket: "authenticator-7d15b.firebasestorage.app",
  messagingSenderId: "470404359295",
  appId: "1:470404359295:web:8a4229bce7b32bed064b4a"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
