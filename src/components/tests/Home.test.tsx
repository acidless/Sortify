import Home from "../Home.tsx";
import {render} from "@testing-library/react";

describe('HomeComponent', () => {
    it("should render welcome text", () => {
        const home = render(<Home/>);
        expect(home.getByText("Добро пожаловать! Выберите алгоритм, чтобы начать")).toBeInTheDocument();
    });
});