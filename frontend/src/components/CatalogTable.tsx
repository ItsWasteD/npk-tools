import { useCatalog } from "../contexts/CatalogContext";
import NpkChapter from "./NpkChapter";
import type { NpkPosition, NpkRoot } from "../types/npk.types";

function CatalogTable({ data }: { data: NpkRoot[] }) {
	const { selectedItems, selectedLevelcodes } = useCatalog();

	if (selectedItems.length === 0) {
		return (
			<div className="alert alert-info">
				Keine Positionen ausgewählt. Benutze "Enter" um eine Position hinzuzufügen.
			</div>
		);
	}

	// Filter the tree to only show branches that contain selected items
	const filterSelectedTree = (node: NpkPosition): NpkPosition | null => {
		// Check if this node or any of its descendants are selected
		const isSelected = selectedLevelcodes.has(node.levelcode);

		// Recursively filter children
		const filteredChildren = node.positions
			? node.positions.map(filterSelectedTree).filter((child): child is NpkPosition => child !== null)
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

	const filteredData = data.map((root) => ({
		...root,
		positions: root.positions.map(filterSelectedTree).filter((pos): pos is NpkPosition => pos !== null),
	}));

	return (
		<div>
			{filteredData.map((rootNode, idx) => (
				<NpkChapter key={idx} node={rootNode} />
			))}
		</div>
	);
}

export default CatalogTable;
