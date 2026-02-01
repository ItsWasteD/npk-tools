import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NpkNode } from "./NpkNode";

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
				console.log(chapter);
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Loading NPK data…</p>;

	return (
		<main className="mx-auto border border-secondary rounded p-3">
			{data.map((rootNode, idx) => (
				<NpkNode key={idx} node={rootNode} />
			))}
		</main>
	);
}
