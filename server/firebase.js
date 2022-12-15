// const initializeApp = require("firebase/app");
// const { collection, getFirestore } = require("firebase/firestore");
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const hotdeal_11st_collectionRef = collection(db, "hotdeal");

export { db, hotdeal_11st_collectionRef };
// module.exports = { db, hotdeal_11st_collectionRef };
