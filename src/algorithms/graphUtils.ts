export type GraphNode = {
    id: string;
    value: any;
    neighbors: string[];
};

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
                nodes[i].neighbors.push(nodes[j].id);
                nodes[j].neighbors.push(nodes[i].id);
            }
        }
    }

    return nodes;
}
