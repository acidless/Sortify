import { bstInsert } from "../bstInsert.ts";
import {node} from "./testUtils.ts";
import {expect} from "vitest";

vi.stubGlobal("crypto", {
    randomUUID: () => "mock-id"
});

describe("bstInsert", () => {
    it("should insert into empty tree", () => {
        const gen = bstInsert(null, 10);

        const step = gen.next();
        expect(step.value).toEqual({
            type: "inserted",
            node: { value: 10, id: "mock-id", left: null, right: null }
        });

        expect(gen.next().done).toBe(true);
    });

    it("should insert to the left of root", () => {
        const root = node(10);
        const gen = bstInsert(root, 5);

        expect(gen.next().value).toEqual({ type: "compare", node: root });
        expect(gen.next().value).toEqual({ type: "go-left", node: root });
        expect(gen.next().value).toEqual({
            type: "inserted",
            node: { value: 5, id: "mock-id", left: null, right: null }
        });

        expect(root.left?.value).toBe(5);
    });

    it("should insert to the right of root", () => {
        const root = node(10);
        const gen = bstInsert(root, 15);

        expect(gen.next().value).toEqual({ type: "compare", node: root });
        expect(gen.next().value).toEqual({ type: "go-right", node: root });
        expect(gen.next().value).toEqual({
            type: "inserted",
            node: { value: 15, id: "mock-id", left: null, right: null }
        });

        expect(root.right?.value).toBe(15);
    });

    it("should detect existing value", () => {
        const root = node(10);
        const gen = bstInsert(root, 10);

        expect(gen.next().value).toEqual({ type: "compare", node: root });
        expect(gen.next().value).toEqual({ type: "exists", node: root });
        expect(gen.next().done).toBe(true);
    });

    it("should go multiple levels before inserting", () => {
        const root = node(10);
        root.left = node(5);

        const gen = bstInsert(root, 3);

        expect(gen.next().value).toEqual({ type: "compare", node: root });
        expect(gen.next().value).toEqual({ type: "go-left", node: root });
        expect(gen.next().value).toEqual({ type: "compare", node: root.left });
        expect(gen.next().value).toEqual({ type: "go-left", node: root.left! });
        expect(gen.next().value).toEqual({
            type: "inserted",
            node: { value: 3, id: "mock-id", left: null, right: null }
        });

        expect(root.left?.left?.value).toBe(3);
    });

    it("should insert into right subtree", () => {
        const root = node(10);
        root.right = node(15);
        const gen = bstInsert(root, 20);

        expect(gen.next().value).toEqual({ type: "compare", node: root });
        expect(gen.next().value).toEqual({ type: "go-right", node: root });

        expect(gen.next().value).toEqual({ type: "compare", node: root.right });
        expect(gen.next().value).toEqual({ type: "go-right", node: root.right! });

        expect(gen.next().value).toEqual({
            type: "inserted",
            node: { value: 20, id: "mock-id", left: null, right: null }
        });

        expect(root.right?.right?.value).toBe(20);
    });
});