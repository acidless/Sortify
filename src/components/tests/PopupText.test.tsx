import PopupText from "../PopupText";
import {render} from "@testing-library/react";

describe("PopupText", () => {
   it("should contain given text", () => {
        const popupText = render(<PopupText id={1} text="Hello World" />);
        expect(popupText.getByText("Hello World")).toBeInTheDocument();
   });
});