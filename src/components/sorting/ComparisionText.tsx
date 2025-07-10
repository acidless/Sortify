import {motion} from "framer-motion";
import {useMemo} from "react";
import type {SampleArray} from "../../types.ts";

type Props = {
    array: SampleArray,
    indecies: number[] | undefined,
};

const ComparisionText = ({array, indecies}: Props) => {
    const comparisonLine = useMemo(() => makeComparisonLine(), [indecies]);

    function makeComparisonLine() {
        if (!indecies) return "";

        const a = array[indecies[0]].value;
        if(indecies[1] < 0) {
            return `${a} минимальное`;
        }

        const b = array[indecies[1]].value;
        const sign = a > b ? ">" : a < b ? "<" : "=";
        return `${a} ${sign} ${b}`;
    }

    return (
        <>
            {indecies && <motion.div key={indecies.join("-")}
                                           initial={{opacity: 0, y: -10}}
                                           animate={{opacity: 1, y: 0}}
                                           transition={{duration: 0.3}}
                                           className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl w-max">
                <p>{comparisonLine}</p>
            </motion.div>}
        </>

    )
}

export default ComparisionText;