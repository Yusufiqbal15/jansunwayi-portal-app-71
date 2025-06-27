// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOh8xKueGi9_Se2FbTQftjGHsJkO7mz1o",
  authDomain: "ayodhya-court.firebaseapp.com",
  projectId: "ayodhya-court",
  storageBucket: "ayodhya-court.firebasestorage.app",
  messagingSenderId: "737847239040",
  appId: "1:737847239040:web:bdd11805b3bdfa368d2165",
  measurementId: "G-NDS7E3B4B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };