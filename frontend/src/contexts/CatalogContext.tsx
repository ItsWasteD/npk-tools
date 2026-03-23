import { createContext, useContext, useMemo, useState } from "react";

type CatalogContextType = {
	viewCatalog: boolean;
	setViewCatalog: (b: boolean) => void;
};

const CatalogContext = createContext<CatalogContextType | null>(null);

export function useCatalog() {
	const ctx = useContext(CatalogContext);
	if (!ctx) throw new Error("useCatalog must be inside CatalogProvider");
	return ctx;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
	const [viewCatalog, setViewCatalog] = useState(true);

	const value = useMemo(() => ({ viewCatalog, setViewCatalog }), [viewCatalog]);

	return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
