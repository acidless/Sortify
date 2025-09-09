import {generateRandomGraph} from "../graphUtils.ts";

describe("graphUtils", () => {
    it("should give a graph of exact length", () => {
        const graph = generateRandomGraph(12);
        expect(graph).toHaveLength(12);
    });

    it("graph shouldn't have edges", () => {
        const graph = generateRandomGraph(12, 0);
        expect(graph.every(node => node.neighbors.length === 0)).toBe(true);
    });

    it("should generate a complete graph", () => {
        const graph = generateRandomGraph(12, 1);
        expect(graph.every(node => node.neighbors.length === graph.length - 1)).toBe(true);
    });

    it("should generate a undirected graph", () => {
        const graph = generateRandomGraph(12, 0.8, false);

        for (const node of graph) {
            for (const neighbor of node.neighbors) {
                const targetNode = graph.find(n => n.id === neighbor.to);
                expect(targetNode).toBeDefined();
                const hasBackEdge = targetNode!.neighbors.some(n => n.to === node.id);
                expect(hasBackEdge).toBe(true);
            }
        }
    });

    it("ids should be unique", () => {
        const graph = generateRandomGraph(20);
        const ids = graph.map(node => node.id);
        expect(new Set(ids).size).toBe(graph.length);
    });
});