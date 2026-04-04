import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback } from "react";

export default function Export() {
	const exportPdf = useCallback(() => {
		const doc = new jsPDF();

		// Header
		doc.setFontSize(48);
		doc.setTextColor(40, 40, 40);
		doc.text("Offerte Urs Roth 2026", 14, 20);

		doc.setFontSize(10);
		doc.setTextColor(120);
		doc.text("Source: NPK Handbook 2024", 14, 27);

		doc.setDrawColor(200);
		doc.line(14, 30, 196, 30);

		autoTable(doc, {
			startY: 35,
			head: [["Element", "Symbol", "Role", "Deficiency Symptom", "Optimal Range"]],
			body: [
				["Nitrogen", "N", "Leaf growth", "Yellowing leaves", "150–200 mg/L"],
				["Phosphorus", "P", "Root development", "Purple discoloration", "30–50 mg/L"],
				["Potassium", "K", "Water regulation", "Leaf edge burn", "100–150 mg/L"],
				// ... many more rows, autoTable handles page breaks automatically
			],
			styles: {
				fontSize: 9,
				cellPadding: 3,
			},
			headStyles: {
				fillColor: [41, 98, 255],
				textColor: 255,
				fontStyle: "bold",
			},
			alternateRowStyles: {
				fillColor: [245, 247, 255],
			},
			margin: { top: 35, left: 14, right: 14 },
		});

		//doc.save("npk-chapter.pdf");
		const url = doc.output("bloburl");
		window.open(url, "_blank");
	}, []);

	return (
		<div className="">
			<button type="button" className="btn btn-warning" onClick={exportPdf}>
				Export als PDF
			</button>
		</div>
	);
}
