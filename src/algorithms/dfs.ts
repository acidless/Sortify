import type { GraphNode } from "../types.ts";

export type DFSAction =
    | { type: "visit"; node: GraphNode }
    | { type: "push"; node: GraphNode }
    | { type: "pop"; node: GraphNode }
    | { type: "done" };

export function* dfs(root: GraphNode, nodes: GraphNode[]): Generator<DFSAction, void, unknown> {
    const visited = new Set<string>();
    const stack: GraphNode[] = [];

    stack.push(root);
    yield { type: "push", node: root };

    while (stack.length > 0) {
        const current = stack.pop()!;
        yield { type: "pop", node: current };

        if (!visited.has(current.id)) {
            visited.add(current.id);
            yield { type: "visit", node: current };

            const neighbors = [...current.neighbors].reverse();
            for (const neighborId of neighbors) {
                if (!visited.has(neighborId.to)) {
                    const neighbor = nodes.find(n => n.id === neighborId.to);
                    if (neighbor) {
                        stack.push(neighbor);
                        yield { type: "push", node: neighbor };
                    }
                }
            }
        }
    }

    yield { type: "done" };
}