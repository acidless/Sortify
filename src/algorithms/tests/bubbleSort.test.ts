import {bubbleSort} from "../bubbleSort.ts";
import {expectAction, runToEnd} from "./testUtils.ts";

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

        expect(result).toMatchInlineSnapshot(`
          {
            "array": [
              {
                "key": 4,
                "value": 1,
              },
              {
                "key": 2,
                "value": 2,
              },
              {
                "key": 3,
                "value": 3,
              },
              {
                "key": 1,
                "value": 4,
              },
            ],
            "type": "done",
          }
        `);
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