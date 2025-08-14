import type {BSTNode} from "../types.ts";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import useAlgorithm from "./useAlgorithm.ts";

export type BSTOperationState = {
    checkingNode: BSTNode | null;
    resultNode: BSTNode | null;
    popupText: string;
    targetNumber: number;
    bstNodes: BSTNode[];
};

const initialState: BSTOperationState = {
    checkingNode: null,
    resultNode: null,
    popupText: "",
    targetNumber: 0,
    bstNodes: [],
}

export type BSTOperationAction = { type: "SET_CHECKING_NODE", payload: BSTNode | null } |
    { type: "SET_RESULT_NODE", payload: BSTNode | null } |
    { type: "SET_POPUP_TEXT", payload: string } |
    { type: "SET_TARGET_NUMBER", payload: number } |
    { type: "SET_BST_NODES", payload: BSTNode[] };

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

export function useBSTOperation(algo: (input: BSTNode, target: number) => Generator<any, void, unknown>,
                         setAlgorithmState: (state: any, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) => void,
                         startBST: BSTNode[]) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<BSTOperationState>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);


    useEffect(() => {
        dispatch({type: "SET_BST_NODES", payload: startBST});
    }, []);

    const algorithm = useCallback((input: BSTNode) => {
        return algo(input, state.targetNumber);
    }, [state.targetNumber]);

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    const onStart = useCallback((_input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [{
            checkingNode: null,
            resultNode: null,
            isDone: false,
            popupText: ""
        }];
    }, []);

    const updateAll = useCallback((next: any) => {
        dispatch({type: "SET_CHECKING_NODE", payload: next.resultNode});
        dispatch({type: "SET_RESULT_NODE", payload: next.foundNode});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: stateRef.current.checkingNode,
            foundNode: stateRef.current.resultNode,
            isDone: algorithmData.algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText
        });
    }, [state.targetNumber]);

    function setAlgorithmStateWrapper(value: any) {
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

    const algorithmData = useAlgorithm(algorithm, updateAll, onStart, onStep);


    return {onOperation, onOperationChange, nodeStateFunc, useAlgorithmData: algorithmData, state};
}