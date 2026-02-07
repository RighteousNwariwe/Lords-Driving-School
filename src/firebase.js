import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW6n9BHnI0NpNdO9Yoh1quOSczFkILfJk",
  authDomain: "lords-driving-school.firebaseapp.com",
  databaseURL: "https://lords-driving-school-default-rtdb.firebaseio.com",
  projectId: "lords-driving-school",
  storageBucket: "lords-driving-school.firebasestorage.app",
  messagingSenderId: "800355212368",
  appId: "1:800355212368:web:8cef616c13f94b97164555",
  measurementId: "G-T1K4E1DWRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, database, googleProvider };
export default app;
