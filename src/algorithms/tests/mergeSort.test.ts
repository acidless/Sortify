import {expectAction, runToEnd} from "./testUtils.ts";
import {mergeSort} from "../mergeSort.ts";

describe("mergeSort", () => {
    it("mergeSort sorts unsorted array", () => {
        const result = runToEnd(
            mergeSort([
                { key: 1, value: 4 },
                { key: 2, value: 2 },
                { key: 3, value: 3 },
                { key: 4, value: 1 },
            ])
        );

        expect(result).toMatchSnapshot();
    });

    it("yields correct sequence for 2 elements", () => {
        const gen = mergeSort([
            { key: 1, value: 3 },
            { key: 2, value: 1 },
        ]);

        const slice = expectAction(gen.next(), "slice");
        expect(slice.left).toEqual([{key: 1, value: 3}]);
        expect(slice.right).toEqual([{key: 2, value: 1}]);

        const compare = expectAction(gen.next(), "compare");
        expect(compare.indices).toEqual([0, 1]);

        const overwrite = expectAction(gen.next(), "overwrite");
        expect(overwrite.array).toMatchSnapshot();

        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 3]);

        expect(gen.next().done).toBe(true);
    });

    it("empty array", () => {
        const done = expectAction(mergeSort([]).next(), "done");
        expect(done.array).toEqual([]);
    });

    it("already sorted array", () => {
        const gen = mergeSort([
            { key: 1, value: 1 },
            { key: 2, value: 2 },
        ]);

        expectAction(gen.next(), "slice");
        expectAction(gen.next(), "compare");
        const done = expectAction(gen.next(), "done");
        expect(done.array.map(a => a.value)).toEqual([1, 2]);
        expect(gen.next().done).toBe(true);
    });
});