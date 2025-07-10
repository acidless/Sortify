import type {SampleArray} from "../types.ts";

export type BubbleSortAction = { type: string, indices?: number[], array: SampleArray };


export function* bubbleSort(array: SampleArray) {
    for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < array.length - i - 1; j++) {
            yield {type: 'compare', indices: [j, j + 1], array: array.slice()};
            if(array[j].value > array[j + 1].value) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                yield {type: 'swap', indices: [j, j + 1], array: array.slice()};
            }
        }
    }

    yield {type: 'done', array: array.slice()};
}