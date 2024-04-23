// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCkIS7pPwRJz_XJW7CRFu43lk3R8Lx7FAs",
    authDomain: "chatapp-e6f92.firebaseapp.com",
    projectId: "chatapp-e6f92",
    storageBucket: "chatapp-e6f92.appspot.com",
    messagingSenderId: "86616823860",
    appId: "1:86616823860:web:7679f74d2d0cb534851261"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
//This code snippet demonstrates how to set up Firebase in a
// React project to use Firebase Storage. 