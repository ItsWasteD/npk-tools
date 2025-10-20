import fs from "fs";
import * as cheerio from "cheerio";
import axios from "axios";

import * as CONSTANTS from "../constants.js";

const HTML_PATH = "./data/";
const SESSIONTOKEN = "dd89ce37-a371-43cd-97b8-ae720ff20c96";
const USERTOKEN = "21468c06-ec14-4929-85ff-0327aee9";

for (const chapterNr of CONSTANTS.ALL_CHAPTERS) {
	const outputDir = `./images/${chapterNr}/`;
	if (fs.existsSync(outputDir)) continue;

	const html = fs.readFileSync(`${HTML_PATH}${chapterNr}.html`);

	const $ = cheerio.load(html);

	const images = $(".npk-chapter img");

	const imageSrcs = [];

	images.each((_, el) => {
		const src = $(el).attr("src");
		if (src) imageSrcs.push(src);
	});

	console.log(`Found ${imageSrcs.length} images in ${chapterNr}.`);

	fs.mkdirSync(outputDir, { recursive: true });

	for (const [i, src] of imageSrcs.entries()) {
		const fullUrl = new URL(src.startsWith("http") ? src : `https://npkviewer.crb.ch${src}`);

		fullUrl.searchParams.set("sessiontoken", SESSIONTOKEN);
		fullUrl.searchParams.set("usertoken", USERTOKEN);

		const url = fullUrl.toString();
		const match = src.match(/media\/([0-9a-fA-F-]{36})/);

		if (!match) {
			console.log("No UUID found: ", src);
		}

		const fileName = match[1];

		await downloadImage(url, `${outputDir}${fileName}`);

		if (i % 10 == 0) console.log(`${i} images downloaded.`);
	}
}

async function downloadImage(url, outputPath) {
	const writer = fs.createWriteStream(outputPath);

	const res = await axios({
		url,
		method: "GET",
		responseType: "stream",
	});

	return new Promise((resolve, reject) => {
		res.data.pipe(writer);
		writer.on("finish", resolve);
		writer.on("error", reject);
	});
}
