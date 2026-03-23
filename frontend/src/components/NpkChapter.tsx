import React from "react";
import { useFilter } from "../contexts/FilterContext";
import type { NpkPosition, NpkRoot } from "../types/npk.types";

const productsEnabled = false;

function NpkRootNode({ node }: { node: NpkRoot }) {
	return (
		<div>
			<h2>
				{node.levelCode} - {node.name}
			</h2>
			{node.positions.map((pos, i) => (
				<NpkPositionNode key={pos.levelcode ?? i} node={pos} level={0} />
			))}
		</div>
	);
}

const NpkPositionNode = React.memo(function NpkPositionNode({
	node,
	level = 0,
}: {
	node: NpkPosition;
	level?: number;
}) {
	const { filteredLevel } = useFilter();

	if (filteredLevel && level >= filteredLevel) return null;

	const title = node.levelcode;
	const nameNode = node.name;

	const hasPositions = (node.positions?.length ?? 0) > 0;

	return (
		<div tabIndex={0} className={`npk-node fs-6 border ${level !== 0 ? "ms-3" : ""}`}>
			<div>
				<div style={level < 4 ? { fontWeight: "bold" } : { fontWeight: "normal" }}>
					{title}
					{nameNode.text.title && <> - {nameNode.text.title}</>}
				</div>
				<div>
					{nameNode.text.body}
					<div>
						{nameNode.text.items?.map((it, i) => (
							<div key={i}>
								<i>{it}</i>
								<br />
							</div>
						))}
					</div>
				</div>
				{nameNode.description?.label && (
					<div>
						{nameNode.description?.label} - {nameNode.description?.content}
					</div>
				)}
				{productsEnabled && nameNode.products && (
					<div>
						{nameNode.products.map((prod, _i) => (
							<>
								{prod.label}
								{prod.icon && <>- {prod.icon}</>}
							</>
						))}
					</div>
				)}
				{nameNode.variables && (
					<div>
						{nameNode.variables.map((el, i) => (
							<div key={i}>
								{el.levelcode}
								{el.name && <>-{el.name}</>}
								{el.eco && <>-{el.eco}</>}
								{el.group && <>-{el.group}</>}
								{el.products && <>-{el.products}</>}
							</div>
						))}
					</div>
				)}
				{node.unit && <div>{node.unit}</div>}
				{node.eco && <div>{node.eco.text}</div>}
				{/* TODO: Media node.media */}
			</div>

			{hasPositions &&
				node.positions!.map((child: NpkPosition, idx: number) => (
					<NpkPositionNode key={`${child.levelcode}-${idx}`} node={child} level={level + 1} />
				))}
		</div>
	);
});

type NpkChapterProps = {
	node: NpkPosition | NpkRoot;
	level?: number;
};

export default function NpkChapter(props: NpkChapterProps) {
	const level = props.level ?? 0;
	const node = props.node;

	return <>{level === 0 ? <NpkRootNode node={node as NpkRoot} /> : <NpkPositionNode node={node as NpkPosition} />}</>;
}
