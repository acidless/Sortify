import {describe, it, expect} from "vitest";
import {dijkstra} from "../dijkstra";
import {expectAction} from "./testUtils";
import type {GraphNode} from "../../types.ts";

function makeNode(id: string, neighbors: { to: string; weight: number }[] = []): GraphNode<number> {
    return {id, neighbors, value: 0};
}

describe("dijkstra", () => {
    it("should visit start node first and finish", () => {
        const a = makeNode("A");
        const nodes = [a];
        const gen = dijkstra(a, nodes);

        const visit = expectAction(gen.next(), "visit");
        expect(visit.node).toBe(a);
        expect(visit.distance).toBe(0);

        expectAction(gen.next(), "done");
        expect(gen.next().done).toBe(true);
    });

    it("should relax edges and update distances", () => {
        const a = makeNode("A", [{to: "B", weight: 5}]);
        const b = makeNode("B");
        const nodes = [a, b];

        const gen = dijkstra(a, nodes);

        const visit = expectAction(gen.next(), "visit");
        expect(visit.node).toBe(a);

        const relax = expectAction(gen.next(), "relax");
        expect(relax.from).toBe(a);
        expect(relax.to).toBe(b);
        expect(relax.oldDist).toBe(Infinity);
        expect(relax.newDist).toBe(5);

        const update = expectAction(gen.next(), "update");
        expect(update.node).toBe(b);
        expect(update.distance).toBe(5);

        const visitB = expectAction(gen.next(), "visit");
        expect(visitB.node).toBe(b);
        expect(visitB.distance).toBe(5);

        expectAction(gen.next(), "done");
    });

    it("should handle more complex graph", () => {
        const a = makeNode("A", [{to: "B", weight: 1}, {to: "C", weight: 4}]);
        const b = makeNode("B", [{to: "C", weight: 2}]);
        const c = makeNode("C");
        const nodes = [a, b, c];

        const gen = dijkstra(a, nodes);

        const visitA = expectAction(gen.next(), "visit");
        expect(visitA.node.id).toBe("A");

        const relaxAB = expectAction(gen.next(), "relax");
        expect(relaxAB.from.id).toBe("A");
        expect(relaxAB.to.id).toBe("B");

        const updateB = expectAction(gen.next(), "update");
        expect(updateB.node.id).toBe("B");

        const relaxAC = expectAction(gen.next(), "relax");
        expect(relaxAC.from.id).toBe("A");
        expect(relaxAC.to.id).toBe("C");

        const updateC = expectAction(gen.next(), "update");
        expect(updateC.node.id).toBe("C");

        const visitB = expectAction(gen.next(), "visit");
        expect(visitB.node.id).toBe("B");

        const relaxBC = expectAction(gen.next(), "relax");
        expect(relaxBC.from.id).toBe("B");
        expect(relaxBC.to.id).toBe("C");

        const updateC2 = expectAction(gen.next(), "update");
        expect(updateC2.node.id).toBe("C");

        const visitC = expectAction(gen.next(), "visit");
        expect(visitC.node.id).toBe("C");

        expectAction(gen.next(), "done");
    });

    it("should handle isolated node", () => {
        const a = makeNode("A");
        const b = makeNode("B");
        const nodes = [a, b];

        const gen = dijkstra(a, nodes);

        const visitA = expectAction(gen.next(), "visit");
        expect(visitA.node.id).toBe("A");

        expectAction(gen.next(), "done");
    });
});