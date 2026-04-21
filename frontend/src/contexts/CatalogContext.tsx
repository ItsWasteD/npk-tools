import { createContext, useContext, useMemo, useState, useTransition, useEffect } from "react";
import type { NpkPosition, NpkVariable } from "../types/npk.types";

// Represents a selected position or variable (direct selections only, not parents)
export type SelectedItem = {
	id: string;
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
	selectedItemIds: Set<string>;
	selectedLevelcodes: Set<string>; // Fast O(1) lookup by position levelcode
	toggleSelection: (item: SelectedItem) => void;
	clearSelection: () => void;
	isItemOrParentSelected: (levelcode: string) => boolean;
	isItemSelected: (id: string) => boolean;
	isPending: boolean;
};

const CatalogContext = createContext<CatalogContextType | null>(null);

export function useCatalog() {
	const ctx = useContext(CatalogContext);
	if (!ctx) throw new Error("useCatalog must be inside CatalogProvider");
	return ctx;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
	const [viewCatalog, setViewCatalog] = useState(() => {
		const savedView = localStorage.getItem("npk-view-catalog");
		return savedView ? JSON.parse(savedView) : true;
	});
	const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
		const saved = localStorage.getItem("npk-selected-items");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				return parsed.map((s: any) => ({
					...s,
					parents: s.parents.map((levelcode: string) => ({ levelcode }) as NpkPosition),
					item: null,
				}));
			} catch (e) {
				console.error("Failed to parse saved selected items", e);
				return [];
			}
		}
		return [];
	});
	const [isPending, startTransition] = useTransition();

	// Save to localStorage when selectedItems changes
	useEffect(() => {
		localStorage.setItem(
			"npk-selected-items",
			JSON.stringify(
				selectedItems.map((si) => ({
					id: si.id,
					levelcode: si.levelcode,
					name: si.name,
					type: si.type,
					parents: si.parents.map((p) => p.levelcode),
				})),
			),
		);
	}, [selectedItems]);

	// Save viewCatalog to localStorage
	useEffect(() => {
		localStorage.setItem("npk-view-catalog", JSON.stringify(viewCatalog));
	}, [viewCatalog]);

	const handleSetViewCatalog = (v: boolean) => {
		startTransition(() => setViewCatalog(v));
	};

	const toggleSelection = (item: SelectedItem) => {
		setSelectedItems((prev) => {
			const isSelected = prev.some((si) => si.id === item.id);

			if (isSelected) {
				return prev.filter((si) => si.id !== item.id);
			}

			return [...prev, item];
		});
	};

	const clearSelection = () => {
		setSelectedItems([]);
	};

	// Build Set of selected levelcodes for O(1) lookup
	// Include selected positions and all parents of selected items
	const selectedLevelcodes = useMemo(() => {
		const codes = new Set<string>();
		selectedItems.forEach((si) => {
			if (si.type === "position") {
				codes.add(si.levelcode);
			}
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

	const selectedItemIds = useMemo(() => {
		return new Set(selectedItems.map((si) => si.id));
	}, [selectedItems]);

	const isItemSelected = (id: string): boolean => {
		return selectedItemIds.has(id);
	};

	const value = useMemo(
		() => ({
			viewCatalog,
			setViewCatalog: handleSetViewCatalog,
			selectedItems,
			selectedItemIds,
			selectedLevelcodes,
			toggleSelection,
			clearSelection,
			isItemOrParentSelected,
			isItemSelected,
			isPending,
		}),
		[viewCatalog, selectedItems, selectedItemIds, selectedLevelcodes, isPending],
	);

	return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
