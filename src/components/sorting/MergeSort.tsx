import {useEffect, useReducer, useRef} from "react";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {mergeSort, type MergeSortAction} from "../../algorithms/mergeSort.ts";
import type {SampleArray} from "../../types.ts";

type State = {
    leftPart: SampleArray | undefined;
    rightPart: SampleArray | undefined;
    checkingIndices: number[] | undefined;
    overwriteIndex: number | undefined;
};

const initialState: State = {
    leftPart: undefined,
    rightPart: undefined,
    checkingIndices: undefined,
    overwriteIndex: undefined
};

type Action =
    { type: "SET_LEFT_PART", payload: SampleArray | undefined } |
    { type: "SET_RIGHT_PART", payload: SampleArray | undefined } |
    { type: "SET_CHECKING_INDICES", payload: number[] | undefined } |
    { type: "SET_OVERWRITE_INDEX", payload: number | undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_LEFT_PART":
            return {...state, leftPart: action.payload};
        case "SET_RIGHT_PART":
            return {...state, rightPart: action.payload};
        case "SET_CHECKING_INDICES":
            return {...state, checkingIndices: action.payload};
        case "SET_OVERWRITE_INDEX":
            return {...state, overwriteIndex: action.payload};
    }
}

function MergeSort() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    function makeSnapshot() {
        return {
            checkingIndices: stateRef.current.checkingIndices,
            leftPart: stateRef.current.leftPart,
            rightPart: stateRef.current.rightPart
        };
    }

    function updateData(next: any) {
        dispatch({type: "SET_LEFT_PART", payload: next.leftPart});
        dispatch({type: "SET_RIGHT_PART", payload: next.rightPart});
        dispatch({type: "SET_CHECKING_INDICES", payload: next.indices});
        dispatch({type: "SET_OVERWRITE_INDEX", payload: next.index});
    }

    function setAlgorithmState(action: MergeSortAction) {
        switch (action.type) {
            case "slice":
                dispatch({type: "SET_LEFT_PART", payload: action.left});
                dispatch({type: "SET_RIGHT_PART", payload: action.right});
                dispatch({type: "SET_CHECKING_INDICES", payload: undefined});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: undefined});
                break;
            case "compare":
                dispatch({type: "SET_CHECKING_INDICES", payload: action.indices});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: undefined});
                break;
            case "overwrite":
                dispatch({type: "SET_CHECKING_INDICES", payload: undefined});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: action.index});
                break;
            case "done":
                dispatch({type: "SET_CHECKING_INDICES", payload: undefined});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: undefined});
                break;
        }
    }

    function nodeClassName(index: number, key: number) {
        if (index === state.overwriteIndex) return "border-green-400";
        if (state.checkingIndices?.includes(index)) return "border-yellow-400";
        if (state.leftPart?.filter(item => item.key === key).length) return "border-blue-400";
        if (state.rightPart?.filter(item => item.key === key).length) return "border-orange-400";
    }

    return <SortingAlgorithm
        name="Merge Sort"
        algorithm={mergeSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={state.checkingIndices}
        classNameFn={nodeClassName}
    ></SortingAlgorithm>;
}

export default MergeSort;