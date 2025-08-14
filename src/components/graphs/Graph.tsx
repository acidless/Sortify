import {useEffect, useRef, useState} from "react";
import BSTNode from "../bst/BSTNode.tsx";
import type {GraphNode} from "../../types.ts";

type GraphProps = {
    nodes: GraphNode[];
    nodeStateFunc: (id: string) => string;
};

function Graph({ nodes, nodeStateFunc }: GraphProps) {
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [edges, setEdges] = useState<Array<{ from: string; to: string }>>([]);
    const svgWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!svgWrapperRef.current) return;

        const width = svgWrapperRef.current.clientWidth;

        const radius = nodes.length * 25;
        const centerX = width / 2;
        const centerY = 200;

        const newPositions: Record<string, { x: number; y: number }> = {};
        nodes.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodes.length;
            newPositions[node.id] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            };
        });

        const newEdges = nodes.flatMap((node) =>
            node.neighbors.map((neighbor) => ({
                from: node.id,
                to: neighbor
            }))
        );

        setPositions(newPositions);
        setEdges(newEdges);
    }, [nodes]);

    return (
        <div ref={svgWrapperRef} className="relative w-full h-full flex-1">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {edges.map((line, i) => (
                    <line
                        key={i}
                        x1={positions[line.from]?.x ?? 0}
                        y1={positions[line.from]?.y ?? 0}
                        x2={positions[line.to]?.x ?? 0}
                        y2={positions[line.to]?.y ?? 0}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}
            </svg>

            {nodes.map((node) => (
                <BSTNode
                    key={node.id}
                    id={node.id}
                    node={node.value}
                    x={positions[node.id]?.x ?? 0}
                    y={positions[node.id]?.y ?? 0}
                    stateFunc={nodeStateFunc}
                />
            ))}
        </div>
    );
}

export default Graph;