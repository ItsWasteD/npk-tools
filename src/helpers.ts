import {
	closingRecordSchema,
	gRecordSchema,
	headerRecordSchema,
	type A_Record,
	type G_Record,
	type RemoveLeer,
	type Z_Record,
} from "./types/npk_types";

type SchemaField = { name: string; length: number; pad?: "start" | "end"; padChar?: string };
type Schema = readonly SchemaField[];

export function serializeRecord<T extends Record<string, string>>(record: T, schema: Schema): string {
	return schema
		.map((field) => {
			const value = record[field.name] ?? "";

			if (value.length > field.length) {
				throw new Error(`Field ${field.name} exceeds max length ${field.length}`);
			}

			const pad = field.pad ?? "end";
			const char = field.padChar ?? " ";

			if (pad === "start") {
				return value.padStart(field.length, char);
			}

			return value.padEnd(field.length, " ");
		})
		.join("");
}

export function serializeFile(header: A_Record, records: G_Record[], closing: Z_Record) {
	return (
		[
			serializeRecord(header, headerRecordSchema),
			...records.map((r) => serializeRecord(r, gRecordSchema)),
			serializeRecord(closing, closingRecordSchema),
		].join("\r\n") + "\r\n"
	);
}

export function formatDate(date: Date) {
	return date.toLocaleDateString("de-CH", { year: "2-digit", month: "2-digit", day: "2-digit" }).replaceAll(".", "");
}

export function createHeaderRecord(data: Omit<RemoveLeer<A_Record>, "recordart">): A_Record {
	return {
		recordart: "A",
		...data,
	};
}

export function createGRecord(data: Omit<RemoveLeer<G_Record>, "recordart">): G_Record {
	return {
		recordart: "G",
		...data,
	} as G_Record;
}

export function createClosingRecord(data: Omit<RemoveLeer<Z_Record>, "recordart">): Z_Record {
	return {
		recordart: "Z",
		...data,
	} as Z_Record;
}
