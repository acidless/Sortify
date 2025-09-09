import {createContext} from "react";

export const TheoryContext = createContext<{theory: JSX.Element | null, setTheory: (markup: JSX.Element) => void}>({
    theory: null, setTheory: (markup: JSX.Element) => {}
});