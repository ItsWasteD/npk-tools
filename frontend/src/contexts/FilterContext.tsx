import { createContext, useContext, useMemo, useState } from "react";

type FilterContextType = {
	viewCatalog: boolean;
	setViewCatalog: (b: boolean) => void;
	filteredLevel: number;
	setFilteredLevel: (n: number) => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function useFilter() {
	const ctx = useContext(FilterContext);
	if (!ctx) throw new Error("useFilter must be inside FilterProvider");
	return ctx;
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
	const [filteredLevel, setFilteredLevel] = useState(6);
	const [viewCatalog, setViewCatalog] = useState(true);

	const value = useMemo(
		() => ({ viewCatalog, setViewCatalog, filteredLevel, setFilteredLevel }),
		[viewCatalog, filteredLevel],
	);

	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
