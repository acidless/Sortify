import type {GraphNode} from "../types.ts";

export type DijkstraAction =
    | { type: "visit"; node: GraphNode<number>; distance: number }
    | { type: "relax"; from: GraphNode<number>; to: GraphNode<number>; oldDist: number; newDist: number }
    | { type: "update"; node: GraphNode<number>; distance: number }
    | { type: "done" };

export function* dijkstra(start: GraphNode<number>, nodes: GraphNode<number>[]): Generator<DijkstraAction, void, unknown> {
    const dist = new Map<string, number>();
    const visited = new Set<string>();

    for (const node of nodes) {
        dist.set(node.id, Infinity);
    }
    dist.set(start.id, 0);

    while (visited.size < nodes.length) {
        let u: GraphNode<number> | undefined;
        let minDist = Infinity;
        for (const node of nodes) {
            if (!visited.has(node.id) && dist.get(node.id)! < minDist) {
                minDist = dist.get(node.id)!;
                u = node;
            }
        }
        if (!u) break;

        visited.add(u.id);
        yield {type: "visit", node: u, distance: minDist};

        for (const edge of u.neighbors) {
            const v = nodes.find(n => n.id === edge.to);
            if (!v) continue;

            const alt = dist.get(u.id)! + edge.weight;
            const old = dist.get(v.id)!;

            yield {type: "relax", from: u, to: v, oldDist: old, newDist: alt};

            if (alt < old) {
                dist.set(v.id, alt);
                yield {type: "update", node: v, distance: alt};
            }
        }
    }

    yield {type: "done"};
}