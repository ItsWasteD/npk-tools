import { createContext, useContext, useMemo, useState, useTransition } from "react";

type FilterContextType = {
	filteredLevel: number;
	setFilteredLevel: (n: number) => void;
	isPending: boolean;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function useFilter() {
	const ctx = useContext(FilterContext);
	if (!ctx) throw new Error("useFilter must be inside FilterProvider");
	return ctx;
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
	const [filteredLevel, setFilteredLevel] = useState(6);
	const [isPending, startTransition] = useTransition();

	const handleSetFilteredLevel = (n: number) => {
		startTransition(() => {
			setFilteredLevel(n);
		});
	};

	const value = useMemo(
		() => ({ filteredLevel, setFilteredLevel: handleSetFilteredLevel, isPending }),
		[filteredLevel, isPending],
	);

	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
