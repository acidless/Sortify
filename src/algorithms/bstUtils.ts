import type {BSTNode} from "../types.ts";

function insertNode(root: BSTNode<number> | null, value: number): BSTNode<number> {
    if (root === null) {
        return {value, left: null, right: null, id: crypto.randomUUID()};
    }
    if (value < root.value) {
        root.left = insertNode(root.left, value);
    } else if (value > root.value) {
        root.right = insertNode(root.right, value);
    }

    return root;
}

export function generateRandomBST(size: number, min = 0, max = 100): BSTNode<number> | null {
    let root: BSTNode<number> | null = null;
    const values = new Set<number>();
    while (values.size < size) {
        const val = Math.floor(Math.random() * (max - min + 1)) + min;
        values.add(val);
    }

    for (const value of values) {
        root = insertNode(root, value);
    }

    return root;
}

export function bstBfs(root: BSTNode<number> | null): BSTNode<number>[] {
    const queue = [root];
    const result = []

    while (queue.length > 0) {
        const node = queue.shift();
        if (!node) {
            break;
        }

        result.push(node);
        if (node.left !== null) {
            queue.push(node.left);
        }

        if (node.right !== null) {
            queue.push(node.right);
        }
    }

    return result;
}