import axios from "axios";
import tough from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import puppeteer from "puppeteer";
import timers from "node:timers/promises";
import fs from "fs";

import * as CONSTANTS from "../constants.js";

const jar = new tough.CookieJar();

const client = wrapper(axios.create({ jar, withCredentials: true }));

const USER = "npkviewer0625";
const PW = "n5Tkry";

const LOGIN_LINK = `https://npkviewer.crb.ch/npkviewer/rest/1.0/app/session/authentication/basicauth?username=${USER}&pwd=${PW}`;
const INDEX = "https://npkviewer.crb.ch/index.html#account";

(async () => {
	/* ##############################################
	 *  SETUP
	 * ############################################## */
	let res = await client.put(LOGIN_LINK);

	const setCookieHeaders = res.headers["set-cookie"];
	const cookieJar = new tough.CookieJar();

	if (!setCookieHeaders) {
		console.log("No Set-Cookie header found");
	} else {
		await Promise.all(
			setCookieHeaders.map((cookieStr) => cookieJar.setCookie(cookieStr, "https://npkviewer.crb.ch"))
		);
	}

	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		args: ["--start-maximized"],
	});

	const page = await browser.newPage();

	await page.goto("https://npkviewer.crb.ch", {
		waitUntil: "domcontentloaded",
	});

	const initialCookies = await cookieJar.getCookies("https://npkviewer.crb.ch");
	const puppeteerCookies = initialCookies.map((c) => ({
		name: c.key,
		value: c.value,
		domain: "npkviewer.crb.ch",
		path: c.path,
		httpOnly: c.httpOnly,
		secure: c.secure,
	}));

	await page.setCookie(...puppeteerCookies);

	/* ##############################################
	 *  NAVIGATION
	 * ############################################## */

	await page.goto(INDEX);

	// Select account
	await timers.setTimeout(1500);
	await page.click("#fm-account-selector");
	await timers.setTimeout(1500);
	await page.click("#select2-drop");
	await page.click("#fm-account-button-submit");

	// Filter for german
	await page.waitForSelector("#id-languages-filter");
	await page.click("#id-languages-filter");
	await timers.setTimeout(1000);
	await page.click("#select2-result-label-5");
	await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 5000 }).catch(() => {});

	for (const chapter of CONSTANTS.IMPORTANT_CHAPTERS) {
		console.log(`${chapter} begin...`);
		await saveChapterHtml(chapter, page);
		console.log(`${chapter} done!`);
	}

	let unprocessedChapters = CONSTANTS.ALL_CHAPTERS.filter(
		(c) => !CONSTANTS.IMPORTANT_CHAPTERS.includes(c) && !CONSTANTS.NOT_EXIST_CHAPTERS.includes(c)
	);
	for (const chapter of unprocessedChapters) {
		console.log(`${chapter} begin...`);
		await saveChapterHtml(chapter, page);
		console.log(`${chapter} done!`);
	}

	await browser.close();
})();

async function saveChapterHtml(chapterNr, page) {
	const chapterFile = `./data/${chapterNr}.html`;
	if (fs.existsSync(chapterFile)) return true;

	const catalogSelector = "#id-fm-container-chaptercataloglist > div > div.fm-table-rows > div";

	await page.waitForSelector(catalogSelector, { visible: true, timeout: 1000 });

	let found = false;

	while (!found) {
		const rowHandles = await page.$$(catalogSelector);

		for (const [i, row] of rowHandles.entries()) {
			const chapterDivHandle = await row.$("div > div:nth-child(1)");
			if (!chapterDivHandle) continue;

			const text = await page.evaluate((el) => el.textContent.trim(), chapterDivHandle);

			if (text.includes(chapterNr)) {
				const rowClickSelector = `${catalogSelector}:nth-child(${i + 1}) > div`;

				await page.waitForSelector(rowClickSelector, { visible: true, timeout: 5000 });
				await page.click(rowClickSelector);
				await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 5000 }).catch(() => {});

				await timers.setTimeout(1000);

				const headerSelector = ".fm-tab-chapterdocument-label:last-of-type";
				const headerText = await page.$$eval(
					headerSelector,
					(els) => els[els.length - 1].textContent?.trim() || null
				);
				if (!headerText.includes(chapterNr)) {
					console.log(`Loaded page doesn't match chapter ${chapterNr}`);
					return false;
				}

				// Save file
				try {
					console.log("Saving...");
					fs.mkdirSync("./data", { recursive: true });
					const html = await page.content();
					fs.writeFileSync(chapterFile, html);
					console.log("Saved...");
				} catch (err) {
					console.error(`Error saving chapter ${chapterNr}: ` + err);
				}

				try {
					await page.click("#id-catalognavigator-tabs-header_chaptercatalog > a");
					await page.waitForSelector(catalogSelector, { visible: true, timeout: 5000 });
					await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }).catch(() => {});
				} catch (err) {
					console.warn("Couldn't navigate back to list. ", err);
				}

				return true;
			}
		}

		// If not found, try to paginate
		const nextPageBtnSelector = "#id-chapterlist-chapters-tablepager > div > div > div:last-child";
		const nextBtn = await page.$(nextPageBtnSelector);

		if (nextBtn) {
			await page.click(nextPageBtnSelector);
			await page.waitForSelector(catalogSelector, { visible: true, timeout: 5000 });
			await timers.setTimeout(1000);
		} else {
			console.log("No next page found.");
			return false;
		}
	}

	console.warn(`Chapter ${chapterNr} not found after retries.`);
	return false;
}
