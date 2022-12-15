import { initializeApp } from "firebase/app";
import { getDocs, collection, getFirestore } from "firebase/firestore";

// import path from "path";
// import dotenv from "dotenv";

// dotenv.config({ path: path.join(__dirname, "path/to/.env") });

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

function getDate() {
  const today = new Date();
  const todayId = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getDay()}`;

  return todayId;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = collection(db, "hotdeal", "11st", "202210171");

const docSnap = await getDocs(docRef);
let data = [];

docSnap.forEach((doc) => {
  data.push(doc.data().data);
});

// async function getData() {
// 	const app = initializeApp(firebaseConfig);
// 	const db = getFirestore(app);
// 	const docRef = collection(db, "hotdeal", "11st", "202210171");

// 	const docSnap = await getDocs(docRef);
// 	const data = [];

// 	docSnap.forEach((doc) => {
// 		data.push(doc.data().data);
// 	});
// 	return data;
// }

export default data;
