import type {BSTNode} from "../types.ts";

export type BSTInsertAction =
    | { type: "compare"; node: BSTNode }
    | { type: "exists"; node: BSTNode }
    | { type: "go-left"; node: BSTNode }
    | { type: "go-right"; node: BSTNode }
    | { type: "inserted"; node: BSTNode | null };

export function* bstInsert(root: BSTNode | null, value: number): Generator<BSTInsertAction, void, unknown> {
    let current = root;
    const node = {value, id: crypto.randomUUID(), left: null, right: null};

    while (current !== null) {
        yield {type: "compare", node: current};

        if (value === current.value) {
            yield {type: "exists", node: current};
            return;
        } else if (value < current.value) {
            yield {type: "go-left", node: current};

            if (!current.left) {
                current.left = node;

                break;
            }

            current = current.left;
        } else {
            yield {type: "go-right", node: current};

            if (!current.right) {
                current.right = node;
                break;
            }

            current = current.right;
        }
    }

    yield {type: "inserted", node};
}