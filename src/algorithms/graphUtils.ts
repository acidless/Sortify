import type {GraphNode} from "../types.ts";

export function generateRandomGraph(nodeCount: number,edgeProbability: number = 0.3): GraphNode[] {
    const nodes: GraphNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: String(i),
            value: Math.floor(Math.random() * 100),
            neighbors: [],
        });
    }

    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            if (Math.random() < edgeProbability) {
                const weight = Math.floor(Math.random() * 100);

                nodes[i].neighbors.push({ to: nodes[j].id, weight });
                nodes[j].neighbors.push({ to: nodes[i].id, weight });
            }
        }
    }

    return nodes;
}
