import { createContext, useContext, useMemo, useState, useTransition } from "react";
import type { NpkPosition, NpkVariable } from "../types/npk.types";

// Represents a selected position or variable (direct selections only, not parents)
export type SelectedItem = {
	levelcode: string;
	name: string;
	type: "position" | "variable";
	parents: NpkPosition[]; // Full parent chain from root to direct parent
	item: NpkPosition | NpkVariable; // The actual item selected
};

type CatalogContextType = {
	viewCatalog: boolean;
	setViewCatalog: (b: boolean) => void;
	selectedItems: SelectedItem[];
	selectedLevelcodes: Set<string>; // Fast O(1) lookup by levelcode
	toggleSelection: (item: SelectedItem) => void;
	clearSelection: () => void;
	isItemOrParentSelected: (levelcode: string) => boolean;
	isPending: boolean;
};

const CatalogContext = createContext<CatalogContextType | null>(null);

export function useCatalog() {
	const ctx = useContext(CatalogContext);
	if (!ctx) throw new Error("useCatalog must be inside CatalogProvider");
	return ctx;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
	const [viewCatalog, setViewCatalog] = useState(true);
	const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
	const [isPending, startTransition] = useTransition();

	const handleSetViewCatalog = (v: boolean) => {
		startTransition(() => setViewCatalog(v));
	};

	const toggleSelection = (item: SelectedItem) => {
		setSelectedItems((prev) => {
			const isSelected = prev.some((si) => si.levelcode === item.levelcode && si.type === item.type);

			if (isSelected) {
				return prev.filter((si) => !(si.levelcode === item.levelcode && si.type === item.type));
			} else {
				return [...prev, item];
			}
		});
	};

	const clearSelection = () => {
		setSelectedItems([]);
	};

	// Build Set of selected levelcodes for O(1) lookup
	// Include selected items AND all their parents in the set
	const selectedLevelcodes = useMemo(() => {
		const codes = new Set<string>();
		selectedItems.forEach((si) => {
			// Add the selected item itself
			codes.add(si.levelcode);
			// Add all its parents
			si.parents.forEach((parent) => {
				codes.add(parent.levelcode);
			});
		});
		return codes;
	}, [selectedItems]);

	// Check if a node is selected directly OR if it's a parent of a selected node
	const isItemOrParentSelected = (levelcode: string): boolean => {
		return selectedLevelcodes.has(levelcode);
	};

	const value = useMemo(
		() => ({
			viewCatalog,
			setViewCatalog: handleSetViewCatalog,
			selectedItems,
			selectedLevelcodes,
			toggleSelection,
			clearSelection,
			isItemOrParentSelected,
			isPending,
		}),
		[viewCatalog, selectedItems, selectedLevelcodes, isPending],
	);

	return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
