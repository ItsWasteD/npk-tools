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
for (const chapterNr of [113]) {
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
		console.log(
			`${indent}${pos.levelcode?.title || ""} ${pos.name.text.title || ""}`,
		);
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

	const headerLevelCode = chapter.find(
		"> .npk-chapter-header > .npk-position-levelcode",
	);
	const headerName = chapter.find(
		"> .npk-chapter-header > .npk-position-name",
	);
	const headerVersion = chapter.find(
		"> .npk-chapter-header > .npk-position-name > .npk-position-version",
	);

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

		positionObj.levelcode = levelcode.find("> .sub-position").prop("title");

		// 1.2 NAME
		const name = positionContent.find("> .npk-position-name");

		// 1.2.1 TEXT
		const text = name.find("> .npk-position-text");

		// 1.2.1.1 TITLE

		// 1.2.1.2 BODY
		const body = text.find("> .body");

		// 1.2.1.3 ITEMS
		const textItems = text.find("> .items > .item");

		// 1.2.2 DESCRIPTION
		const description = name.find("> .npk-position-description");

		// 1.2.3 PRODUCTS
		const products = name.find("> .npk-position-products");

		// 1.2.3.1 ITEMS
		const productItems = products.find(
			"> .npk-position-products-items > .prd-product",
		);

		// 1.2.4 VARIABLES
		const variables = name.find(
			"> .npk-position-variables > .npk-position-variable",
		);

		positionObj.name = {
			text: {
				title: getText(text, "> .title"),
				...(body.length && { body: getText(body) }),
				...(textItems.length && {
					items: textItems.map((i, el) => getText($(el))).get(),
				}),
			},
			...(description.length && {
				description: {
					label: getText(description, "> .description-label"),
					content: getText(description, "> .description-content"),
				},
			}),
			...(productItems.length && {
				products: productItems
					.map((i, el) => ({
						icon: getText($(el), "> .prd-icon"),
						label: getText($(el), "> .prd-label"),
					}))
					.get(),
			}),
			...(variables.length && {
				variables: variables
					.map((i, el) => ({
						levelcode: getText($(el), "> .npk-variable-levelcode"),
						name: getText($(el), "> .npk-variable-name"),
						products: getText($(el), "> .npk-variable-products"),
						group: getText($(el), "> .npk-variable-group"),
						eco: getText($(el), "> .npk-variable-eco"),
					}))
					.get(),
			}),
		};

		// 1.3 UNIT
		const unit = getText(positionContent.find("> .npk-position-unit"));

		unit && (positionObj.unit = unit);

		// 1.4 ECO
		const eco = getText(positionContent.find("> .npk-position-eco"));

		eco && (positionObj.eco = eco);

		// 1.5 MEDIA
		const media = positionContent.find("> .npk-position-media");

		const mediaItems = media.find("> .npk-position-media-item");

		mediaItems.length &&
			(positionObj.media = mediaItems
				.map(
					(i, el) =>
						$(el).find("> img").attr("src").match(IMAGE_REGEXP)[1],
				)
				.get());

		//2. POSITIONGROUP
		const positionGroup = $(position).find("> .npk-positiongroup");
		// Recursive call
		if (positionGroup.length != 0) {
			positionObj.positions = parsePositionGroup(positionGroup);
		}

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
		: "";
}
