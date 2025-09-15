import {render, } from "@testing-library/react";
import EndAlgorithm from "../EndAlgorithm.tsx";

describe('EndAlgorithmComponent', () => {
    it("should render end text", () => {
        const endAlgorithm = render(<EndAlgorithm isDone={false}/>);
        expect(endAlgorithm.getByText("Работа алгоритма завершена")).toBeInTheDocument();
    });

    it("should show and hide", async () => {
        const endAlgorithm = render(<EndAlgorithm isDone={false}/>);
        expect(endAlgorithm.container.firstChild).toHaveClass("opacity-0 translate-y-10");

        endAlgorithm.rerender(<EndAlgorithm isDone={true}/>);
        expect(endAlgorithm.container.firstChild).toHaveClass("opacity-100 translate-y-0");
    });
});