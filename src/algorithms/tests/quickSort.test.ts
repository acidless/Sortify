import {expectAction, runToEnd} from "./testUtils.ts";
import {quickSort} from "../quickSort.ts";

describe("quickSort", () => {
    it("quickSort sorts unsorted array", () => {
        const result = runToEnd(
            quickSort([
                { key: 1, value: 5 },
                { key: 2, value: 3 },
                { key: 3, value: 4 },
                { key: 4, value: 1 },
                { key: 5, value: 2 },
            ])
        );

        expect(result).toMatchSnapshot();
    });

    it("yields correct sequence for 2 elements", () => {
        const gen = quickSort([
            { key: 1, value: 3 },
            { key: 2, value: 1 },
        ]);

        const slice = expectAction(gen.next(), "partition");
        expect(slice.pivotIndex).toEqual(1);
        expect(slice.left).toEqual([{key: 1, value: 3}]);

        const compare = expectAction(gen.next(), "compare");
        expect(compare.indices).toEqual([0, 1]);

        const swap = expectAction(gen.next(), "swap");
        expect(swap.array).toMatchSnapshot();

        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 3]);

        expect(gen.next().done).toBe(true);
    });

    it("empty array", () => {
        const done = expectAction(quickSort([]).next(), "done");
        expect(done.array).toEqual([]);
    });

    it("already sorted array", () => {
        const gen = quickSort([
            { key: 1, value: 1 },
            { key: 2, value: 2 },
        ]);

        expectAction(gen.next(), "partition");
        expectAction(gen.next(), "compare");
        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 2]);
        expect(gen.next().done).toBe(true);
    });
});