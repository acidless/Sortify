import type {BSTNode} from "../../types.ts";

export function expectAction<
    A extends { type: string },
    T extends A["type"]>(step: IteratorResult<A, void>, type: T): Extract<A, { type: T }> {
    expect(step.done).toBe(false);
    expect(step.value?.type).toBe(type);
    return step.value as Extract<A, { type: T }>;
}

export function runToEnd<A>(gen: Generator<A, void, unknown>) {
    let last: A | undefined;
    for (let step = gen.next(); !step.done; step = gen.next()) {
        last = step.value;
    }
    return last;
}

export function node(value: number, left: BSTNode<number> | null = null, right: BSTNode<number> | null = null): BSTNode<number> {
    return {id: `node-${value}`, value, left, right};
}