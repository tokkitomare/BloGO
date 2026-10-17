// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPhX8IwrfKdRoOVVanFAzDSRyP6VErKfE",
  authDomain: "blogo-8abf7.firebaseapp.com",
  projectId: "blogo-8abf7",
  storageBucket: "blogo-8abf7.firebasestorage.app",
  messagingSenderId: "842154573894",
  appId: "1:842154573894:web:cff2983e12345892ba0a47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider };