import {useEffect, useReducer, useRef} from "react";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {quickSort, type QuickSortAction} from "../../algorithms/quickSort.ts";
import type {SampleArray} from "../../types.ts";

type State = {
    pivotIndex: number | undefined;
    leftPart: SampleArray | undefined;
    rightPart: SampleArray | undefined;
    checkingIndices: number[] | undefined;
    swapIndices: number[] | undefined;
};

const initialState: State = {
    pivotIndex: undefined,
    leftPart: undefined,
    rightPart: undefined,
    checkingIndices: undefined,
    swapIndices: undefined
};

type Action =
    | { type: "SET_PIVOT", payload: number | undefined }
    | { type: "SET_LEFT", payload: SampleArray | undefined }
    | { type: "SET_RIGHT", payload: SampleArray | undefined }
    | { type: "SET_CHECKING", payload: number[] | undefined }
    | { type: "SET_SWAP", payload: number[] | undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PIVOT":
            return {...state, pivotIndex: action.payload};
        case "SET_LEFT":
            return {...state, leftPart: action.payload};
        case "SET_RIGHT":
            return {...state, rightPart: action.payload};
        case "SET_CHECKING":
            return {...state, checkingIndices: action.payload};
        case "SET_SWAP":
            return {...state, swapIndices: action.payload};
        default:
            return state;
    }
}

function QuickSort() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    function makeSnapshot() {
        return {
            checkingIndices: stateRef.current.checkingIndices,
            pivotIndex: stateRef.current.pivotIndex,
            leftPart: stateRef.current.leftPart,
            rightPart: stateRef.current.rightPart,
            swapIndices: stateRef.current.swapIndices
        };
    }

    function updateData(next: any) {
        dispatch({type: "SET_LEFT", payload: next.leftPart});
        dispatch({type: "SET_RIGHT", payload: next.rightPart});
        dispatch({type: "SET_CHECKING", payload: next.indices});
        dispatch({type: "SET_PIVOT", payload: next.pivotIndex});
        dispatch({type: "SET_SWAP", payload: next.swapIndices});
    }

    function setAlgorithmState(action: QuickSortAction) {
        switch (action.type) {
            case "partition":
                dispatch({type: "SET_PIVOT", payload: action.pivotIndex});
                dispatch({type: "SET_LEFT", payload: action.left});
                dispatch({type: "SET_RIGHT", payload: action.right});
                dispatch({type: "SET_CHECKING", payload: undefined});
                dispatch({type: "SET_SWAP", payload: undefined});
                break;
            case "compare":
                dispatch({type: "SET_CHECKING", payload: action.indices});
                dispatch({type: "SET_SWAP", payload: undefined});
                break;
            case "swap":
                dispatch({type: "SET_SWAP", payload: action.indices});
                dispatch({type: "SET_CHECKING", payload: undefined});
                break;
            case "done":
                dispatch({type: "SET_PIVOT", payload: undefined});
                dispatch({type: "SET_CHECKING", payload: undefined});
                dispatch({type: "SET_SWAP", payload: undefined});
                break;
        }
    }

    function nodeClassName(index: number, key: number) {
        if (index === state.pivotIndex) return "border-red-400";
        if (state.swapIndices?.includes(index)) return "border-green-400";
        if (state.checkingIndices?.includes(index)) return "border-yellow-400";
        if (state.leftPart?.some(item => item.key === key)) return "border-blue-400";
        if (state.rightPart?.some(item => item.key === key)) return "border-orange-400";
    }

    return <SortingAlgorithm
        name="Quick Sort"
        algorithm={quickSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={state.checkingIndices}
        classNameFn={nodeClassName}
    />;
}

export default QuickSort;
