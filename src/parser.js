/* eslint-disable no-unused-vars */
import { IMPORTANT_CHAPTERS, ALL_CHAPTERS } from "../constants.js";
import fs from "fs";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WHITESPACE_REGEXP = /^\s+|\s+$/gm;
const IMAGE_REGEXP = /media\/([0-9a-fA-F-]{36})/;

let $ = null;

let data = [];
let isFirst = true;

const filePath = path.join(__dirname, "../public/data/chapters.json");
fs.mkdirSync(path.dirname(filePath), { recursive: true });
const stream = fs.createWriteStream(filePath, { flags: "a" });
stream.write("[\n");
for (const chapterNr of ALL_CHAPTERS) {
	const parsed = parseFile(chapterNr);
	data.push(parsed);

	console.log(chapterNr);
	//printPositions(parsed.positions);

	const pretty = JSON.stringify(parsed, null, 2);
	//const pretty = util.inspect(data, { depth: null, colors: false });

	if (!isFirst) ",\n";
	else isFirst = false;

	stream.write(pretty);
}
stream.write("]\n");
stream.end();

function printPositions(positions, level = 1) {
	const indent = "  ".repeat(level);
	for (const pos of positions) {
		console.log(`${indent}${pos.levelcode?.title || ""} ${pos.name.text.title || ""}`);
		if (pos.name.variables && pos.name.variables.length) {
			for (const v of pos.name.variables) {
				console.log(`${indent}  ${v.levelcode} - ${v.name}`);
			}
		}
		if (pos.positions && pos.positions.length) {
			printPositions(pos.positions, level + 1);
		}
	}
}

function parseFile(chapterNr) {
	const html = fs.readFileSync(`./data/${chapterNr}.html`);

	$ = cheerio.load(html);

	const chapter = $(".npk-chapter");

	/* ##############################################
	 *  HEADER ELEMENT - .npk-chapter-header
	 * ############################################## */

	const headerLevelCode = chapter.find("> .npk-chapter-header > .npk-position-levelcode");
	const headerName = chapter.find("> .npk-chapter-header > .npk-position-name");
	const headerVersion = chapter.find("> .npk-chapter-header > .npk-position-name > .npk-position-version");

	const obj = {
		levelCode: getText(headerLevelCode),
		name: getText(headerName),
		version: getText(headerVersion),
	};

	/* ##############################################
	 *  CONTENT - .npk-chapter-content
	 * ############################################## */

	const content = chapter.find("> .npk-chapter-content");

	const positionGroup = content.find("> .npk-positiongroup");
	obj.positions = parsePositionGroup(positionGroup);

	return obj;
}

function parsePositionGroup(positionGroup) {
	const positions = positionGroup.find("> .npk-position");

	let positionArr = [];

	positions.each((index, position) => {
		const positionObj = {};

		// 1. CONTENT
		const positionContent = $(position).find("> .npk-position-content");

		// 1.1 LEVELCODE
		const levelcode = positionContent.find("> .npk-position-levelcode");

		positionObj.levelcode = {
			main: levelcode.find("> .main-position").text().trim(),
			sub: levelcode.find("> .sub-position").text().trim(),
			title: levelcode.find("> .sub-position").prop("title"),
		};

		// 1.2 NAME
		const name = positionContent.find("> .npk-position-name");

		// 1.2.1 TEXT
		const text = name.find("> .npk-position-text");

		// 1.2.2 PRODUCTS
		const products = name.find("> .npk-position-products");

		// 1.2.2.1 ITEMS
		const productItems = products.find("> npk-position-products-items");

		// 1.2.3 VARIABLES
		const variables = name.find("> .npk-position-variables");

		positionObj.name = {
			text: {
				title: getText(text, "> .title"),
				body: getText(text, "> .body"),
				children: text.children().length,
			},
			products: {
				...(productItems.length && { items: [] }),
				children: products.children().length,
			},
			...(variables.length && { variables: [] }),
			children: name.children().length,
		};

		if (productItems.length) {
			productItems.find("> prd-product").each((index, item) => {
				positionObj.name.items.push({
					icon: getText($(item), "> prd-icon"),
					label: getText($(item), "> prd-label"),
				});
			});
		}

		if (variables.length) {
			variables.find(" > .npk-position-variable").each((index, variable) => {
				positionObj.name.variables.push({
					levelcode: getText($(variable), "> .npk-variable-levelcode"),
					name: getText($(variable), "> .npk-variable-name"),
					products: getText($(variable), "> .npk-variable-products"),
					group: getText($(variable), "> .npk-variable-group"),
					eco: getText($(variable), "> .npk-variable-eco"),
					children: $(variable).children().length,
				});
			});
		}

		// 1.3 UNIT
		const unit = positionContent.find("> .npk-position-unit");

		positionObj.unit = {
			text: getText(unit),
			children: unit.children().length,
		};

		// 1.4 ECO
		const eco = positionContent.find("> .npk-position-eco");

		positionObj.eco = {
			text: getText(eco),
			children: eco.children().length,
		};

		// 1.5 MEDIA
		const media = positionContent.find("> .npk-position-media");

		const mediaItems = media.find("> .npk-position-media-item");

		positionObj.media = {
			...(mediaItems.length && { items: [] }),
			children: media.children().length,
		};

		if (mediaItems.length) {
			mediaItems.each((index, item) => {
				positionObj.media.items.push({
					imageUuid: $(item).find("> img").attr("src").match(IMAGE_REGEXP)[1],
				});
			});
		}

		//2. POSITIONGROUP
		const positionGroup = $(position).find("> .npk-positiongroup");
		// Recursive call
		if (positionGroup.length != 0) {
			positionObj.positions = parsePositionGroup(positionGroup);
		}

		positionObj.children = positionContent.children().length;

		positionArr.push(positionObj);

		// Break out of loop after first element
		//return false;
	});

	return positionArr;
}

function getText(cheerioEl, selector) {
	const el = selector ? cheerioEl.find(selector) : cheerioEl;
	return el.length
		? el
				.text()
				.replace(WHITESPACE_REGEXP, "")
				.replace(/[\n\r]/g, " ")
		: null;
}
