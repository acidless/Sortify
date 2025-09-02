import type {BSTAction, BSTNode} from "../types.ts";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import useAlgorithm, {type BaseAlgorithmState} from "./useAlgorithm.ts";

export type BSTOperationState = Partial<BaseAlgorithmState> & {
    checkingNode: BSTNode<number> | null;
    resultNode: BSTNode<number> | null;
    popupText: string;
    targetNumber: number;
    bstNodes: BSTNode<number>[];
};

const initialState: BSTOperationState = {
    checkingNode: null,
    resultNode: null,
    popupText: "",
    targetNumber: 0,
    bstNodes: [],
}

export type BSTOperationAction = { type: "SET_CHECKING_NODE", payload: BSTNode<number> | null } |
    { type: "SET_RESULT_NODE", payload: BSTNode<number> | null } |
    { type: "SET_POPUP_TEXT", payload: string } |
    { type: "SET_TARGET_NUMBER", payload: number } |
    { type: "SET_BST_NODES", payload: BSTNode<number>[] };

function reducer(state: BSTOperationState, action: BSTOperationAction): BSTOperationState {
    switch (action.type) {
        case "SET_CHECKING_NODE":
            return {...state, checkingNode: action.payload};
        case "SET_RESULT_NODE":
            return {...state, resultNode: action.payload};
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        case "SET_TARGET_NUMBER":
            return {...state, targetNumber: action.payload};
        case "SET_BST_NODES":
            return {...state, bstNodes: action.payload};
        default:
            return state;
    }
}

export type BSTHistoryState = Omit<BSTOperationState, "targetNumber" | "bstNodes">;

export function useBSTOperation(algo: (input: BSTNode<number>, target: number) => Generator<BSTAction, void, unknown>,
                                setAlgorithmState: (state: BSTAction, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) => void,
                                startBST: BSTNode<number>[]) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<BSTOperationState>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);


    useEffect(() => {
        dispatch({type: "SET_BST_NODES", payload: startBST});
    }, [startBST]);

    const algorithm = useCallback((input: BSTNode<number>) => {
        return algo(input, state.targetNumber);
    }, [state.targetNumber]);

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    const onStart = useCallback((_input: BSTNode<number>, historyRef: RefObject<Array<BSTHistoryState>>) => {
        historyRef.current = [{
            checkingNode: null,
            resultNode: null,
            isDone: false,
            popupText: ""
        }];
    }, []);

    const updateAll = useCallback((next: BSTOperationState) => {
        dispatch({type: "SET_CHECKING_NODE", payload: next.checkingNode});
        dispatch({type: "SET_RESULT_NODE", payload: next.resultNode});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
    }, []);

    const onStep = useCallback((value: BSTAction, historyRef: RefObject<Array<BSTHistoryState>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: stateRef.current.checkingNode,
            resultNode: stateRef.current.resultNode,
            isDone: algorithmData.algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText
        });
    }, [state.targetNumber]);

    function setAlgorithmStateWrapper(value: BSTAction) {
        if (value.type === "not-found" || value.type === "found") {
            algorithmData.cleanupInterval();
            algorithmData.algorithmDispatch({type: "SET_DONE", payload: true});
        }

        setAlgorithmState(value, dispatch, stateRef, makeComparison);
    }

    function nodeStateFunc(id: string) {
        if (state.resultNode?.id === id) return "border-green-400";
        if (state.checkingNode?.id === id) return "border-yellow-400";

        return "border-neutral-700";
    }

    function onOperationChange(value: number) {
        dispatch({type: "SET_TARGET_NUMBER", payload: value});
    }

    function onOperation() {
        algorithmData.startAlgorithm(state.bstNodes[0]);
    }

    const algorithmData = useAlgorithm<BSTNode<number>, BSTAction, BSTOperationState>(algorithm, updateAll, onStart, onStep);


    return {onOperation, onOperationChange, nodeStateFunc, useAlgorithmData: algorithmData, state};
}