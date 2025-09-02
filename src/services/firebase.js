// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMQ7OT56AOyP6zZpN1zWSzN4-yejrPrWs",
  authDomain: "lacasadigital-8b078.firebaseapp.com",
  projectId: "lacasadigital-8b078",
  storageBucket: "lacasadigital-8b078.firebasestorage.app",
  messagingSenderId: "979951106794",
  appId: "1:979951106794:web:fd31c401edec8008e13593",
  measurementId: "G-R5MP581P9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
