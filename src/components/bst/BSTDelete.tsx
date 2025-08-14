import BinarySearchTree from "./BinarySearchTree.tsx";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import type {BSTNode} from "../../types.ts";
import Controls from "../Controls.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import PopupText from "../PopupText.tsx";
import BSTSearchInput from "./BSTInput.tsx";
import {bstDelete} from "../../algorithms/bstRemove.ts";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";

type State = {
    checkingNode: BSTNode | null;
    deletedNode: BSTNode | null;
    popupText: string;
    deletingNumber: number;
    bstNodes: BSTNode[];
};

type Action =
    | { type: "SET_CHECKING_NODE"; payload: BSTNode | null }
    | { type: "SET_DELETED_NODE"; payload: BSTNode | null }
    | { type: "SET_POPUP_TEXT"; payload: string }
    | { type: "SET_DELETING_NUMBER"; payload: number }
    | { type: "SET_BST_NODES"; payload: BSTNode[] };

const initialState: State = {
    checkingNode: null,
    deletedNode: null,
    popupText: "",
    deletingNumber: 0,
    bstNodes: [],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_CHECKING_NODE":
            return {...state, checkingNode: action.payload};
        case "SET_DELETED_NODE":
            return {...state, deletedNode: action.payload};
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        case "SET_DELETING_NUMBER":
            return {...state, deletingNumber: action.payload};
        case "SET_BST_NODES":
            return {...state, bstNodes: action.payload};
        default:
            return state;
    }
}

function BSTDelete() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        const randomTree = bstBfs(generateRandomBST(8, 0, 20));
        dispatch({type: "SET_BST_NODES", payload: randomTree});
    }, []);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const algorithm = useCallback(
        (input: BSTNode) => {
            return bstDelete(input, state.deletingNumber);
        },
        [state.deletingNumber]
    );

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    const onStart = useCallback((_input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [
            {
                checkingNode: null,
                deletedNode: null,
                isDone: false,
                popupText: "",
                nodes: stateRef.current.bstNodes.map((n) => ({...n})),
            },
        ];
    }, []);

    const updateAll = useCallback((next: any) => {
        dispatch({type: "SET_CHECKING_NODE", payload: next.checkingNode});
        dispatch({type: "SET_DELETED_NODE", payload: next.deletedNode});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
        dispatch({type: "SET_BST_NODES", payload: next.nodes});
    }, []);

    const onStep = useCallback(
        (value: any, historyRef: RefObject<Array<any>>) => {
            setAlgorithmStateWrapper(value);

            historyRef.current.push({
                checkingNode: stateRef.current.checkingNode,
                deletedNode: stateRef.current.deletedNode,
                isDone: algorithmStateRef.current.isDone,
                popupText: stateRef.current.popupText,
                nodes: stateRef.current.bstNodes.map((n) => ({...n})),
            });
        },
        [state.deletingNumber]
    );

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "not-found") {
            dispatch({type: "SET_POPUP_TEXT", payload: "Элемент не найден!"});
            cleanupInterval();
            algorithmDispatch({type: "SET_DONE", payload: true});
            return;
        }

        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, state.deletingNumber),
                });
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                break;
            case "go-left":
            case "go-right":
                break;
            case "delete-leaf":
                dispatch({type: "SET_POPUP_TEXT", payload: "Удаляем лист"});
                dispatch({type: "SET_DELETED_NODE", payload: value.node});
                break;
            case "delete-single-child":
                dispatch({type: "SET_POPUP_TEXT", payload: "Удаляем узел с одним ребёнком"});
                dispatch({type: "SET_DELETED_NODE", payload: value.node});
                break;
            case "replace-with-successor":
                dispatch({type: "SET_POPUP_TEXT", payload: "Заменяем на преемника"});
                break;
            case "deleted":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент удалён!"});
                dispatch({type: "SET_DELETED_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                dispatch({type: "SET_BST_NODES", payload: bstBfs(value.node)});

                algorithmDispatch({type: "SET_DONE", payload: true});
                break;
        }
    }

    function nodeStateFunc(id: string) {
        if (state.deletedNode?.id === id) return "border-red-400";
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
        dispatch({type: "SET_DELETING_NUMBER", payload: value});
    }

    function onOperation() {
        startAlgorithm(state.bstNodes[0]);
    }

    return (
        <div className="flex flex-col items-start h-max">
            <h1 className="font-bold text-3xl text-center mb-10 self-center">BST Delete</h1>
            <BSTSearchInput
                onOperation={onOperation}
                operationLabel="Введите значение для удаления"
                onOperationChange={onOperationChange}
            />
            <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
                <PopupText id={state.popupText} text={state.popupText}/>
                {state.bstNodes.length ? (
                    <BinarySearchTree
                        nodeStateFunc={nodeStateFunc}
                        root={state.bstNodes[0]}
                        size={state.bstNodes.length}
                    />
                ) : null}
                <EndAlgorithm isDone={algorithmState.isDone} bottom="bottom-12"/>
            </div>
            <Controls
                stepBack={stepBack}
                stepForward={stepForward}
                toggleAlgorithm={toggleAlgorithm}
                firstState={algorithmState.firstState}
                isPaused={algorithmState.isPaused}
                isDone={algorithmState.isDone}
            />
        </div>
    );
}

export default BSTDelete;