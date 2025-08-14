import BinarySearchTree from "./BinarySearchTree.tsx";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import type {BSTNode} from "../../types.ts";
import {bstSearch} from "../../algorithms/bstSearch.ts";
import Controls from "../Controls.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import PopupText from "../PopupText.tsx";
import BSTSearchInput from "./BSTInput.tsx";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";

type State = {
    checkingNode: BSTNode | null;
    foundNode: BSTNode | null;
    popupText: string;
    findingNumber: number;
    bstNodes: BSTNode[];
};

const initialState: State = {
    checkingNode: null,
    foundNode: null,
    popupText: "",
    findingNumber: 0,
    bstNodes: [],
}

type Action = { type: "SET_CHECKING_NODE", payload: BSTNode | null } |
    { type: "SET_FOUND_NODE", payload: BSTNode | null } |
    { type: "SET_POPUP_TEXT", payload: string } |
    { type: "SET_FINDING_NUMBER", payload: number } |
    { type: "SET_BST_NODES", payload: BSTNode[] };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_CHECKING_NODE":
            return {...state, checkingNode: action.payload};
        case "SET_FOUND_NODE":
            return {...state, foundNode: action.payload};
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        case "SET_FINDING_NUMBER":
            return {...state, findingNumber: action.payload};
        case "SET_BST_NODES":
            return {...state, bstNodes: action.payload};
        default:
            return state;
    }
}


function BSTSearch() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);


    useEffect(() => {
        const randomTree = bstBfs(generateRandomBST(8, 0, 20));
        dispatch({type: "SET_BST_NODES", payload: randomTree});
    }, []);

    const algorithm = useCallback((input: BSTNode) => {
        return bstSearch(input, state.findingNumber);
    }, [state.findingNumber]);

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    const onStart = useCallback((_input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [{
            checkingNode: null,
            foundNode: null,
            isDone: false,
            popupText: ""
        }];
    }, []);

    const updateAll = useCallback((next: any) => {
        dispatch({type: "SET_CHECKING_NODE", payload: next.checkingNode});
        dispatch({type: "SET_FOUND_NODE", payload: next.foundNode});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: stateRef.current.checkingNode,
            foundNode: stateRef.current.foundNode,
            isDone: algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText
        });
    }, [state.findingNumber]);

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "not-found" || value.type === "found") {
            cleanupInterval();
            algorithmDispatch({type: "SET_DONE", payload: true});
        }

        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, state.findingNumber)
                });
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                dispatch({type: "SET_FOUND_NODE", payload: null});
                break;
            case "found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент найден!"});
                dispatch({type: "SET_FOUND_NODE", payload: value.node});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
            case "not-found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент не найден!"});
                dispatch({type: "SET_FOUND_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
        }
    }

    function nodeStateFunc(id: string) {
        if (state.foundNode?.id === id) return "border-green-400";
        if (state.checkingNode?.id === id) return "border-yellow-400";

        return "border-neutral-700";
    }

    const {
        cleanupInterval,
        stepBack,
        stepForward,
        toggleAlgorithm,
        startAlgorithm,
        algorithmDispatch,
        algorithmStateRef,
        algorithmState
    } = useAlgorithm(algorithm, updateAll, onStart, onStep);

    function onOperationChange(value: number) {
        dispatch({type: "SET_FINDING_NUMBER", payload: value});
    }

    function onOperation() {
        startAlgorithm(state.bstNodes[0]);
    }

    return <div className="flex flex-col items-start h-max">
        <h1 className="font-bold text-3xl text-center mb-10 self-center">BST Search</h1>
        <BSTSearchInput onOperation={onOperation} operationLabel="Введите значение для поиска"
                        onOperationChange={onOperationChange}/>
        <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
            <PopupText id={state.popupText} text={state.popupText}/>
            {state.bstNodes.length ? <BinarySearchTree nodeStateFunc={nodeStateFunc} root={state.bstNodes[0]}
                                                       size={state.bstNodes.length}></BinarySearchTree> : null}
            <EndAlgorithm isDone={algorithmState.isDone} bottom="bottom-12"/>
        </div>
        <Controls stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                  firstState={algorithmState.firstState} isPaused={algorithmState.isPaused}
                  isDone={algorithmState.isDone}></Controls>
    </div>
}

export default BSTSearch;