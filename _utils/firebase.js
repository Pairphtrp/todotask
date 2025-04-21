// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNEtHbL1kIzoVKgWIWnR_GCpIfz3TKhRM",
  authDomain: "todotas-2bb41.firebaseapp.com",
  projectId: "todotas-2bb41",
  storageBucket: "todotas-2bb41.firebasestorage.app",
  messagingSenderId: "407850438583",
  appId: "1:407850438583:web:af4b5089b10e58bb7aa232"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth object
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore and export it