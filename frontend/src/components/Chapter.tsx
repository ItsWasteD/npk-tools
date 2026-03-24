import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import NpkChapter from "./NpkChapter";
import ChapterFilter from "./ChapterFilter";
import { FilterProvider, useFilter } from "../contexts/FilterContext";
import { CatalogProvider, useCatalog } from "../contexts/CatalogContext";
import type { NpkRoot } from "../types/npk.types";
import { filterRootNode, trimVariablesInRoot } from "../utils/npk";
import CatalogTable from "./CatalogTable";
import Spinner from "./Spinner";

function FilteredNpkChapters({ data }: { data: NpkRoot[] }) {
	const { filteredLevel, isPending } = useFilter();

	const filteredData = useMemo(() => {
		if (!data) return;
		return data.map((root) => filterRootNode(root, filteredLevel));
	}, [data, filteredLevel]);

	if (isPending) {
		return <Spinner message="Switching level..." />;
	}

	return (
		<>
			{filteredData?.map((rootNode, idx) => (
				<NpkChapter key={idx} node={rootNode} />
			))}
		</>
	);
}

function ChapterContent({ data }: { data: NpkRoot[] }) {
	const { viewCatalog, isPending } = useCatalog();

	if (isPending) {
		return <Spinner message="Loading catalog..." />;
	}

	return viewCatalog ? <FilteredNpkChapters data={data} /> : <CatalogTable data={data} />;
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

	if (loading) return <Spinner message="Loading chapter..." />;

	return (
		<CatalogProvider>
			<FilterProvider>
				<main className="mx-auto p-3 mt-3">
					<ChapterFilter />
					<ChapterContent data={data} />
				</main>
			</FilterProvider>
		</CatalogProvider>
	);
}
