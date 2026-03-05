import { writeFileSync } from "fs";

type Field = {
	name: string;
	length: number;
	align: "left" | "right";
	pad?: string;
};

// Comments correspond to SIA451.01S
const A_RECORD_FIELDS: Field[] = [
	{ name: "recordart", length: 1, align: "left" }, // A
	{ name: "erstellungsdatum", length: 6, align: "right" }, // 020525
	{ name: "schnittstellenversion", length: 3, align: "right" }, // 451-92
	{ name: "fehlerstufe", length: 1, align: "left" },
	{ name: "pruefung", length: 1, align: "left" },
	{ name: "unknown1", length: 26, align: "left" },
	//	{ name: "bauherr", length: 6, align: "left" },
	//	{ name: "bauherr2", length: 6, align: "left" },
	//	{ name: "urheber1", length: 6, align: "left" },
	//	{ name: "urheber2", length: 6, align: "left" },
	//	{ name: "urheber3", length: 6, align: "left" },
	{ name: "sprache", length: 2, align: "left" }, // 1_ - Sprachcode
	{ name: "stellung", length: 1, align: "left" }, // B (Nachtrag) - Stellung zur vorversion
	{ name: "dokCode", length: 1, align: "left" }, // C (Angebot) - Dokumentenstatus
	{ name: "unknown3", length: 13, align: "left" },
	{ name: "dokVersion", length: 16, align: "right" }, // 0000000000000001
	{ name: "unknown4", length: 7, align: "left" },
	{ name: "kurzbeschreibung1", length: 56, align: "left" }, // UMB_4557_PFUmbau EFH Pfluger Prisca & Oli000002110
	{ name: "kurzbeschreibung2", length: 30, align: "left" }, // 2110 BAUMEISTEREARBEITEN
	{ name: "dokId", length: 70, align: "left" }, // R.Messerli AG       056/4183800         MesserliBAUAD 2009.2.5  (1202)
];

const G_RECORD_FIELDS: Field[] = [
	{ name: "recordart", length: 1, align: "left" },
	{ name: "kapitel", length: 3, align: "right" },
	{ name: "sprache", length: 1, align: "left" },
	{ name: "ausgabejahr", length: 2, align: "right" },
	{ name: "leistungsposition", length: 6, align: "right" },
	{ name: "variablennummer", length: 2, align: "right" },
	{ name: "zeilennummer", length: 2, align: "right" },
	{ name: "objektgliederung", length: 6, align: "right" },
	{ name: "positionslage", length: 6, align: "right" },
	{ name: "variantengruppe", length: 3, align: "right" },
	{ name: "variante", length: 3, align: "right" },
	{ name: "verbandskalkulation", length: 6, align: "right" },
	{ name: "recordtyp", length: 1, align: "left" },
	{ name: "leer1", length: 1, align: "left" },
	{ name: "mengenart", length: 1, align: "left" },
	{ name: "vorzeichenmenge", length: 1, align: "left" },
	{ name: "menge", length: 13, align: "right" },
	{ name: "mengeneinheit", length: 2, align: "left" },
	{ name: "leer2", length: 1, align: "left" },
	{ name: "vorzeichen_preis", length: 1, align: "left" },
	{ name: "preis", length: 12, align: "right" },
	{ name: "laufnummer", length: 7, align: "right" },
	{ name: "kag_code", length: 5, align: "right" },
	{ name: "elementcode", length: 6, align: "right" },
	{ name: "positionstext", length: 30, align: "right" },
	{ name: "spez_codex", length: 134, align: "right" },
];

const Z_RECORD_FIELDS: Field[] = [
	{ name: "recordart", length: 1, align: "left" },
	{ name: "datum_export", length: 6, align: "right" },
	{ name: "erstellungsdatum_export", length: 6, align: "right" },
	{ name: "leer1", length: 2, align: "right" },
	{ name: "leer2", length: 2, align: "right" },
	{ name: "absender_kurzbezeichnung1", length: 6, align: "right" },
	{ name: "absender_kurzbezeichnung2", length: 6, align: "right" },
	{ name: "urheber_bezugsdokument", length: 12, align: "right" },
	{ name: "leer3", length: 4, align: "right" },
	{ name: "anzahl_records", length: 13, align: "right" },
	{ name: "leer4", length: 3, align: "left" },
	{ name: "fortsetzung", length: 1, align: "left" },
	{ name: "datentraegernummer", length: 12, align: "right" },
	{ name: "version_bezugsdokument", length: 7, align: "right" },
	{ name: "identifikation_bezugsdokument", length: 41, align: "left" },
	{ name: "firma", length: 30, align: "left" },
	{ name: "telefonnummer", length: 40, align: "left" },
];

function pad(value: string | number | undefined, length: number, align: "left" | "right", padChar = " "): string {
	const str = value === undefined ? "" : String(value);

	if (str.length > length) {
		return str.slice(0, length);
	}

	return align === "right" ? str.padStart(length, padChar) : str.padEnd(length, padChar);
}

function buildRecord(fields: Field[], data: Record<string, string | number | undefined>): string {
	return fields.map((f) => pad(data[f.name], f.length, f.align, f.pad)).join("") + "\r\n";
}

function write(lines: string[]) {
	writeFileSync("export.01S", Buffer.from(lines.join(""), "latin1"));
}
