import type {SampleArray} from "../types.ts";

export function generateRandomArray(elementCount: number, min: number, max: number): SampleArray {
    const array: SampleArray = [];

    for (let i = 0; i < elementCount; i++) {
        array.push({value: Math.floor(Math.random() * (max - min + 1) + min), key: i});
    }

    return array;
}