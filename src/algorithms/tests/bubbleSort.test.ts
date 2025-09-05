import {describe, expect, it} from 'vitest'
import {bubbleSort, type BubbleSortAction} from "../bubbleSort.ts";

function expectAction<T extends BubbleSortAction["type"]>(
    step: IteratorResult<BubbleSortAction, void>,
    type: T
): Extract<BubbleSortAction, { type: T }> {
    expect(step.done).toBe(false);
    expect(step.value?.type).toBe(type);
    return step.value as Extract<BubbleSortAction, { type: T }>;
}

function runToEnd(gen: Generator<BubbleSortAction, void, unknown>) {
    let last: BubbleSortAction | undefined;
    for (let step = gen.next(); !step.done; step = gen.next()) {
        last = step.value;
    }
    return last;
}

describe("bubbleSort", () => {
    it("bubbleSort sorts unsorted array", () => {
        const result = runToEnd(
            bubbleSort([
                { key: 1, value: 4 },
                { key: 2, value: 2 },
                { key: 3, value: 3 },
                { key: 4, value: 1 },
            ])
        );

        expect(result).toMatchSnapshot();
    });

    it("yields correct sequence for 2 elements", () => {
        const gen = bubbleSort([
            { key: 1, value: 3 },
            { key: 2, value: 1 },
        ]);

        expectAction(gen.next(), "compare");
        const swap = expectAction(gen.next(), "swap");
        expect(swap.indices).toEqual([0, 1]);
        expect(swap.array.map(a => a.value)).toEqual([1, 3]);

        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 3]);

        expect(gen.next().done).toBe(true);
    });

    it("empty array", () => {
        const done = expectAction(bubbleSort([]).next(), "done");
        expect(done.array).toEqual([]);
    });

    it("already sorted array", () => {
        const gen = bubbleSort([
            { key: 1, value: 1 },
            { key: 2, value: 2 },
        ]);

        expectAction(gen.next(), "compare");
        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 2]);
        expect(gen.next().done).toBe(true);
    });
});