// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9fsYoXIs9R4ZgfGqA4dQ2VbqWuZv-DRc",
  authDomain: "inventory-management-960d6.firebaseapp.com",
  projectId: "inventory-management-960d6",
  storageBucket: "inventory-management-960d6.appspot.com",
  messagingSenderId: "760209002347",
  appId: "1:760209002347:web:7f3e64b27719c54c90062e",
  measurementId: "G-MGMVWQGP0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}