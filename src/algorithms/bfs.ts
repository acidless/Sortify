import type {GraphNode} from "../types.ts";

export type BFSAction =
    | { type: "visit"; node: GraphNode }
    | { type: "enqueue"; node: GraphNode }
    | { type: "done" };

export function* bfs(root: GraphNode, nodes: GraphNode[]): Generator<BFSAction, void, unknown> {
    const visited = new Set<string>();
    const queue: GraphNode[] = [];

    queue.push(root);
    visited.add(root.id);
    yield { type: "enqueue", node: root };

    while (queue.length > 0) {
        const current = queue.shift()!;
        yield { type: "visit", node: current };

        for (const neighborId of current.neighbors) {
            if (!visited.has(neighborId.to)) {
                const neighbor = nodes.find(n => n.id === neighborId.to);
                if (neighbor) {
                    queue.push(neighbor);
                    visited.add(neighborId.to);

                    yield { type: "enqueue", node: neighbor };
                }
            }
        }
    }

    yield { type: "done" };
}