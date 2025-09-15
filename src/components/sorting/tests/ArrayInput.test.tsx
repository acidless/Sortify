import {describe, expect} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import ArrayInput from "../ArrayInput.tsx";
import userEvent from "@testing-library/user-event";

describe("ArrayInputComponent", () => {
    it("should print validation error on bad input", async () => {
        const arrayInput = render(<ArrayInput onInputChange={() => {}} onSubmit={() => {}}/>);
        const input = arrayInput.getByRole("textbox");
        await userEvent.type(input, "1");

        const form = arrayInput.getByRole("button", {"name": "submit-array"});
        await userEvent.click(form);

        expect(arrayInput.getByText("Был введен не массив")).toBeInTheDocument();
    });

    it("should call onSubmit with array", async () => {
        const mockSubmit = vi.fn();

        const arrayInput = render(<ArrayInput onInputChange={() => {}} onSubmit={mockSubmit}/>);
        const input = arrayInput.getByRole("textbox");
        fireEvent.change(input, { target: { value: "[1, 2, 3]" } });

        const form = arrayInput.getByRole("button", {"name": "submit-array"});
        await userEvent.click(form);

        expect(mockSubmit).toHaveBeenCalledWith([{key: 0, value: 1}, {key: 1, value: 2}, {key: 2, value: 3}]);
    });

    it("should call onSubmit with random array", async () => {
        const mockSubmit = vi.fn();

        const arrayInput = render(<ArrayInput onInputChange={() => {}} onSubmit={mockSubmit}/>);
        const form = arrayInput.getByRole("button", {"name": "random-array"});
        await userEvent.click(form);

        expect(mockSubmit).toHaveBeenCalledWith(expect.any(Array));
    });
});