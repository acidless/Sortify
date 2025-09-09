import {createContext} from "react";

export const TheoryContext = createContext<{theory: React.ReactNode | null, setTheory: (markup: React.ReactNode) => void}>({
    theory: null, setTheory: () => {}
});