import {describe, expect} from "vitest";
import {render} from "@testing-library/react";
import Theory from "../Theory.tsx";
import { TheoryContext } from "../../TheoryContext.ts";
import userEvent from "@testing-library/user-event";

describe("TheoryComponent", () => {
    it("should render fallback if no theory", () => {
        const theory = render(
            <TheoryContext.Provider value={{theory: null, setTheory:() => {}}}>
                <Theory />
            </TheoryContext.Provider>
        );

        expect(theory.getByText("Тут пока ничего нет :(")).toBeInTheDocument();
    });

    it("should toggle correct", async () => {
        const theory = render(
            <TheoryContext.Provider value={{theory: null, setTheory:() => {}}}>
                <Theory />
            </TheoryContext.Provider>
        );
        const toggleBtn = theory.getByText("Теория");
        expect(theory.getByText("Тут пока ничего нет :(").parentNode!.parentNode).toHaveClass("-right-full");
        await userEvent.click(toggleBtn);
        expect(theory.getByText("Тут пока ничего нет :(").parentNode!.parentNode).toHaveClass("right-0");
    });

    it("should contain theory", async () => {
        const theory = render(
            <TheoryContext.Provider value={{theory: <p>theory-mockup</p>, setTheory:() => {}}}>
                <Theory />
            </TheoryContext.Provider>
        );

        expect(theory.getByText("theory-mockup")).toBeInTheDocument();
    });
});