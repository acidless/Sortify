import type {SampleArray} from "../types.ts";

export type MergeSortAction =
    | { type: "slice", left: SampleArray, right: SampleArray }
    | { type: "compare", indices: number[] }
    | { type: "overwrite", index: number, array: SampleArray }
    | { type: "done", array: SampleArray };

export function* mergeSort(array: SampleArray): Generator<MergeSortAction, void, unknown> {
    const arr = structuredClone(array);

    function* merge(start: number, mid: number, end: number): Generator<MergeSortAction, void, unknown> {
        let i = start;
        let j = mid;

        yield {
            type: "slice",
            left: structuredClone(arr.slice(start, mid)),
            right: structuredClone(arr.slice(mid, end)),
        };

        while (i < j && j < end) {
            yield {
                type: "compare",
                indices: [i, j],
            };

            if (arr[i].value <= arr[j].value) {
                i++;
            } else {
                const moved = arr.splice(j, 1)[0];
                arr.splice(i, 0, moved);

                yield {
                    type: "overwrite",
                    index: i,
                    array: structuredClone(arr),
                };

                i++;
                j++;
            }
        }
    }

    function* mergeSortRecursive(start: number, end: number): Generator<MergeSortAction, void, unknown> {
        if (end - start <= 1) return;

        const mid = Math.floor((start + end) / 2);

        yield* mergeSortRecursive(start, mid);
        yield* mergeSortRecursive(mid, end);
        yield* merge(start, mid, end);
    }

    yield* mergeSortRecursive(0, arr.length);

    yield {
        type: "done",
        array: arr
    };
}