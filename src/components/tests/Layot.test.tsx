import Layout from "../Layout";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router";

describe('LayoutComponent', () => {
    it("should render", () => {
        render(<BrowserRouter><Layout /></BrowserRouter>);
    });
});