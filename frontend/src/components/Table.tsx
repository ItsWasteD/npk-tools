import { ALL_CHAPTERS, CHAPTER_MAP } from "../constants";
import { useNavigate } from "react-router-dom";

export default function Table() {
	const navigate = useNavigate();

	//if (isPending) return <Spinner message="Loading chapters..." />;

	const chaptersView = ALL_CHAPTERS.map((c) => (
		<tr key={c} onClick={() => navigate(`/chapters/${c}`)}>
			<td>{c}</td>
			<td>{CHAPTER_MAP[c]}</td>
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
