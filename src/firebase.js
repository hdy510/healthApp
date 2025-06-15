import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRoe75909AQIxgaf9RaVt7LnNXyfZbDCQ",
  authDomain: "workout-tracker-2c873.firebaseapp.com",
  projectId: "workout-tracker-2c873",
  storageBucket: "workout-tracker-2c873.firebasestorage.app",
  messagingSenderId: "653488892529",
  appId: "1:653488892529:web:dce5cb6d82c6e44db689d0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
