import type {BSTNode} from "../types.ts";

export type BSTSearchAction =
    | { type: "compare"; node: BSTNode<number> }
    | { type: "go-left"; node: BSTNode<number> }
    | { type: "go-right"; node: BSTNode<number> }
    | { type: "found"; node: BSTNode<number> }
    | { type: "not-found"; node: BSTNode<number> | null };

export function* bstSearch(root: BSTNode<number> | null, value: number): Generator<BSTSearchAction, void, unknown> {
    let current = root;

    while (current !== null) {
        yield {type: "compare", node: current};

        if (value === current.value) {
            yield {type: "found", node: current};
            return;
        } else if (value < current.value) {
            yield {type: "go-left", node: current};
            current = current.left;
        } else {
            yield {type: "go-right", node: current};
            current = current.right;
        }
    }

    yield {type: "not-found", node: null};
}

