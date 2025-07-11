import {useRef, useState} from "react";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {mergeSort, type MergeSortAction} from "../../algorhitms/mergeSort.ts";
import type {SampleArray} from "../../types.ts";

function MergeSort() {
    const [leftPart, setLeftPart] = useState<SampleArray | undefined>();
    const [rightPart, setRightPart] = useState<SampleArray | undefined>();
    const leftPartRef = useRef<SampleArray | undefined>(leftPart);
    const rightPartRef = useRef<SampleArray | undefined>(rightPart);

    const [checkingIndices, setCheckingIndices] = useState<number[] | undefined>();
    const [overwriteIndex, setOverwriteIndex] = useState<number | undefined>();
    const checkingIndicesRef = useRef<number[] | undefined>(checkingIndices);
    const overwriteIndexRef = useRef<number | undefined>(overwriteIndex);

    function makeSnapshot() {
        return {
            checkingIndices: checkingIndicesRef.current,
            leftPart: leftPartRef.current,
            rightPart: rightPartRef.current
        };
    }

    function updateLeftPart(leftPart: SampleArray | undefined) {
        setLeftPart(leftPart);
        leftPartRef.current = leftPart;
    }

    function updateRightPart(rightPart: SampleArray | undefined) {
        setRightPart(rightPart);
        rightPartRef.current = rightPart;
    }

    function updateCheckingIndices(newCheckingIndices: number[] | undefined) {
        setCheckingIndices(newCheckingIndices);
        checkingIndicesRef.current = newCheckingIndices;
    }

    function updateOverwriteIndices(newOverwriteIndex: number | undefined) {
        setOverwriteIndex(newOverwriteIndex);
        overwriteIndexRef.current = newOverwriteIndex;
    }

    function updateData(next: any) {
        updateCheckingIndices(next.indices);
        updateOverwriteIndices(next.index)
        updateLeftPart(next.leftPart);
        updateRightPart(next.rightPart);
    }

    function setAlgorithmState(action: MergeSortAction) {
        switch (action.type) {
            case "slice":
                updateLeftPart(action.left);
                updateRightPart(action.right);
                updateCheckingIndices(undefined);
                updateOverwriteIndices(undefined);
                break;
            case "compare":
                updateCheckingIndices(action.indices);
                updateOverwriteIndices(undefined);
                break;
            case "overwrite":
                updateCheckingIndices(undefined);
                updateOverwriteIndices(action.index);
                break;
            case "done":
                updateCheckingIndices(undefined);
                updateOverwriteIndices(undefined);
                break;
        }
    }

    function nodeClassName(index: number, key: number) {
        if (index === overwriteIndex) return "border-green-400";
        if (checkingIndices?.includes(index)) return "border-yellow-400";
        if (leftPart?.filter(item => item.key === key).length) return "border-blue-400";
        if (rightPart?.filter(item => item.key === key).length) return "border-orange-400";
    }

    return <SortingAlgorithm
        name="Merge Sort"
        algorithm={mergeSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={checkingIndices}
        classNameFn={nodeClassName}
    ></SortingAlgorithm>;
}

export default MergeSort;