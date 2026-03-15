import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NpkChapter from "./NpkChapter";
import ChapterFilter from "./ChapterFilter";
import { FilterProvider } from "../contexts/FilterContext";

export default function Chapter() {
	const params = useParams();
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/npk-tools/data.json")
			.then((res) => res.json())
			.then((json) => {
				const chapter = json.filter((el: any) => el.levelCode == params.cid);
				setData(chapter);
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Loading NPK data…</p>;

	return (
		<FilterProvider>
			<main className="mx-auto border border-secondary p-3 mt-5">
				<ChapterFilter />
				{data.map((rootNode, idx) => (
					<NpkChapter key={idx} node={rootNode} />
				))}
			</main>
		</FilterProvider>
	);
}
