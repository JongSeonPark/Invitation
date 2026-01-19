import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAVpKz8TJcz9Q0CbSj2v_KQyeEs6SsuXsI",
    authDomain: "invitation-475eb.firebaseapp.com",
    projectId: "invitation-475eb",
    storageBucket: "invitation-475eb.firebasestorage.app",
    messagingSenderId: "1068873981449",
    appId: "1:1068873981449:web:aad6ee7d05442fd985e2d8",
    measurementId: "G-NJLBZ02TGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };
