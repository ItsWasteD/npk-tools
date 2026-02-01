export type NpkText = {
	title: string;
	body?: string;
	items?: string[];
};

export type NpkDescription = {
	label: string;
	content: string;
};

export type NpkProduct = {
	icon: string;
	label: string;
};

export type NpkVariable = {
	levelcode: string;
	name: string;
	products: string;
	group: string;
	eco: string;
};

export type NpkName = {
	text: NpkText;
	description?: NpkDescription;
	products?: NpkProduct[];
	variables?: NpkVariable[];
};

export type NpkUnit = {
	text: string;
};

export type NpkEco = {
	text: string;
};

export type NpkMedia = {
	items?: { imageUuid: string }[];
};

export type NpkPosition = {
	levelcode: string;
	name: NpkName;
	unit?: NpkUnit;
	eco?: NpkEco;
	media: NpkMedia;
};

export type NpkRoot = {
	levelCode: string;
	name: string;
	version: string;
	positions: NpkPosition[];
};
