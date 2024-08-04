// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8nPGOJQw5_7L5E4vggk1ZkXBJDxccrus",
  authDomain: "inventorymanagementapp-976a0.firebaseapp.com",
  projectId: "inventorymanagementapp-976a0",
  storageBucket: "inventorymanagementapp-976a0.appspot.com",
  messagingSenderId: "485268558575",
  appId: "1:485268558575:web:ca31a2c8c59a479b66c11a",
  measurementId: "G-9E7GF7RLEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//const analytics = getAnalytics(app)
const firestore = getFirestore(app)
export {app, firestore}