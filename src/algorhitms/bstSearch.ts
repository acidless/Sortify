import type {BSTNode} from "../types.ts";

export type BSTSearchAction =
    | { type: "compare"; node: BSTNode }
    | { type: "go-left"; node: BSTNode }
    | { type: "go-right"; node: BSTNode }
    | { type: "found"; node: BSTNode }
    | { type: "not-found"; node: BSTNode | null };

export function* bstSearch(root: BSTNode | null, value: number): Generator<BSTSearchAction, void, unknown> {
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

