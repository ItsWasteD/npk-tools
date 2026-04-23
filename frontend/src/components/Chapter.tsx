import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import NpkChapter from "./NpkChapter";
import ChapterHeader from "./ChapterHeader";
import { FilterProvider, useFilter } from "../contexts/FilterContext";
import { CatalogProvider, useCatalog } from "../contexts/CatalogContext";
import type { NpkRoot } from "../types/npk.types";
import { filterRootNode, trimVariablesInRoot } from "../utils/npk";
import CatalogTable from "./CatalogTable";
import Spinner from "./Spinner";

function FilteredNpkChapters({ data }: { data: NpkRoot }) {
	const { filteredLevel, isPending } = useFilter();

	const filteredData = useMemo(() => {
		if (!data) return;
		return filterRootNode(data, filteredLevel);
	}, [data, filteredLevel]);

	if (isPending) {
		return <Spinner message="Switching level..." />;
	}

	return (
		<>
			<NpkChapter node={filteredData!} />
		</>
	);
}

function ChapterContent({ data }: { data: NpkRoot }) {
	const { viewCatalog, isPending } = useCatalog();

	if (isPending) {
		return <Spinner message="Loading catalog..." />;
	}

	return viewCatalog ? <FilteredNpkChapters data={data} /> : <CatalogTable data={data} />;
}

export default function Chapter() {
	const params = useParams();
	const [data, setData] = useState<NpkRoot>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/npk-tools/${params.cid}.json`)
			.then((res) => res.json())
			.then((chapter) => {
				trimVariablesInRoot(chapter);

				setData(chapter);
				setLoading(false);
			});
	}, [params.cid]);

	if (loading) return <Spinner message="Loading chapter..." />;

	return (
		<CatalogProvider>
			<FilterProvider>
				<main className="mx-auto p-3 mt-3">
					<div className="d-flex justify-content-between">
						<ChapterHeader />
					</div>
					<ChapterContent data={data!} />
				</main>
			</FilterProvider>
		</CatalogProvider>
	);
}
