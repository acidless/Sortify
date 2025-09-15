import {act, render, screen, waitFor} from "@testing-library/react";
import { lastProps } from "./Base.tsx";
import {expect, vi} from "vitest";
import userEvent from "@testing-library/user-event";
import {TheoryContext} from "../../../TheoryContext";
import BubbleSort from "../BubbleSort.tsx";

describe("BubbleSort component", () => {
    it("should call setTheory and render tabs", () => {
        const setTheory = vi.fn();
        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <BubbleSort />
            </TheoryContext.Provider>
        );

        expect(setTheory).toHaveBeenCalled();
        const element = setTheory.mock.calls[0][0];
        expect(element.type.name).toBe("BubbleSortText");

        const data = render(element);
        expect(data.getByText("Теория")).toBeInTheDocument();
        expect(data.getByText("Сложность")).toBeInTheDocument();
        expect(data.getByText("Шаги")).toBeInTheDocument();
    });

    it("should highlight indices on compare", async () => {
        const setTheory = vi.fn();
        render(
            <TheoryContext.Provider value={{theory: "", setTheory}}>
                <BubbleSort/>
            </TheoryContext.Provider>
        );

        await userEvent.click(screen.getByText("Compare"));
        expect(screen.getByTestId("node-0")).toHaveClass("border-green-400");
        expect(screen.getByTestId("node-1")).toHaveClass("border-green-400");
    });

    it("should remove highlight on swap and done", async () => {
        const setTheory = vi.fn();
        render(
            <TheoryContext.Provider value={{theory: "", setTheory}}>
                <BubbleSort/>
            </TheoryContext.Provider>
        );

        await userEvent.click(screen.getByText("Compare"));
        expect(screen.getByTestId("node-0")).toHaveClass("border-green-400");

        await userEvent.click(screen.getByText("Swap"));
        expect(screen.getByTestId("node-0")).not.toHaveClass("border-green-400");

        await userEvent.click(screen.getByText("Compare"));
        await userEvent.click(screen.getByText("Done"));
        expect(screen.getByTestId("node-1")).not.toHaveClass("border-green-400");
    });

    it("makeSnapshot returns current checkingIndices", () => {
        const setTheory = vi.fn();

        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <BubbleSort />
            </TheoryContext.Provider>
        );

        expect(lastProps).toBeDefined();
        expect(lastProps.makeSnapshot()).toEqual({ checkingIndices: undefined });

        act(() => {
            lastProps.setAlgorithmState({ type: "compare", indices: [0, 1] });
        });

        expect(lastProps.makeSnapshot()).toEqual({ checkingIndices: [0, 1] });
    });

    it("updateData updates checkingIndices and nodes classes", async () => {
        const setTheory = vi.fn();

        render(
            <TheoryContext.Provider value={{ theory: "", setTheory }}>
                <BubbleSort />
            </TheoryContext.Provider>
        );

        expect(lastProps).toBeDefined();
        expect(screen.getByTestId("node-1")).not.toHaveClass("border-green-400");

        act(() => {
            lastProps.updateData({ checkingIndices: [1] });
        });

        await waitFor(() => {
            expect(screen.getByTestId("node-1")).toHaveClass("border-green-400");
        });
    });
});
