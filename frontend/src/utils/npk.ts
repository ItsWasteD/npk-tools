import type { NpkPosition, NpkRoot } from "../types/npk.types";

export function filterChapterTree(node: NpkPosition, level: number, maxLevel: number): NpkPosition | null {
	if (level >= maxLevel) return null;

	const filteredChildren = node.positions
		? node.positions
				.map((child) => filterChapterTree(child, level + 1, maxLevel))
				.filter((c): c is NpkPosition => c !== null)
		: [];

	return {
		...node,
		positions: filteredChildren,
	};
}

export function filterRootNode(root: NpkRoot, maxLevel: number): NpkRoot {
	return {
		...root,
		positions: root.positions
			.map((p) => filterChapterTree(p, 0, maxLevel))
			.filter((p): p is NpkPosition => p !== null),
	};
}

export function trimVariablesInNode(node: NpkPosition): void {
	// Trim variables in this node
	if (node.name?.variables) {
		node.name.variables.forEach((v) => {
			if (v.name) v.name = v.name.trim();
			if (v.eco) v.eco = v.eco.trim();
			if (v.group) v.group = v.group.trim();
			if (v.products) v.products = v.products.trim();
		});
	}

	// Recurse into children
	if (node.positions) {
		node.positions.forEach(trimVariablesInNode);
	}
}

export function trimVariablesInRoot(root: NpkRoot): void {
	root.positions.forEach(trimVariablesInNode);
}
