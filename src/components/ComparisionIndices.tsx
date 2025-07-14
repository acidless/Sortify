import {useMemo} from "react";
import type {SampleArray} from "../../types";
import PopupText from "./PopupText.tsx";

type Props = {
    array: SampleArray,
    indecies: number[] | undefined,
};

const ComparisionIndices = ({array, indecies}: Props) => {
    const comparisonLine = useMemo(() => makeComparisonLine(), [indecies]);

    function makeComparisonLine() {
        if (!indecies) return "";

        const a = array[indecies[0]].value;
        if (indecies[1] < 0) {
            return `${a} минимальное`;
        }

        const b = array[indecies[1]].value;
        const sign = a > b ? ">" : a < b ? "<" : "=";
        return `${a} ${sign} ${b}`;
    }

    return (
        <>
            {indecies && <PopupText id={indecies.join("-")} text={comparisonLine}/>}
        </>
    )
}

export default ComparisionIndices;