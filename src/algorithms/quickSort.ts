import type {SampleArray} from "../types.ts";

export type QuickSortAction =
    | { type: "partition", pivotIndex: number, left: SampleArray, right: SampleArray }
    | { type: "compare", indices: number[] }
    | { type: "swap", indices: number[], array: SampleArray }
    | { type: "done", array: SampleArray };

export function* quickSort(array: SampleArray): Generator<QuickSortAction, void, unknown> {
    const arr = structuredClone(array);

    function* partition(start: number, end: number): Generator<QuickSortAction, number, unknown> {
        const pivotIndex = end;
        const pivotValue = arr[pivotIndex].value;
        let i = start;

        yield {
            type: "partition",
            pivotIndex,
            left: structuredClone(arr.slice(start, pivotIndex)),
            right: []
        };

        for (let j = start; j < end; j++) {
            yield {type: "compare", indices: [j, pivotIndex]};

            if (arr[j].value < pivotValue) {
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    yield {type: "swap", indices: [i, j], array: structuredClone(arr)};
                }

                i++;
            }
        }

        if (i !== pivotIndex) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            yield {type: "swap", indices: [i, pivotIndex], array: structuredClone(arr)};
        }

        return i;
    }

    function* quickSortRecursive(start: number, end: number): Generator<QuickSortAction, void, unknown> {
        if (start >= end) return;

        const pivot = yield* partition(start, end);
        yield* quickSortRecursive(start, pivot - 1);
        yield* quickSortRecursive(pivot + 1, end);
    }

    yield* quickSortRecursive(0, arr.length - 1);

    yield {type: "done", array: arr};
}