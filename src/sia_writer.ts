import { writeFileSync } from "fs";

function write(lines: string[]) {
	writeFileSync("export.01S", Buffer.from(lines.join(""), "latin1"));
}
