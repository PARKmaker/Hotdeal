import { db, hotdeal_11st_collectionRef } from "./firebase.js";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import puppeteer from "puppeteer";

// const { db, hotdeal_11st_collectionRef } = require("./firebase.js");
// const { doc, getDoc, setDoc, getDocs, collection } = require("firebase/firestore");
// const puppeteer = require("puppeteer");

const today = new Date();
const todayId = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getDay()}`;

// async function infoSetDocs(data) {
//   try {
//     await setDoc(
//       doc(hotdeal_11st_collectionRef, "11st", todayId, data.id),
//       {
//         data,
//       },
//       { merge: true }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

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
      normal_price: price.slice(0, idx + 1),
      sale_price: price.slice(idx + 1),
    };
  } else {
    priceInfo = {
      normal_price: price.slice(0),
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
    const url_11st_hotdeal = "https://deal.11st.co.kr/browsing/DealAction.tmall?method=getShockingDealMain";
    const browser = await puppeteer.launch({ headless: true });
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
            price_detail: getPriceInfo(),
            puchaseNum: getInfo(element, ".puchase_num").innerText,
          };
          tags.push(infoObj);
        });

        return tags;
      }
      return scrapTag(".list_view div .cfix li");
    });
    // console.log(grabParagraph);
    grabParagraph.forEach((obj) => console.log(obj));
    await browser.close();

    // grabParagraph.forEach((obj) => infoSetDocs(obj));
  })();
}

function scrapGmarket() {
  (async () => {
    const url = "https://corners.gmarket.co.kr/SuperDeals";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.exposeFunction("getInfo", getInfo);
    await page.goto(url);
    // await page.type(".item_list", "Headless Chrome");
    const allResultsSelector = ".item_list .masonry-brick";
    await page.waitForSelector(allResultsSelector);

    const grabParagraph = await page.evaluate((allResultsSelector) => {
      return [...document.querySelectorAll(allResultsSelector)].map((element) => {
        const qs = (ele, select) => {
          return ele.querySelector(select);
        };

        const anchor = qs(element, ".inner > a");
        const href = anchor.getAttribute("href");
        const id = new URL(href).searchParams.get("goodscode");

        const info = qs(element, ".info");
        const sale = qs(info, ".sale") ? `${qs(info, ".sale strong").innerText}%` : null;
        const normal_price = qs(info, ".price > strong").innerText;
        const sale_price = qs(info, ".price > del") ? `${qs(info, ".price > del").innerText}` : null;
        const puchaseNum = qs(info, ".buy").innerText.replace(/\n/g, " 개 ");

        const infoObj = {
          id: id,
          href: href,
          imgSrc: qs(anchor, ".thumb").getAttribute("src"),
          chgTime: null,
          prdName: qs(anchor, ".title").innerText,
          sale: sale,
          price_detail: {
            normal_price: normal_price,
            sale_price: sale_price,
          },
          puchaseNum: puchaseNum,
          type: "gmarket",
        };

        return infoObj;
      });
    }, allResultsSelector);

    grabParagraph.forEach((obj) => {
      console.log(obj);
    });
    // console.log(grabParagraph.join("\n"));

    await browser.close();
    // grabParagraph.forEach((obj) => infoSetDocs(obj));
  })();
}

scrap11st();
// scrapGmarket();

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

// getData();
