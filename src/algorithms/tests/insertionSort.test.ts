import {expectAction, runToEnd} from "./testUtils.ts";
import {insertionSort} from "../insertionSort.ts";

describe("insertionSort", () => {
    it("insertionSort sorts unsorted array", () => {
        const result = runToEnd(
            insertionSort([
                { key: 1, value: 4 },
                { key: 2, value: 2 },
                { key: 3, value: 3 },
                { key: 4, value: 1 },
            ])
        );

        expect(result).toMatchSnapshot();
    });

    it("yields correct sequence for 2 elements", () => {
        const gen = insertionSort([
            { key: 1, value: 3 },
            { key: 2, value: 1 },
        ]);

        expectAction(gen.next(), "key");
        expectAction(gen.next(), "checking");
        expectAction(gen.next(), "checking");
        const swap = expectAction(gen.next(), "insert");
        expect(swap.array).toMatchSnapshot();
        expect(swap.array.map(a => a.value)).toEqual([1, 3]);

        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 3]);

        expect(gen.next().done).toBe(true);
    });

    it("empty array", () => {
        const done = expectAction(insertionSort([]).next(), "done");
        expect(done.array).toEqual([]);
    });

    it("already sorted array", () => {
        const gen = insertionSort([
            { key: 1, value: 1 },
            { key: 2, value: 2 },
        ]);

        expectAction(gen.next(), "key");
        expectAction(gen.next(), "checking");
        expectAction(gen.next(), "insert");
        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 2]);
        expect(gen.next().done).toBe(true);
    });
});