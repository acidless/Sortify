import type {BSTNode} from "../types.ts";

export type BSTDeleteAction =
    | { type: "compare"; node: BSTNode<number> }
    | { type: "not-found"; node: BSTNode<number> | null }
    | { type: "go-left"; node: BSTNode<number> }
    | { type: "go-right"; node: BSTNode<number> }
    | { type: "delete-leaf"; node: BSTNode<number> }
    | { type: "delete-single-child"; node: BSTNode<number> }
    | { type: "replace-with-successor"; node: BSTNode<number>; successor: BSTNode<number> }
    | { type: "found"; node: BSTNode<number> | null };

export function* bstDelete(root: BSTNode<number> | null, value: number): Generator<BSTDeleteAction, void, unknown> {
    function* deleteRec(node: BSTNode<number> | null): Generator<BSTDeleteAction, BSTNode<number> | null, unknown> {
        if (!node) {
            yield {type: "not-found", node: null};
            return null;
        }

        yield {type: "compare", node};

        if (value < node.value) {
            yield {type: "go-left", node};
            node.left = yield* deleteRec(node.left);
        } else if (value > node.value) {
            yield {type: "go-right", node};
            node.right = yield* deleteRec(node.right);
        } else {
            if (!node.left && !node.right) {
                yield {type: "delete-leaf", node};
                return null;
            }
            if (!node.left || !node.right) {
                yield {type: "delete-single-child", node};
                return node.left ?? node.right;
            }

            let successorParent = node;
            let successor = node.right!;
            while (successor.left) {
                successorParent = successor;
                successor = successor.left!;
            }

            yield {type: "replace-with-successor", node, successor};

            node.value = successor.value;
            node.id = successor.id;

            if (successorParent === node) {
                if (!successor.right) {
                    yield {type: "delete-leaf", node: successor};
                    node.right = null;
                } else {
                    yield {type: "delete-single-child", node: successor};
                    node.right = successor.right;
                }
            } else {
                if (!successor.right) {
                    yield {type: "delete-leaf", node: successor};
                    successorParent.left = null;
                } else {
                    yield {type: "delete-single-child", node: successor};
                    successorParent.left = successor.right;
                }
            }
        }

        return node;
    }

    const newRoot = yield* deleteRec(root);
    yield {type: "found", node: newRoot};
}