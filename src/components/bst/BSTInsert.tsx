import BinarySearchTree from "./BinarySearchTree.tsx";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import type {BSTNode} from "../../types.ts";
import Controls from "../Controls.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import PopupText from "../PopupText.tsx";
import BSTSearchInput from "./BSTInput.tsx";
import {bstInsert} from "../../algorithms/bstInsert.ts";

const node = {value: 10, id: crypto.randomUUID(), left: null, right: null};

type State = {
    checkingNode: BSTNode | null;
    insertedNode: BSTNode | null;
    popupText: string;
    insertingNumber: number;
    bstNodes: BSTNode[];
};

type Action =
    | { type: "SET_CHECKING_NODE"; payload: BSTNode | null }
    | { type: "SET_INSERTED_NODE"; payload: BSTNode | null }
    | { type: "SET_POPUP_TEXT"; payload: string }
    | { type: "SET_INSERTING_NUMBER"; payload: number }
    | { type: "SET_BST_NODES"; payload: BSTNode[] };

const initialState: State = {
    checkingNode: null,
    insertedNode: null,
    popupText: "",
    insertingNumber: 0,
    bstNodes: [node],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_CHECKING_NODE":
            return {...state, checkingNode: action.payload};
        case "SET_INSERTED_NODE":
            return {...state, insertedNode: action.payload};
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        case "SET_INSERTING_NUMBER":
            return {...state, insertingNumber: action.payload};
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

    const algorithm = useCallback((input: BSTNode) => {
        return bstInsert(input, state.insertingNumber);
    }, [state.insertingNumber]);

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    const onStart = useCallback((input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [{
            checkingNode: null,
            insertedNode: null,
            isDone: false,
            popupText: "",
            nodes: stateRef.current.bstNodes.map((node) => ({...node}))
        }];
    }, []);

    const updateAll = useCallback((next: any) => {
        dispatch({type: "SET_CHECKING_NODE", payload: next.checkingNode});
        dispatch({type: "SET_INSERTED_NODE", payload: next.insertedNode});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
        dispatch({type: "SET_BST_NODES", payload: next.nodes});
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: stateRef.current.checkingNode,
            insertedNode: stateRef.current.insertedNode,
            isDone: algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText,
            nodes: stateRef.current.bstNodes.map((node) => ({...node}))
        });
    }, [state.insertingNumber]);

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "not-found" || value.type === "found") {
            cleanupInterval();
            algorithmDispatch({type: "SET_DONE", payload: true});
        }

        switch (value.type) {
            case "compare":
                dispatch({type: "SET_POPUP_TEXT", payload: makeComparison(value.node.value, state.insertingNumber)});
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                dispatch({type: "SET_INSERTED_NODE", payload: null});
                break;
            case "exists":
                dispatch({type: "SET_POPUP_TEXT", payload: `Элемент уже существует!`});
                dispatch({type: "SET_INSERTED_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
            case "inserted":
                dispatch({type: "SET_POPUP_TEXT", payload: `Элемент вставлен!`});
                dispatch({type: "SET_INSERTED_NODE", payload: value.node});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                dispatch({type: "SET_BST_NODES", payload: [...state.bstNodes, value.node]});
                break;
        }
    }


    function nodeStateFunc(id: string) {
        if (state.insertedNode?.id === id) return "border-green-400";
        if (state.checkingNode?.id === id) return "border-yellow-400";

        return "border-neutral-700";
    }

    const {
        cleanupInterval,
        stepBack,
        stepForward,
        toggleAlgorithm,
        algorithmState,
        algorithmStateRef,
        algorithmDispatch,
        startAlgorithm,
    } = useAlgorithm(algorithm, updateAll, onStart, onStep);

    function onOperationChange(value: number) {
        dispatch({type: "SET_INSERTING_NUMBER", payload: value});
    }

    function onOperation() {
        startAlgorithm(state.bstNodes[0]);
    }

    return <div className="h-full flex flex-col items-start h-max">
        <h1 className="font-bold text-3xl text-center mb-10 self-center">BST Insert</h1>
        <BSTSearchInput onOperation={onOperation} operationLabel="Введите значение для вставки"
                        onOperationChange={onOperationChange}/>
        <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
            <PopupText id={state.popupText} text={state.popupText}/>
            {state.bstNodes.length ? <BinarySearchTree nodeStateFunc={nodeStateFunc} root={state.bstNodes[0]}
                                                       size={state.bstNodes.length}></BinarySearchTree> : null}
            <EndAlgorithm isDone={algorithmState.isDone} bottom="bottom-12"/>
        </div>
        <Controls stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                  firstState={algorithmState.firstState} isPaused={algorithmState.isPaused} isDone={algorithmState.isDone}></Controls>
    </div>
}

export default BSTSearch;