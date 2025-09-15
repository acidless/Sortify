import {useMemo} from "react";
import PopupText from "./PopupText.tsx";
import type {SampleArray} from "../types.ts";

type Props = {
    array: SampleArray,
    indices: number[] | undefined,
};

const ComparisionIndices = ({array, indices}: Props) => {
    const comparisonLine = useMemo(() => makeComparisonLine(), [indices]);

    function makeComparisonLine() {
        if (!indices) return "";

        const a = array[indices[0]].value;
        if (indices[1] < 0) {
            return `${a} минимальное`;
        }

        const b = array[indices[1]].value;
        const sign = a > b ? ">" : a < b ? "<" : "=";
        return `${a} ${sign} ${b}`;
    }

    return (
        <>
            {indices && <PopupText id={indices.join("-")} text={comparisonLine}/>}
        </>
    )
}

export default ComparisionIndices;