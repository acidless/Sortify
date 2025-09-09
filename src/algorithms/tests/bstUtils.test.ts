import {describe} from "vitest";
import {bstBfs, generateRandomBST} from "../bstUtils.ts";

describe("bstUtils", () => {
    describe("bstBfs", () => {
        it("should return empty array on root null input", () => {
            expect(bstBfs(null)).toEqual([]);
        });
    });

    describe("generateRandomBST", () => {
        it("should contain exact amount of nodes", () => {
            const root = generateRandomBST(12);
            expect(bstBfs(root).length).toEqual(12);
        });

        it("should contain values only from given range", () => {
            const root = generateRandomBST(6, -10, 10);
            expect(bstBfs(root).every(node => node.value >= -10 && node.value <= 10)).toEqual(true);
        });
    });
});