import type {SampleArray} from "../types.ts";

export type InsertionSortAction = { type: 'key', index: number }
    | { type: 'checking', checkingIndex: number }
    | { type: 'insert', array: SampleArray }
    | { type: 'done', array: SampleArray };

export function* insertionSort(array: SampleArray): Generator<InsertionSortAction, void, unknown> {
    for (let i = 1; i < array.length; i++) {
        const keyItem = array[i];
        let j = i - 1;

        yield { type: 'key', index: i };

        yield { type: 'checking', checkingIndex: j };
        while (j >= 0 && array[j].value > keyItem.value) {
            j--;
            yield { type: 'checking', checkingIndex: j };
        }
        array.splice(i, 1);
        array.splice(j + 1, 0, keyItem);

        yield { type: 'insert', array: array.slice() };
    }

    yield { type: 'done', array: array.slice() };
}