import { render } from "@testing-library/react";
import ComparisionIndices from "../ComparisionIndices.tsx";

describe("ComparisionIndicesComponent", () => {
    it("should render nothing if no indices", () => {
        const component = render(<ComparisionIndices array={[{value: 1, key: 1}, {value: 2, key: 2}]} indices={undefined} />);
        expect(component.queryByText("1 < 2")).not.toBeInTheDocument();
        expect(component.queryByText("2 > 1")).not.toBeInTheDocument();
    });

    it("should render correct text", () => {
        const component = render(<ComparisionIndices array={[{value: 1, key: 1}, {value: 2, key: 2}]} indices={[0, 1]} />);
        expect(component.getByText("1 < 2")).toBeInTheDocument();

        component.rerender(<ComparisionIndices array={[{value: 1, key: 1}, {value: 2, key: 2}]} indices={[1, 0]} />);
        expect(component.getByText("2 > 1")).toBeInTheDocument();

        component.rerender(<ComparisionIndices array={[{value: 2, key: 1}, {value: 2, key: 2}]} indices={[1, 0]} />);
        expect(component.getByText("2 = 2")).toBeInTheDocument();

        component.rerender(<ComparisionIndices array={[{value: 1, key: 1}, {value: 2, key: 2}]} indices={[1, -1]} />);
        expect(component.getByText("2 минимальное")).toBeInTheDocument();
    });
});