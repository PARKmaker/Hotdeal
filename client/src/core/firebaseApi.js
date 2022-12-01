import { initializeApp } from "firebase/app";
import { getDocs, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCPdRf6qXBfGIOfi_IbBmSDyWX9Frm5fdQ",
	authDomain: "hotdeal-af9a2.firebaseapp.com",
	projectId: "hotdeal-af9a2",
	storageBucket: "hotdeal-af9a2.appspot.com",
	messagingSenderId: "78342125829",
	appId: "1:78342125829:web:6340ebd84ee116055adf6c",
	measurementId: "G-XLTYLE8RH1",
};

function getDate() {
	const today = new Date();
	const todayId = `${today.getFullYear()}${
		today.getMonth() + 1
	}${today.getDate()}${today.getDay()}`;

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
