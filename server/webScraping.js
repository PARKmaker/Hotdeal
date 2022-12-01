import { db, hotdeal_11st_collectionRef } from "./firebase.js";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

import puppeteer from "puppeteer";
// const { db, hotdeal_11st_collectionRef } = require("./firebase.js");
// const { doc, getDoc, setDoc, getDocs, collection } = require("firebase/firestore");

// const puppeteer = require("puppeteer");

const today = new Date();
const todayId = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getDay()}`;

async function infoSetDocs(data) {
	try {
		await setDoc(
			doc(hotdeal_11st_collectionRef, "11st", todayId, data.id),
			{
				data,
			},
			{ merge: true }
		);
	} catch (error) {
		console.log(error);
	}
}

function getInfo(element, cls, target = "") {
	//querySelector와 getAttribute을 간결하게 실행, target속성이 없으면 Text리턴
	const root = element.querySelector(cls);
	if (target.length !== 0) {
		return root.getAttribute(target);
	}

	return root;
}

function getPriceInfo() {
	const price = getInfo(element, ".price_detail").innerText.replace(/\n/g, "");
	const idx = price.indexOf("원판");

	let priceInfo = {};
	if (idx.length !== -1) {
		priceInfo = {
			regularPrice: price.slice(0, idx + 1),
			disPrice: price.slice(idx + 1),
		};
	} else {
		priceInfo = {
			regularPrice: price.slice(0),
		};
	}

	return priceInfo;
}

function getSaleInfo() {
	const sale = getInfo(element, ".sp_price") || getInfo(element, ".sale");
	return sale ? sale.innerText : {};
}

function scrap11st() {
	(async () => {
		const url_11st_hotdeal =
			"https://deal.11st.co.kr/browsing/DealAction.tmall?method=getShockingDealMain";
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto(url_11st_hotdeal);

		const grabParagraph = await page.evaluate(() => {
			function scrapTag(selector) {
				allTag = document.querySelectorAll(selector);
				let tags = [];

				allTag.forEach((element) => {
					const infoObj = {
						id: element.id,
						href: getInfo(element, ".box_pd a", "href"),
						imgSrc: getInfo(element, ".prd_img img", "src"),
						chgTime: getInfo(element, ".chgTime").innerText,
						prdName: getInfo(element, ".fs_16").innerText,
						sale: getSaleInfo(),
						regularPrice: getPriceInfo(),
						puchaseNum: getInfo(element, ".puchase_num").innerText,
					};
					tags.push(infoObj);
				});

				return tags;
			}
			return scrapTag(".list_view div .cfix li");
		});
		await browser.close();

		grabParagraph.forEach((obj) => infoSetDocs(obj));
	})();
}

// scrap11st();

async function getData() {
	// const docRef = collection(db, "hotdeal", "11st", todayId);
	const docRef = collection(db, "hotdeal", "11st", "202210171");
	const docSnap = await getDocs(docRef);
	const data = [];

	docSnap.forEach((doc) => {
		data.push(doc.data().data);
		// console.log(doc.id, " => ", doc.data().data);
	});

	console.log(data);
}

getData();
