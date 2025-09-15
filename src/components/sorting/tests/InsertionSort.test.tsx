import {act, render, screen, waitFor} from "@testing-library/react";
import { vi, expect } from "vitest";
import { lastProps } from "./Base.tsx";
import { TheoryContext } from "../../../TheoryContext";
import InsertionSort from "../InsertionSort";

describe("InsertionSort component", () => {
    it("should call setTheory and render tabs", () => {
        const setTheory = vi.fn();
        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <InsertionSort />
            </TheoryContext.Provider>
        );

        expect(setTheory).toHaveBeenCalled();
        const element = setTheory.mock.calls[0][0];
        expect(element.type.name).toBe("InsertionSortText");

        const data = render(element);
        expect(data.getByText("Теория")).toBeInTheDocument();
        expect(data.getByText("Сложность")).toBeInTheDocument();
        expect(data.getByText("Шаги")).toBeInTheDocument();
    });

    it("makeSnapshot returns current pivotIndex and checkingIndex", () => {
        const setTheory = vi.fn();

        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <InsertionSort />
            </TheoryContext.Provider>
        );

        expect(lastProps).toBeDefined();

        expect(lastProps.makeSnapshot()).toEqual({ pivotIndex: undefined, checkingIndex: undefined });

        act(() => {
            lastProps.setAlgorithmState({ type: "key", index: 0 });
        });
        expect(lastProps.makeSnapshot()).toEqual({ pivotIndex: 0, checkingIndex: undefined });

        act(() => {
            lastProps.setAlgorithmState({ type: "checking", checkingIndex: 1 });
        });
        expect(lastProps.makeSnapshot()).toEqual({ pivotIndex: 0, checkingIndex: 1 });

        act(() => {
            lastProps.setAlgorithmState({ type: "insert" });
        });
        expect(lastProps.makeSnapshot()).toEqual({ pivotIndex: undefined, checkingIndex: undefined });
    });

    it("updateData updates pivotIndex and checkingIndex", async () => {
        const setTheory = vi.fn();

        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <InsertionSort />
            </TheoryContext.Provider>
        );

        expect(lastProps).toBeDefined();

        expect(screen.getByTestId("node-0")).not.toHaveClass("border-green-400");
        expect(screen.getByTestId("node-1")).not.toHaveClass("border-yellow-400");

        act(() => {
            lastProps.updateData({ pivotIndex: 0, checkingIndex: 1 });
        });

        await waitFor(() => {
            expect(screen.getByTestId("node-0")).toHaveClass("border-green-400");
            expect(screen.getByTestId("node-1")).toHaveClass("border-yellow-400");
        });
    });

    it("nodeClassName applies correct classes for setAlgorithmState actions", async () => {
        const setTheory = vi.fn();

        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <InsertionSort />
            </TheoryContext.Provider>
        );

        expect(lastProps).toBeDefined();


        act(() => {
            lastProps.setAlgorithmState({ type: "key", index: 0 });
        });
        expect(screen.getByTestId("node-0")).toHaveClass("border-green-400");

        act(() => {
            lastProps.setAlgorithmState({ type: "checking", checkingIndex: 1 });
        });
        expect(screen.getByTestId("node-1")).toHaveClass("border-yellow-400");

        act(() => {
            lastProps.setAlgorithmState({ type: "done" });
        });
        expect(screen.getByTestId("node-0")).not.toHaveClass("border-green-400");
        expect(screen.getByTestId("node-1")).not.toHaveClass("border-yellow-400");
    });
});
