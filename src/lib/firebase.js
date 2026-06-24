import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAwbR6owxePlLLKfFs3BylphtCAQbjBn0",
  authDomain: "student-internship-porta-1797a.firebaseapp.com",
  databaseURL: "https://student-internship-porta-1797a-default-rtdb.firebaseio.com",
  projectId: "student-internship-porta-1797a",
  storageBucket: "student-internship-porta-1797a.firebasestorage.app",
  messagingSenderId: "81785625764",
  appId: "1:81785625764:web:5946caf4ae86d17df1da31",
  measurementId: "G-FHJ97WFDWB"
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
