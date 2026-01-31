export function getTitle(node: any): string {
	if (typeof node?.name === "string") {
		return node.name;
	}

	if (typeof node?.name?.text?.title === "string") {
		return node.name.text.title;
	}

	return "";
}

export function getLevelCode(node: any): string {
	if (typeof node?.levelcode?.title === "string") {
		return node.levelcode.title;
	}

	if (typeof node?.levelCode === "string") {
		return node.levelCode;
	}

	return "";
}
