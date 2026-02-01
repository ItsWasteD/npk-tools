import type { NpkPosition, NpkRoot } from "../types/npk.types";

function NpkRootNode({ node }: { node: NpkRoot }) {
	const chapter = node.levelCode;
	const name = node.name;

	return (
		<div>
			<h2>
				{chapter} - {name}
			</h2>
			{node.positions.map((pos, i) => (
				<NpkPositionNode key={i} node={pos} level={1} />
			))}
		</div>
	);
}

function NpkPositionNode({ node, level = 0 }: { node: NpkPosition; level: number }) {
	const title = node.levelcode;
	const nameNode = node.name;

	const hasPositions = node.positions?.length ?? 0 > 0;

	return (
		<div style={{ marginLeft: level * 16 }}>
			<div>
				<div style={level < 4 ? { fontWeight: "bold" } : { fontWeight: "normal" }}>
					{title}
					{nameNode.text.title && <> - {nameNode.text.title}</>}
				</div>
				<div style={{ backgroundColor: "green" }}>
					{nameNode.text.body}
					<div style={{ backgroundColor: "orange" }}>
						{nameNode.text.items?.map((it, i) => (
							<div key={i}>
								<i>{it}</i>
								<br />
							</div>
						))}
					</div>
				</div>
				{nameNode.description?.label && (
					<div style={{ backgroundColor: "blue" }}>
						{nameNode.description?.label} - {nameNode.description?.content}
					</div>
				)}
				{nameNode.products && (
					<div style={{ backgroundColor: "red" }}>
						{nameNode.products.map((prod, i) => (
							<p key={i}>
								{prod.label}
								{prod.icon && <>- {prod.icon}</>}
							</p>
						))}
					</div>
				)}
				{nameNode.variables && (
					<div style={{ backgroundColor: "darkcyan" }}>
						{nameNode.variables.map((el, i) => (
							<div key={i}>
								{el.levelcode}
								<br />
								{el.name?.trim() && (
									<>
										{el.name}
										<br />
									</>
								)}
								{el.eco?.trim() && (
									<>
										{el.eco}
										<br />
									</>
								)}
								{el.group?.trim() && (
									<>
										{el.group}
										<br />
									</>
								)}
								{el.products?.trim() && (
									<>
										{el.products}
										<br />
									</>
								)}
								---------------
								<br />
							</div>
						))}
					</div>
				)}
				{node.unit && <div style={{ backgroundColor: "lightgray" }}>{node.unit}</div>}
				{node.eco && <div style={{ backgroundColor: "black" }}>{node.eco.text}</div>}
				{/* TODO: Media node.media */}
			</div>

			{hasPositions &&
				node.positions!.map((child: NpkPosition, idx: number) => (
					<NpkPositionNode key={`${child.levelcode}-${idx}`} node={child} level={level + 1} />
				))}
		</div>
	);
}

type NpkChapterProps = {
	node: NpkPosition | NpkRoot;
	level?: number;
};

export default function NpkChapter(props: NpkChapterProps) {
	const level = props.level ?? 0;
	const node = props.node;

	return (
		<>
			{level === 0 ? (
				<NpkRootNode node={node as NpkRoot} />
			) : (
				<NpkPositionNode node={node as NpkPosition} level={1} />
			)}
		</>
	);
}
