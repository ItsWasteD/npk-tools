import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import NpkChapter from "./NpkChapter";
import ChapterFilter from "./ChapterFilter";
import { FilterProvider, useFilter } from "../contexts/FilterContext";
import { CatalogProvider } from "../contexts/CatalogContext";
import type { NpkRoot } from "../types/npk.types";
import { filterRootNode, trimVariablesInRoot } from "../utils/npk";

function FilteredNpkChapters({ data }: { data: NpkRoot[] }) {
	const { filteredLevel } = useFilter();

	const filteredData = useMemo(() => {
		if (!data) return;
		return data.map((root) => filterRootNode(root, filteredLevel));
	}, [data, filteredLevel]);

	return (
		<>
			{filteredData?.map((rootNode, idx) => (
				<NpkChapter key={idx} node={rootNode} />
			))}
		</>
	);
}

export default function Chapter() {
	const params = useParams();
	const [data, setData] = useState<NpkRoot[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/npk-tools/data.json")
			.then((res) => res.json())
			.then((json) => {
				const chapter = json.filter((el: any) => el.levelCode == params.cid);

				chapter.forEach(trimVariablesInRoot);

				setData(chapter);
				setLoading(false);
			});
	}, [params.cid]);

	if (loading) return <p>Loading NPK data…</p>;

	return (
		<CatalogProvider>
			<FilterProvider>
				<main className="mx-auto border border-secondary p-3 mt-5">
					<ChapterFilter />
					<FilteredNpkChapters data={data} />
				</main>
			</FilterProvider>
		</CatalogProvider>
	);
}
