import {useEffect, useReducer, useRef} from "react";
import {insertionSort, type InsertionSortAction} from "../../algorithms/insertionSort.ts";
import SortingAlgorithm from "./SortingAlgorithm.tsx";

type State = {
    pivotIndex: number | undefined,
    checkingIndex: number | undefined
};

const initialState: State = {
    pivotIndex: undefined,
    checkingIndex: undefined
};

type Action =
    { type: "SET_PIVOT_INDEX", payload: number | undefined } |
    { type: "SET_CHECKING_INDEX", payload: number | undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PIVOT_INDEX":
            return {...state, pivotIndex: action.payload};
        case "SET_CHECKING_INDEX":
            return {...state, checkingIndex: action.payload};
        default:
            return state;
    }
}

function InsertionSort() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state])


    function makeSnapshot() {
        return {
            pivotIndex: stateRef.current.pivotIndex,
            checkingIndex: stateRef.current.checkingIndex
        };
    }

    function updateData(next: any) {
        dispatch({type: "SET_PIVOT_INDEX", payload: next.pivotIndex});
        dispatch({type: "SET_CHECKING_INDEX", payload: next.checkingIndex});
    }

    function setAlgorithmState(action: InsertionSortAction) {
        switch (action.type) {
            case "key":
                dispatch({type: "SET_PIVOT_INDEX", payload: action.index});
                dispatch({type: "SET_CHECKING_INDEX", payload: undefined});
                break;
            case "checking":
                dispatch({type: "SET_CHECKING_INDEX", payload: action.checkingIndex});
                break;
            case "insert":
            case "done":
                dispatch({type: "SET_CHECKING_INDEX", payload: undefined});
                dispatch({type: "SET_PIVOT_INDEX", payload: undefined});
                break;
        }
    }

    function nodeClassName(index: number) {
        if (state.pivotIndex === index) return "border-green-400";
        if (state.checkingIndex === index) return "border-yellow-400";
    }

    return <SortingAlgorithm
        name="Insertion Sort"
        algorithm={insertionSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={state.pivotIndex !== undefined && state.checkingIndex !== undefined ? [state.pivotIndex, state.checkingIndex] : undefined}
        classNameFn={nodeClassName}
    />;
}

export default InsertionSort;