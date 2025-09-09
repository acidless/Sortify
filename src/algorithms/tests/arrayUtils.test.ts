import {generateRandomArray} from "../arrayUtils.ts";

describe("arrayUtils", () => {
   it("should give array of exact length", () => {
       const array = generateRandomArray(12, 0, 100);
       expect(array).toHaveLength(12);
   });

    it("numbers should be in range", () => {
        const array = generateRandomArray(12, -15, 20);
        expect(array.every(elem => elem.value >= -15 && elem.value <= 20)).toBe(true);
    });

    it("should return empty array when length is 0", () => {
        const array = generateRandomArray(0, 0, 10);
        expect(array).toEqual([]);
    });

    it("should return array with identical values if min = max", () => {
        const array = generateRandomArray(5, 7, 7);
        expect(array).toHaveLength(5);
        expect(array.every(el => el.value === 7)).toBe(true);
    });

    it("keys should be unique", () => {
        const array = generateRandomArray(20, 0, 100);
        const keys = array.map(el => el.key);
        expect(new Set(keys).size).toBe(array.length);
    });
});