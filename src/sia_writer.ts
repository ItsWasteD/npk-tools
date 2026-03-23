import { writeFileSync } from "fs";
import {
	createClosingRecord,
	createGRecord,
	createHeaderRecord,
	formatDate,
	serializeFile,
} from "./helpers";
import type { A_Record, G_Record, Z_Record } from "./types/npk_types";

function write(content: string) {
	writeFileSync("export.01S", Buffer.from(content, "latin1"));
}

const a: A_Record = createHeaderRecord({
	erstellungsdatum: formatDate(new Date()),
	schnittstellenversion: "451-92",
	fehlerstufe: "11",
	durchgefuehrte_pruefung: "",
	bauherren_kurzbezeichnung: "",
	dokumenten_urheber: "",
	sprachcode: "1",
	stellung_zur_vorversion: "",
	dokumenten_code: "B",
	dokumenten_status: "C",
	vergabe_einheit: "",
	hilfsnummerierung: "",
	datentraeger_nummer: "1",
	dokumentenversion: "",
	projektidentifikation: "TESTProjekt",
	projektbezeichnung: "Umbau David Roth",
	dokumentenidentifikation: "000002110",
	vergabeeinheit: "2110 BAUMEISTEREARBEITEN",
	name_software_hersteller: "R.Messerli AG",
	telefonnummer_software_hersteller: "056/4183800",
	programmversion: "MesserliBAUAD 2009.2.5  (1202)",
});

const g: G_Record = createGRecord({
	kapitelnummer: "211",
	ausgabejahr: "19",
	leistungsposition: "321001",
	variablennummer: "01",
	zeilennummer: "01",
	objektgliederung: "",
	positionslage: "",
	variantengruppe: "",
	variante_in_gruppe: "",
	verbandskalkulation: "",
	recordtyp: "3", // what this?
	mengenart: "",
	vorzeichenmenge: "",
	menge: "",
	mengeneinheit: "LE",
	vorzeichenpreis: "+",
	preis: "222",
	laufnummer: "",
	kagcode: "",
	elementcode: "",
	positionstext: "Das ist der lange text am ende",
	speziellecodierungen: "irgendeine codierung",
});

const z: Z_Record = createClosingRecord({
	datum_export: formatDate(new Date()),
	erstellungsdatum_export: "",
	absender_kurzbezeichnung: "0",
	urheber_bezugsdokument: "",
	anzahl_austauschrecords: "3",
	fortsetzung: "-",
	datentraegernummer: "1",
	versionbezugsdokument: "",
	projektidentifikation: "UMB_4557_PF",
	projektbezeichnung: "Umbau diesdas",
	identifikation_bezugsdokument: "",
	sachbearbeiter_firma: "www.ursroth.ch",
	telefonnummer_sachbearbeiter: "032 / 677 06 60",
	name_sachbearbeiter: "ap.ursroth@gmail.com",
});

const content = serializeFile(a, [g], z);
write(content);
