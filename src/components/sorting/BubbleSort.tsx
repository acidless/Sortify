import {useRef, useState} from "react";
import {bubbleSort, type BubbleSortAction} from "../../algorhitms/bubbleSort.ts";
import SortingAlgorithm from "./SortingAlgorithm.tsx";

function BubbleSort() {
    const [checkingIndices, setCheckingIndices] = useState<number[] | undefined>();
    const checkingIndicesRef = useRef<number[] | undefined>(checkingIndices);

    function makeSnapshot() {
        return {
            checkingIndices: checkingIndicesRef.current
        };
    }

    function updateCheckingIndices(newCheckingIndices: number[] | undefined) {
        setCheckingIndices(newCheckingIndices);
        checkingIndicesRef.current = newCheckingIndices;
    }

    function updateData(next: any) {
        updateCheckingIndices(next.checkingIndices);
    }

    function setAlgorithmState(action: BubbleSortAction) {
        switch (action.type) {
            case "compare":
                updateCheckingIndices(action.indices);
                break;
            case "swap":
                updateCheckingIndices(undefined);
                break;
            case "done":
                updateCheckingIndices(undefined);
                break;
        }
    }

    return <SortingAlgorithm
        algorithm={bubbleSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={checkingIndices}
        isNodeActive={(index: number) => checkingIndices?.includes(index) ?? false}
        isNodeChecking={() => false}
    />;
}

export default BubbleSort;