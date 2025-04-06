import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB13TnpVMUH3KlVCI55WSVWAfS4wZy1Ga4",
  authDomain: "is213-18f2a.firebaseapp.com",
  projectId: "is213-18f2a",
  storageBucket: "is213-18f2a.firebasestorage.app",
  messagingSenderId: "490252476659",
  appId: "1:490252476659:web:65ab41d4365ed91c3a5786",
  measurementId: "G-4N6FBFTN23"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth, app};