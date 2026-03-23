import { createContext, useContext, useMemo, useState } from "react";

type FilterContextType = {
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

	const value = useMemo(() => ({ filteredLevel, setFilteredLevel }), [filteredLevel]);

	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
