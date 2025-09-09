import type { BSTNode } from "../../types.ts";
import {bstSearch, type BSTSearchAction} from "../bstSearch.ts";
import { node } from "./testUtils.ts";

describe("bstSearch", () => {
    const tree: BSTNode<number> = node(
        10,
        node(5, node(2), node(7)),
        node(15, null, node(20))
    );

    it("should find the root node", () => {
        const gen = bstSearch(tree, 10);

        let step = gen.next();
        expect(step.value).toEqual({ type: "compare", node: tree });

        step = gen.next();
        expect(step.value).toEqual({ type: "found", node: tree });

        step = gen.next();
        expect(step.done).toBe(true);
    });

    it("should search to the left and find a node", () => {
        const gen = bstSearch(tree, 2);

        let step = gen.next();
        expect(step.value?.type).toBe("compare");

        step = gen.next();
        expect(step.value).toEqual({ type: "go-left", node: tree });

        step = gen.next();
        expect(step.value?.type).toBe("compare");

        step = gen.next();
        expect(step.value).toEqual({ type: "go-left", node: tree.left! });

        step = gen.next();
        expect(step.value).toEqual({ type: "compare", node: tree.left!.left! });

        step = gen.next();
        expect(step.value).toEqual({ type: "found", node: tree.left!.left! });

        step = gen.next();
        expect(step.done).toBe(true);
    });

    it("should search to the right and find a node", () => {
        const gen = bstSearch(tree, 20);

        let step = gen.next();
        expect(step.value?.type).toBe("compare");

        step = gen.next();
        expect(step.value).toEqual({ type: "go-right", node: tree });

        step = gen.next();
        expect(step.value?.type).toBe("compare");

        step = gen.next();
        expect(step.value).toEqual({ type: "go-right", node: tree.right! });

        step = gen.next();
        expect(step.value).toEqual({ type: "compare", node: tree.right!.right! });

        step = gen.next();
        expect(step.value).toEqual({ type: "found", node: tree.right!.right! });

        step = gen.next();
        expect(step.done).toBe(true);
    });

    it("should return not found if value is missing", () => {
        const gen = bstSearch(tree, 99);

        let step: IteratorResult<BSTSearchAction, void>;
        do {
            step = gen.next();
            if (!step.done && step.value.type === "not-found") {
                expect(step.value).toEqual({ type: "not-found", node: null });
            }
        } while (!step.done);
    });

    it("should return not found if tree is empty", () => {
        const gen = bstSearch(null, 42);

        const step = gen.next();
        expect(step.value).toEqual({ type: "not-found", node: null });
        expect(gen.next().done).toBe(true);
    });
});