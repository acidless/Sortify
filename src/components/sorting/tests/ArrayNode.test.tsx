import {render} from "@testing-library/react";
import ArrayNode from "../ArrayNode.tsx";

describe("ArrayNodeComponent", () => {
   it("should render specified value", () => {
      const node = render(<ArrayNode value={1} />);
      expect(node.getByText("1")).toBeInTheDocument();
   });

    it("should contain specified class", () => {
        const node = render(<ArrayNode value={1} className="border-yellow-400" />);
        expect(node.container.firstChild).toHaveClass("border-yellow-400");
    });
});