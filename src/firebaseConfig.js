
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC2651pf6MZOBtogJNtpJnzmPSzOHUcZDc",
    authDomain: "autochef-ab6c6.firebaseapp.com",
    projectId: "autochef-ab6c6",
    storageBucket: "autochef-ab6c6.firebasestorage.app",
    messagingSenderId: "858608562869",
    appId: "1:858608562869:web:bb75c5cf9004fc629704fc",
    measurementId: "G-LN7405PXSH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
