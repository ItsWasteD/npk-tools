export const recordSchema = [
	{ name: "recordart", length: 1 },
	{ name: "katalog", length: 6 },
	{ name: "leistungsposition", length: 6 },
	{ name: "variablennummer", length: 2 },
	{ name: "zeilennummer", length: 2 },
	{ name: "objektgliederung", length: 6 },
	{ name: "positionslage", length: 6 },
	{ name: "variantengruppe", length: 3 },
	{ name: "variante_in_gruppe", length: 3 },
	{ name: "verbandskalkulation", length: 6 },
	{ name: "recordtyp", length: 1 },
	{ name: "leer1", length: 1 },
	{ name: "mengenart", length: 1 },
	{ name: "vorzeichenmenge", length: 1 },
	{ name: "menge", length: 13 },
	{ name: "mengeneinheit", length: 2 },
	{ name: "leer3", length: 1 },
	{ name: "vorzeichenpreis", length: 1 },
	{ name: "preis", length: 12 },
	{ name: "laufnummer", length: 7 },
	{ name: "kagcode", length: 5 },
	{ name: "elementcode", length: 6 },
	{ name: "positionstext", length: 30 },
	{ name: "speziellecodierungen", length: 134 },
] as const;

export const headerRecordSchema = [
	{ name: "recordart", length: 1 }, //A
	{ name: "erstellungsdatum", length: 6 },
	{ name: "schnittstellenversion", length: 6 },
	{ name: "fehlerstufe", length: 2 },
	{ name: "durchgefuehrte_pruefung", length: 2 },
	{ name: "bauherren_kurzbezeichnung", length: 12 },
	{ name: "dokumenten_urheber", length: 12 },
	{ name: "sprachcode", length: 1 },
	{ name: "stellung_zur_vorversion", length: 1 }, // A= Änderung; B= Nachtrag, Ergänzung
	{ name: "dokumenten_code", length: 1 }, // A= Ausmass; B= Ausschreibung; C= Angebot; D= Vertrag; E= Teilrechnung; F= Situationsrechnung
	{ name: "dokumenten_status", length: 1 }, // A= Entwurf; B= provisorisch gültig; C= gültig; D= Storno
	{ name: "vergabe_einheit", length: 13 }, // Nr./Code
	{ name: "hilfsnummerierung", length: 4, pad: "start", padChar: "0" }, // z.B. Nachtragsnummer bei Verträgen, Rechnungsnummer innerhalb von Verträgen
	{ name: "datentraeger_nummer", length: 12 },
	{ name: "dokumentenversion", length: 7 },
	{ name: "projektidentifikation", length: 11 },
	{ name: "projektbezeichnung", length: 30 },
	{ name: "dokumentenidentifikation", length: 15 }, // a-d
	{ name: "vergabeeinheit", length: 30 }, // e
	{ name: "name_software_hersteller", length: 20 }, // f
	{ name: "telefonnummer_software_hersteller", length: 20 }, // g
	{ name: "programmversion", length: 49 }, // h
] as const;

export const gRecordSchema = [
	{ name: "recordart", length: 1 },
	{ name: "kapitelnummer", length: 3 },
	{ name: "leer1", length: 1 },
	{ name: "ausgabejahr", length: 2 },
	{ name: "leistungsposition", length: 6 },
	{ name: "variablennummer", length: 2 },
	{ name: "zeilennummer", length: 2 },
	{ name: "objektgliederung", length: 6 },
	{ name: "positionslage", length: 6 },
	{ name: "variantengruppe", length: 3 },
	{ name: "variante_in_gruppe", length: 3 },
	{ name: "verbandskalkulation", length: 6 },
	{ name: "recordtyp", length: 1 },
	{ name: "leer2", length: 1 },
	{ name: "mengenart", length: 1 },
	{ name: "vorzeichenmenge", length: 1 },
	{ name: "menge", length: 13 },
	{ name: "mengeneinheit", length: 2 },
	{ name: "leer3", length: 1 },
	{ name: "vorzeichenpreis", length: 1 },
	{ name: "preis", length: 12 },
	{ name: "laufnummer", length: 7 },
	{ name: "kagcode", length: 5 },
	{ name: "elementcode", length: 6 },
	{ name: "positionstext", length: 30 },
	{ name: "speziellecodierungen", length: 134 },
] as const;

export const closingRecordSchema = [
	{ name: "recordart", length: 1 }, // Z
	{ name: "datum_export", length: 6 }, // TTMMJJ
	{ name: "erstellungsdatum_export", length: 6 }, // TTMMJJ
	{ name: "leer1", length: 2 },
	{ name: "leer2", length: 2 },
	{ name: "absender_kurzbezeichnung", length: 12 },
	{ name: "urheber_bezugsdokument", length: 12 },
	{ name: "leer3", length: 4 },
	{ name: "anzahl_austauschrecords", length: 13, pad: "start", padChar: "0" }, // Inklusive Header + Schlussrecord
	{ name: "leer4", length: 3 },
	{ name: "fortsetzung", length: 1 }, // + = weiter Datei, - = letzte Datei
	{ name: "datentraegernummer", length: 12, pad: "start", padChar: "0" },
	{ name: "versionbezugsdokument", length: 7 },
	{ name: "projektidentifikation", length: 11 },
	{ name: "projektbezeichnung", length: 30 },
	{ name: "identifikation_bezugsdokument", length: 15 }, // a-d
	{ name: "sachbearbeiter_firma", length: 30 }, // e
	{ name: "telefonnummer_sachbearbeiter", length: 40 }, //f
	{ name: "name_sachbearbeiter", length: 30 }, // g
	{ name: "leer5", length: 17 }, // h
] as const;

export type RecordType = {
	[K in (typeof recordSchema)[number]["name"]]: string;
};

export type A_Record = {
	recordart: "A";
} & {
	[K in Exclude<(typeof headerRecordSchema)[number]["name"], "recordart">]: string;
};

export type G_Record = { recordart: "G" } & {
	[K in Exclude<(typeof gRecordSchema)[number]["name"], "recordart">]: string;
};

export type Z_Record = { recordart: "Z" } & {
	[K in Exclude<(typeof closingRecordSchema)[number]["name"], "recordart">]: string;
};

export type RemoveLeer<T> = {
	[K in keyof T as K extends `leer${string}` ? never : K]: T[K];
};

export type AustauschRecord = A_Record | G_Record | Z_Record;
