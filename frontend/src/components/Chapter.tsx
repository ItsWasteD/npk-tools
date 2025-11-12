import { useParams } from "react-router";

export default function Chapter() {
	const params = useParams();

	return (
		<main className="w-75 mx-auto border border-secondary rounded p-3">
			<h2>{params.cid}</h2>
		</main>
	);
}
