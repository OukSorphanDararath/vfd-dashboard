// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ7jterUyEMMZhmopUStuPKOVPjNVxXgQ",
  authDomain: "virtual-frontdesk.firebaseapp.com",
  projectId: "virtual-frontdesk",
  storageBucket: "virtual-frontdesk.appspot.com",
  messagingSenderId: "201151179527",
  appId: "1:201151179527:web:f7a372cb10ba03c02d33a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
// Initialize Firebase Storage
const storage = getStorage(app);

export { firestore, storage };
