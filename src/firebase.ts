import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDXYb7hznzugcgCAuFdw-y6pqUdXYudWK4",
  authDomain: "impact-accident-alert.firebaseapp.com",
  databaseURL: "https://impact-accident-alert-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "impact-accident-alert",
  storageBucket: "impact-accident-alert.firebasestorage.app",
  messagingSenderId: "37005170259",
  appId: "1:37005170259:web:de604ddf602ebdece3d8a6",
  measurementId: "G-TRC59DTXP3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);