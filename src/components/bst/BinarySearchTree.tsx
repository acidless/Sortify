import type {BSTNode as NodeType, PositionedNode} from "../../types.ts";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import BSTNode from "./BSTNode.tsx";

type Props = {
    root: NodeType<number> | null;
    nodeStateFunc: (id: string) => string;
    size: number;
};

const BinarySearchTree = ({ root, nodeStateFunc, size }: Props) =>  {
    const [nodes, setNodes] = useState<PositionedNode<number>[]>([]);
    const [lines, setLines] = useState<Array<{ from: string; to: string }>>([]);
    const [absoluteLines, setAbsoluteLines] = useState<
        Array<{ x1: number; y1: number; x2: number; y2: number }>
    >([]);

    const svgWrapperRef = useRef<HTMLDivElement | null>(null);
    const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        window.addEventListener("resize", updateBST);
        updateBST();
        return () => window.removeEventListener("resize", updateBST);
    }, [root, size]);


    function updateBST() {
        const positions: PositionedNode<number>[] = [];
        const edges: Array<{ from: string; to: string }> = [];
        let mostDeepPosY = 0;

        function traverse(node: NodeType<number> | null, x: number, y: number, depth: number, baseSpacing: number) {
            if (!node) return;

            if (y > mostDeepPosY) {
                mostDeepPosY = y;
            }

            positions.push({ ...node, x, y });

            if (node.left) {
                edges.push({ from: node.id, to: node.left.id });
                traverse(node.left, x - baseSpacing / (depth + 1), y + 100, depth + 1, baseSpacing);
            }

            if (node.right) {
                edges.push({ from: node.id, to: node.right.id });
                traverse(node.right, x + baseSpacing / (depth + 1), y + 100, depth + 1, baseSpacing);
            }
        }


        const width = svgWrapperRef.current!.clientWidth;
        const baseSpacing = Math.min(300, width / 2);
        traverse(root, width / 2, 75, 1, baseSpacing);
        svgWrapperRef.current!.style.height = `${mostDeepPosY + 150}px`;

        setNodes(positions);
        setLines(edges);
    }

    useLayoutEffect(() => {
        if (!nodes.length) return;

        const containerRect = svgWrapperRef.current?.getBoundingClientRect();
        if(!containerRect) return;

        const newLines = lines.map(({ from, to }) => {
            const fromEl = nodeRefs.current[from];
            const toEl = nodeRefs.current[to];

            if (!fromEl || !toEl) return null;

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            return {
                x1: fromRect.left + fromRect.width / 2 - containerRect.left,
                y1: fromRect.top + fromRect.height / 2 - containerRect.top,
                x2: toRect.left + toRect.width / 2 - containerRect.left,
                y2: toRect.top + toRect.height / 2 - containerRect.top,
            };
        }).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number }[];

        setAbsoluteLines(newLines);
    }, [nodes]);

    return (
        <div ref={svgWrapperRef} className="relative w-full h-full overflow-x-auto tree-container">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {absoluteLines.map((line, i) => (
                    <line
                        key={i}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}
            </svg>

            {nodes.map((node) => (
                <BSTNode
                    key={node.id}
                    id={node.id}
                    node={node.value.toString()}
                    x={node.x}
                    y={node.y}
                    stateFunc={nodeStateFunc}
                    ref={(el) => {
                        nodeRefs.current[node.id] = el
                    }}
                />
            ))}
        </div>
    );
}

export default BinarySearchTree;