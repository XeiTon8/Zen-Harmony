// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfsivW3RZPeFUEL5ZxFmaNmps_nwy3Gl4",
  authDomain: "kanban-app-80f9f.firebaseapp.com",
  projectId: "kanban-app-80f9f",
  storageBucket: "kanban-app-80f9f.appspot.com",
  messagingSenderId: "415285288126",
  appId: "1:415285288126:web:d598191906a6c4ced5d2ef"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();