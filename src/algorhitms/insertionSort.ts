import type {SampleArray} from "../types.ts";

export type InsertionSortAction = { type: string, index?: number, checkingIndex?: number, array: SampleArray };

export function* insertionSort(array: SampleArray) {
    for (let i = 1; i < array.length; i++) {
        const keyItem = array[i];
        let j = i - 1;

        yield { type: 'key', index: i, array: array.slice() };

        yield { type: 'checking', checkingIndex: j, array: array.slice() };
        while (j >= 0 && array[j].value > keyItem.value) {
            j--;
            yield { type: 'checking', checkingIndex: j, array: array.slice() };
        }
        array.splice(i, 1);
        array.splice(j + 1, 0, keyItem);

        yield { type: 'insert', array: array.slice() };
    }

    yield { type: 'done', array: array.slice() };
}