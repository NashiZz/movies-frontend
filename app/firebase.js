// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_UQM69sH61tshBPGSQmV5tumwoZf6sJo",
  authDomain: "movies-db-6b292.firebaseapp.com",
  projectId: "movies-db-6b292",
  storageBucket: "movies-db-6b292.firebasestorage.app",
  messagingSenderId: "45943547973",
  appId: "1:45943547973:web:649737566ed3592112db2c",
  measurementId: "G-D59J4P2X8E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}
console.log("Firebase App initialized:", app);

const storage = getStorage(app); 
console.log("Firebase Storage initialized:", storage);

export { app, storage,  analytics  };