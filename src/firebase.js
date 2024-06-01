import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyCtZeXMjYqDdiDBjgWZtNOASji99aFwM",
  authDomain: "wolkus-project.firebaseapp.com",
  projectId: "wolkus-project",
  storageBucket: "wolkus-project.appspot.com",
  messagingSenderId: "414736886836",
  appId: "1:414736886836:web:72e8a9376c1c7840456e61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };