import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk6ajZRtCZui2Lp7_Fbu31ibVI5tiMz34",
  authDomain: "kitchen-inventory-8e597.firebaseapp.com",
  projectId: "kitchen-inventory-8e597",
  storageBucket: "kitchen-inventory-8e597.appspot.com",
  messagingSenderId: "896861436297",
  appId: "1:896861436297:web:c5e831ca481f5c120d8958",
  measurementId: "G-CS4J6H6M42",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app };
export { analytics };
export { db };
