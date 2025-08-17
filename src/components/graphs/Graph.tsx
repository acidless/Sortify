import { useEffect, useRef, useState } from "react";
import BSTNode from "../bst/BSTNode.tsx";
import type { GraphNode } from "../../types.ts";

type GraphProps = {
    nodes: GraphNode[];
    distances?: Map<string, number>;
    nodeStateFunc: (id: string) => string;
    weighted?: boolean;
    directed?: boolean;
};

type Pos = { x: number; y: number };
type Edge = { from: string; to: string; weight: number };

const NODE_R = 48;
const PADDING = 24;
const MIN_CANVAS = 400;

function Graph({
                   nodes,
                   nodeStateFunc,
                   weighted = false,
                   directed = false,
                   distances = new Map(),
               }: GraphProps) {
    const [positions, setPositions] = useState<Record<string, Pos>>({});
    const [edges, setEdges] = useState<Edge[]>([]);
    const [canvasSize, setCanvasSize] = useState<{ w: number; h: number }>({ w: MIN_CANVAS, h: MIN_CANVAS });

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!wrapperRef.current || nodes.length === 0) return;

        const el = wrapperRef.current;

        const layout = () => {
            const wrapperW = el.clientWidth || MIN_CANVAS;
            const wrapperH = el.clientHeight || MIN_CANVAS;

            const baseRadius = Math.max(120, nodes.length * 25);
            const maxRadiusByW = (wrapperW - 2 * (NODE_R + PADDING)) / 2;
            const maxRadiusByH = (wrapperH - 2 * (NODE_R + PADDING)) / 2;
            const maxAllowedRadius = Math.max(0, Math.min(maxRadiusByW, maxRadiusByH));

            const radius = Math.min(baseRadius, Math.max(maxAllowedRadius, 120));

            const required = 2 * (radius + NODE_R + PADDING);
            const canvasW = Math.max(wrapperW, required, MIN_CANVAS);
            const canvasH = Math.max(wrapperH, required, MIN_CANVAS);

            const centerX = canvasW / 2;
            const centerY = canvasH / 2;

            const newPositions: Record<string, Pos> = {};
            nodes.forEach((node, i) => {
                const angle = (2 * Math.PI * i) / nodes.length;
                newPositions[node.id] = {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                };
            });

            const newEdges: Edge[] = nodes.flatMap((node) =>
                node.neighbors.map((n) => ({
                    from: node.id,
                    to: n.to,
                    weight: n.weight,
                }))
            );

            setPositions(newPositions);
            setEdges(newEdges);
            setCanvasSize({ w: canvasW, h: canvasH });
        };

        // Первый просчёт и подписка на ресайз
        layout();
        const ro = new ResizeObserver(layout);
        ro.observe(el);
        return () => ro.disconnect();
    }, [nodes]);

    // Смещение конца линии к границе ноды, чтобы стрелка не пряталась под нодой
    function offsetPoint(x1: number, y1: number, x2: number, y2: number, r: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len === 0) return { x: x2, y: y2 };
        const ratio = (len - r) / len;
        return { x: x1 + dx * ratio, y: y1 + dy * ratio };
    }

    function makeNodeValue(node: GraphNode) {
        let value = String(node.value);
        if (distances.has(node.id)) {
            let d = String(distances.get(node.id));
            if (d === "Infinity") d = "Inf";
            value = `${value},${d}`;
        }
        return value;
    }

    return (
        // ВНЕШНИЙ КОНТЕЙНЕР: прокрутка, чтобы и SVG, и HTML-ноды прокручивались вместе
        <div ref={wrapperRef} className="relative w-full h-full flex-1 overflow-auto">
            {/* ВНУТРЕННИЙ ХОЛСТ фиксированного размера: в нём абсолюты и SVG совпадают по системе координат */}
            <div className="relative" style={{ width: `${canvasSize.w}px`, height: `${canvasSize.h}px` }}>
                {/* Рёбра (SVG) */}
                <svg className="absolute inset-0 pointer-events-none" width={canvasSize.w} height={canvasSize.h}>
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
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
                        </marker>
                    </defs>

                    {edges.map((line, i) => {
                        const x1 = positions[line.from]?.x ?? 0;
                        const y1 = positions[line.from]?.y ?? 0;
                        const x2 = positions[line.to]?.x ?? 0;
                        const y2 = positions[line.to]?.y ?? 0;

                        const { x: endX, y: endY } = offsetPoint(x1, y1, x2, y2, NODE_R);

                        const midX = (x1 + endX) / 2;
                        const midY = (y1 + endY) / 2;

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
                                {weighted && (
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
                                        <text x={midX} y={midY} fill="green" fontSize="18" textAnchor="middle" dy="2">
                                            {line.weight}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Ноды (HTML), те же координаты, что и у SVG */}
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
        </div>
    );
}

export default Graph;