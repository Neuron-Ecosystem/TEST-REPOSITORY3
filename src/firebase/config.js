import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDOaDVzzPjyYm4HWMND2XYWjLy_h4wty5s",
  authDomain: "neuron-ecosystem-2025.firebaseapp.com",
  projectId: "neuron-ecosystem-2025",
  storageBucket: "neuron-ecosystem-2025.firebasestorage.app",
  messagingSenderId: "589834476565",
  appId: "1:589834476565:web:0b28faca1064077add421c",
  measurementId: "G-4D19EM80B0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
