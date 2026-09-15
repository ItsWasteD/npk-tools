import { useCatalog } from "../contexts/CatalogContext";
import NpkChapter from "./NpkChapter";
import type { NpkPosition, NpkRoot } from "../types/npk.types";

function CatalogTable({ data }: { data: NpkRoot }) {
	const { selectedItems } = useCatalog();

	if (selectedItems.length === 0) {
		return (
			<div className="alert alert-info">
				Keine Positionen ausgewählt. Benutze "Enter" um eine Position
				hinzuzufügen.
			</div>
		);
	}

	// Filter the tree to only show branches that contain selected items
	const selectedPaths = new Set(
		selectedItems.flatMap((item) => {
			const path = [
				...item.parents.map((parent) => parent.levelcode),
				...(item.type === "position" ? [item.levelcode] : []),
			];
			return path.map((_, index) => path.slice(0, index + 1).join("/"));
		}),
	);

	const filterSelectedTree = (
		node: NpkPosition,
		parents: NpkPosition[] = [],
	): NpkPosition | null => {
		// Check if this node or any of its descendants are selected
		const path = [
			...parents.map((parent) => parent.levelcode),
			node.levelcode,
		].join("/");
		const isSelected = selectedPaths.has(path);

		// Recursively filter children
		const filteredChildren = node.positions
			? node.positions
					.map((child) =>
						filterSelectedTree(child, [...parents, node]),
					)
					.filter((child): child is NpkPosition => child !== null)
			: [];

		// Include this node if it's selected or has selected children
		if (isSelected || filteredChildren.length > 0) {
			return {
				...node,
				positions: filteredChildren,
			};
		}

		return null;
	};

	const filteredData = {
		...data,
		positions: data.positions
			.map((position) => filterSelectedTree(position))
			.filter((pos): pos is NpkPosition => pos !== null),
	};

	return (
		<div>
			<NpkChapter key={0} node={filteredData} />
		</div>
	);
}

export default CatalogTable;
