import {useRef, useState} from "react";
import {insertionSort, type InsertionSortAction} from "../../algorhitms/insertionSort.ts";
import SortingAlgorithm from "./SortingAlgorithm.tsx";

function InsertionSort() {
    const [pivotIndex, setPivotIndex] = useState<number | undefined>();
    const [checkingIndex, setCheckingIndex] = useState<number | undefined>();
    const pivotIndexRef = useRef<number | undefined>(pivotIndex);
    const checkingIndexRef = useRef<number | undefined>(checkingIndex);

    function makeSnapshot() {
        return {
            pivotIndex: pivotIndexRef.current,
            checkingIndex: checkingIndexRef.current
        };
    }

    function updatePivotIndex(newPivotIndex: number | undefined) {
        setPivotIndex(newPivotIndex);
        pivotIndexRef.current = newPivotIndex;
    }

    function updateCheckingIndex(newCheckingIndex: number | undefined) {
        setCheckingIndex(newCheckingIndex);
        checkingIndexRef.current = newCheckingIndex;
    }

    function updateData(next: any) {
        updatePivotIndex(next.pivotIndex);
        updateCheckingIndex(next.checkingIndex);
    }

    function setAlgorithmState(action: InsertionSortAction) {
        switch (action.type) {
            case "key":
                updatePivotIndex(action.index);
                updateCheckingIndex(undefined);
                break;
            case "checking":
                updateCheckingIndex(action.checkingIndex);
                break;
            case "insert":
                updateCheckingIndex(undefined);
                updatePivotIndex(undefined);
                break;
            case "done":
                updateCheckingIndex(undefined);
                updatePivotIndex(undefined);
                break;
        }
    }

    function nodeClassName(index: number) {
        if(pivotIndex === index) return "border-green-400";
        if(checkingIndex === index) return "border-yellow-400";
    }

    return <SortingAlgorithm
        name="Insertion Sort"
        algorithm={insertionSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={pivotIndex !== undefined && checkingIndex !== undefined ? [pivotIndex, checkingIndex] : undefined}
        classNameFn={nodeClassName}
    />;
}

export default InsertionSort;