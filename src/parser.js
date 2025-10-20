/* eslint-disable no-unused-vars */
import { IMPORTANT_CHAPTERS, ALL_CHAPTERS } from "../constants.js";
import fs from "fs";
import util from "util";
import * as cheerio from "cheerio";

const WHITESPACE_REGEXP = /^\s+|\s+$/gm;

let $ = null;

let data = [];
for (const chapterNr of ALL_CHAPTERS) {
	const parsed = parseFile(chapterNr);
	data.push(parsed);
	break;
}

//const pretty= JSON.stringify(data, null, 2)
const pretty = util.inspect(data, { depth: null, colors: false });
fs.writeFileSync("output.json", pretty, "utf8");

function parseFile(chapterNr) {
	const html = fs.readFileSync(`./data/${chapterNr}.html`);

	$ = cheerio.load(html);

	const chapter = $(".npk-chapter");

	/* ##############################################
	 *  HEADER ELEMENT - .npk-chapter-header
	 * ############################################## */

	const headerLevelCode = chapter.find("> .npk-chapter-header > .npk-position-levelcode").text();
	const headerName = chapter.find("> .npk-chapter-header > .npk-position-name").text();
	const headerVersion = chapter.find("> .npk-chapter-header > .npk-position-name > .npk-position-version").text();

	const obj = {
		levelCode: headerLevelCode.replace(WHITESPACE_REGEXP, ""),
		name: headerName.replace(WHITESPACE_REGEXP, ""),
		version: headerVersion.replace(WHITESPACE_REGEXP, ""),
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

		positionObj.children = positionContent.contents().html();

		// 1.1 LEVELCODE
		const levelcode = positionContent.find("> .npk-position-levelcode");

		positionObj.levelcode = {
			main: levelcode.find("> .main-position").text().trim(),
			sub: levelcode.find("> .sub-position").text().trim(),
			title: levelcode.find("> .sub-position").prop("title"),
			children: levelcode.contents().html(),
		};

		// 1.2 NAME
		const name = positionContent.find("> .npk-position-name");

		positionObj.name = {
			text: {
				title: name.find("> .npk-position-text > .title").text().replace(WHITESPACE_REGEXP, ""),
				body: name.find("> .npk-position-text > .body").text().replace(WHITESPACE_REGEXP, ""),
			},
			products: name.find("> .npk-position-products").text().trim(),
			variables: [],
			children: name.contents().html(),
		};

		name.find("> .npk-position-variables > .npk-position-variable").each((index, variable) => {
			positionObj.name.variables.push({
				levelcode: $(variable).find("> .npk-variable-levelcode").text().replace(WHITESPACE_REGEXP, ""),
				name: $(variable).find("> .npk-variable-name").text().replace(WHITESPACE_REGEXP, ""),
				products: $(variable).find("> .npk-variable-products").text().replace(WHITESPACE_REGEXP, ""),
				group: $(variable).find("> .npk-variable-group").text().replace(WHITESPACE_REGEXP, ""),
				eco: $(variable).find("> .npk-variable-eco").text().replace(WHITESPACE_REGEXP, ""),
			});
		});

		// 1.3 UNIT
		const unit = positionContent.find("> .npk-position-unit");

		positionObj.unit = {
			text: unit.text().replace(WHITESPACE_REGEXP, "") || null,
			children: unit.contents().html(),
		};

		// 1.4 ECO
		const eco = positionContent.find("> .npk-position-eco");

		positionObj.eco = {
			text: eco.text().replace(WHITESPACE_REGEXP, "") || null,
			children: eco.contents().html(),
		};

		// 1.5 MEDIA
		const media = positionContent.find("> .npk-position-media");

		positionObj.media = {
			text: media.text().replace(WHITESPACE_REGEXP, "") || null,
			children: media.contents().html(),
		};

		//2. POSITIONGROUP
		const positionGroup = $(position).find("> .npk-positiongroup");
		// Recursive call
		positionObj.positions = parsePositionGroup(positionGroup);

		positionArr.push(positionObj);

		// Break out of loop after first element
		return false;
	});

	return positionArr;
}
