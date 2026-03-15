import React from "react";
import { useFilter } from "../contexts/FilterContext";

export default function ChapterFilter() {
	const { viewCatalog, setViewCatalog, filteredLevel, setFilteredLevel } = useFilter();

	return (
		<>
			<div className="d-flex align-items-center mb-3 gap-2">
				<input
					type="checkbox"
					className="btn-check"
					id="btncheck1"
					autoComplete="off"
					checked={viewCatalog}
					onChange={() => setViewCatalog(!viewCatalog)}
				/>
				<label className="btn btn-outline-danger" htmlFor="btncheck1">
					Katalog
				</label>
				<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<React.Fragment key={n}>
							<input
								type="radio"
								className="btn-check"
								name="btnradio"
								id={`btnradio${n}`}
								value={n}
								checked={filteredLevel === n}
								onChange={(e) => setFilteredLevel(Number(e.target.value))}
							/>
							<label className="btn btn-primary" htmlFor={`btnradio${n}`}>
								{n}
							</label>
						</React.Fragment>
					))}
				</div>
			</div>
		</>
	);
}
