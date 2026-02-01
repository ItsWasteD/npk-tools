import { getLevelCode, getTitle } from "../util/npkUtils";

type NpkNodeProps = {
	node: any;
	level?: number;
};

export function NpkNode({ node, level = 0 }: NpkNodeProps) {
	const title = getLevelCode(node);
	const name = getTitle(node);

	const hasPositions = Array.isArray(node.positions) && node.positions.length > 0;

	return (
		<div style={{ marginLeft: level * 16 }}>
			<div>
				<strong>{title}</strong>
				{name && ` – ${name}`}
			</div>

			{hasPositions &&
				node.positions.map((child: any, idx: number) => (
					<NpkNode key={`${getLevelCode(child)}-${idx}`} node={child} level={level + 1} />
				))}
		</div>
	);
}
