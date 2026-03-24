import { useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";

export default function Table() {
	const navigate = useNavigate();

	const [chapters, setChapters] = useState<any[]>([]);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		fetch("/npk-tools/data.json")
			.then((res) => res.json())
			.then((data) => startTransition(() => setChapters(data)));
	}, []);

	if (isPending) return <Spinner message="Loading chapters..." />;

	const chaptersView = chapters.map((c) => (
		<tr key={c.levelCode} onClick={() => navigate(`/chapters/${c.levelCode}`)}>
			<td>{c.levelCode}</td>
			<td>{c.name}</td>
		</tr>
	));

	return (
		<main className="w-75 mx-auto">
			<table className="table table-dark table-striped table-bordered table-responsive rounded-3">
				<thead>
					<tr>
						<th>NPK Kapitel</th>
						<th>Titel</th>
					</tr>
				</thead>
				<tbody>{chaptersView}</tbody>
			</table>
		</main>
	);
}
