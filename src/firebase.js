// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiGSp3zIZI5XuIYI5So4xrWqLIJp-468I",
  authDomain: "ems-react-eb975.firebaseapp.com",
  projectId: "ems-react-eb975",
  storageBucket: "ems-react-eb975.appspot.com",
  messagingSenderId: "832754328611",
  appId: "1:832754328611:web:49cfbdda93007581fd7d96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export { auth, db };
