// const initializeApp = require("firebase/app");
// const { collection, getFirestore } = require("firebase/firestore");
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.HOTDEALVIEW_apiKey,
	authDomain: process.env.HOTDEALVIEW_authDomain,
	projectId: process.env.HOTDEALVIEW_projectId,
	storageBucket: process.env.HOTDEALVIEW_storageBucket,
	messagingSenderId: process.env.HOTDEALVIEW_messagingSenderId,
	appId: process.env.HOTDEALVIEW_appId,
	measurementId: process.env.HOTDEALVIEW_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const hotdeal_11st_collectionRef = collection(db, "hotdeal");

export { db, hotdeal_11st_collectionRef };
// module.exports = { db, hotdeal_11st_collectionRef };
