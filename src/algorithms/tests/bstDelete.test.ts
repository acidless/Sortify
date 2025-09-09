import {describe, it, expect} from "vitest";
import {bstDelete} from "../bstDelete";
import {expectAction, node} from "./testUtils";

describe("bstDelete", () => {
    it("should handle deleting from empty tree", () => {
        const gen = bstDelete(null, 10);
        const notFound = expectAction(gen.next(), "not-found");
        expect(notFound.node).toBeNull();

        const found = expectAction(gen.next(), "found");
        expect(found.node).toBeNull();
    });

    it("should delete a leaf node", () => {
        const root = node(10, node(5), node(15));
        const gen = bstDelete(root, 5);

        expectAction(gen.next(), "compare");
        expectAction(gen.next(), "go-left");
        expectAction(gen.next(), "compare");
        const delLeaf = expectAction(gen.next(), "delete-leaf");
        expect(delLeaf.node.value).toBe(5);

        const found = expectAction(gen.next(), "found");
        expect(found.node!.left).toBeNull();
        expect(gen.next().done).toBe(true);
    });

    it("should delete a node with single child", () => {
        const root = node(10, node(5, null, node(6)), node(15));
        const gen = bstDelete(root, 5);

        expectAction(gen.next(), "compare");
        expectAction(gen.next(), "go-left");
        expectAction(gen.next(), "compare");
        const delSingle = expectAction(gen.next(), "delete-single-child");
        expect(delSingle.node.value).toBe(5);

        const found = expectAction(gen.next(), "found");
        expect(found.node!.left!.value).toBe(6);
    });

    it("should delete a node with two children", () => {
        const root = node(
            10,
            node(5),
            node(15, node(12), node(20))
        );
        const gen = bstDelete(root, 15);

        expectAction(gen.next(), "compare");
        expectAction(gen.next(), "go-right");
        expectAction(gen.next(), "compare");
        const replace = expectAction(gen.next(), "replace-with-successor");
        expect(replace.node.value).toBe(15);
        expect(replace.successor.value).toBe(20);

        expectAction(gen.next(), "delete-leaf");

        const found = expectAction(gen.next(), "found");
        expect(found.node!.right!.value).toBe(20);
        expect(found.node!.right!.left!.value).toBe(12);
    });

    it("should delete root node", () => {
        const root = node(10, node(5), node(15));
        const gen = bstDelete(root, 10);

        expectAction(gen.next(), "compare");
        const replace = expectAction(gen.next(), "replace-with-successor");
        expect(replace.node.value).toBe(10);
        expect(replace.successor.value).toBe(15);

        const delLeaf = expectAction(gen.next(), "delete-leaf");
        expect(delLeaf.node.value).toBe(15);

        const found = expectAction(gen.next(), "found");
        expect(found.node!.value).toBe(15);
    });

    it("should handle not found node", () => {
        const root = node(10);
        const gen = bstDelete(root, 99);

        expectAction(gen.next(), "compare");
        expectAction(gen.next(), "go-right");
        const notFound = expectAction(gen.next(), "not-found");
        expect(notFound.node).toBeNull();

        const found = expectAction(gen.next(), "found");
        expect(found.node!.value).toBe(10);
    });

    it("should delete node with two children where successor has right child (successorParent === node)", () => {
        const root = node(10, node(5), node(15, null, node(20)));
        const gen = bstDelete(root, 10);

        expectAction(gen.next(), "compare");
        const replace = expectAction(gen.next(), "replace-with-successor");
        expect(replace.node.value).toBe(10);
        expect(replace.successor.value).toBe(15);

        const delSingle = expectAction(gen.next(), "delete-single-child");
        expect(delSingle.node.value).toBe(15);

        const found = expectAction(gen.next(), "found");
        expect(found.node!.value).toBe(15);
        expect(found.node!.right!.value).toBe(20);
    });

    it("should delete node with two children where successor has right child (successorParent ≠ node)", () => {
        const root = node(
            10,
            node(5),
            node(20, node(15, null, node(17)))
        );
        const gen = bstDelete(root, 10);

        expectAction(gen.next(), "compare");
        const replace = expectAction(gen.next(), "replace-with-successor");
        expect(replace.node.value).toBe(10);
        expect(replace.successor.value).toBe(15);

        const delSingle = expectAction(gen.next(), "delete-single-child");
        expect(delSingle.node.value).toBe(15);

        const found = expectAction(gen.next(), "found");
        expect(found.node!.value).toBe(15);
        expect(found.node!.right!.value).toBe(20);
        expect(found.node!.right!.left!.value).toBe(17);
    });

    it("should delete node where successor has no right child (successorParent ≠ node)", () => {
        const root = node(
            10,
            node(5),
            node(20, node(15))
        );
        const gen = bstDelete(root, 10);

        expectAction(gen.next(), "compare");
        const replace = expectAction(gen.next(), "replace-with-successor");
        expect(replace.node.value).toBe(10);
        expect(replace.successor.value).toBe(15);

        const delLeaf = expectAction(gen.next(), "delete-leaf");
        expect(delLeaf.node.value).toBe(15);

        const found = expectAction(gen.next(), "found");
        expect(found.node!.value).toBe(15);
        expect(found.node!.right!.value).toBe(20);
        expect(found.node!.right!.left).toBeNull();
    });
});