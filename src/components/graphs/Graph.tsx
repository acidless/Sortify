import {useEffect, useRef, useState} from "react";
import BSTNode from "../bst/BSTNode.tsx";
import type {GraphNode} from "../../types.ts";

type GraphProps = {
    nodes: GraphNode[];
    distances?: Map<string, number>;
    nodeStateFunc: (id: string) => string;
    weighted?: boolean;
    directed?: boolean;
};

function Graph({nodes, nodeStateFunc, weighted = false, directed = false, distances=new Map()}: GraphProps) {
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [edges, setEdges] = useState<Array<{ from: string; to: string, weight: number }>>([]);
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
                to: neighbor.to,
                weight: neighbor.weight,
            }))
        );

        setPositions(newPositions);
        setEdges(newEdges);
    }, [nodes]);

    function offsetPoint(x1: number, y1: number, x2: number, y2: number, r: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return {x: x2, y: y2};
        const ratio = (len - r) / len;
        return {
            x: x1 + dx * ratio,
            y: y1 + dy * ratio,
        };
    }

    function makeNodeValue(node: GraphNode) {
        let value = node.value.toString();
        if(distances.has(node.id)) {
            let distance = distances.get(node.id)!.toString();
            if(distance === "Infinity") {
                distance = "Inf";
            }

            value = `${value},${distance}`;
        }

        return value;
    }

    return (
        <div ref={svgWrapperRef} className="relative w-full h-full flex-1">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <defs>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="9"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="white"/>
                    </marker>
                </defs>

                {edges.map((line, i) => {
                    const x1 = positions[line.from]?.x ?? 0;
                    const y1 = positions[line.from]?.y ?? 0;
                    const x2 = positions[line.to]?.x ?? 0;
                    const y2 = positions[line.to]?.y ?? 0;

                    const {x: endX, y: endY} = offsetPoint(x1, y1, x2, y2, 50);

                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    return (
                        <g key={i}>
                            <line
                                x1={x1}
                                y1={y1}
                                x2={endX}
                                y2={endY}
                                stroke="white"
                                strokeWidth="2"
                                markerEnd={directed ? "url(#arrow)" : undefined}
                            />
                            {weighted &&
                                <>
                                    <rect
                                        x={midX - 14}
                                        y={midY - 14}
                                        width="28"
                                        height="22"
                                        rx="4"
                                        ry="4"
                                        fill="black"
                                        opacity="1"
                                    />
                                    <text
                                        x={midX}
                                        y={midY}
                                        fill="green"
                                        fontSize="18"
                                        textAnchor="middle"
                                        dy="2"
                                        z="10"
                                    >
                                        {line.weight}
                                    </text>
                                </>
                            }
                        </g>
                    );
                })}
            </svg>

            {nodes.map((node) => (
                <BSTNode
                    key={node.id}
                    id={node.id}
                    node={makeNodeValue(node)}
                    fontSize={distances.has(node.id) ? "text-2xl" : "text-3xl"}
                    x={positions[node.id]?.x ?? 0}
                    y={positions[node.id]?.y ?? 0}
                    stateFunc={nodeStateFunc}
                />
            ))}
        </div>
    );
}

export default Graph;