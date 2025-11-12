import { useNavigate } from "react-router";
import chaptersJson from "../../../data/data.json";

export default function Table() {
	const navigate = useNavigate();
	const chapters = (chaptersJson as any[]).map((c) => (
		<tr
			key={c.levelCode}
			onClick={() => navigate(`/chapters/${c.levelCode}`)}
		>
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
				<tbody>{chapters}</tbody>
			</table>
		</main>
	);
}
