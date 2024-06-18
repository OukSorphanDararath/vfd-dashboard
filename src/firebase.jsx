// firebase.js (or wherever you initialize Firebase)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdl8RxTB2X4E4PdR6lUNw0YCOVBPFgo8w",
  authDomain: "rtcpuc.firebaseapp.com",
  projectId: "rtcpuc",
  storageBucket: "rtcpuc.appspot.com",
  messagingSenderId: "874247322664",
  appId: "1:874247322664:web:50eefe2040da46636f891d",
  measurementId: "G-R0KP2TRQTE",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
