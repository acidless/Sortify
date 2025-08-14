import type {RefObject} from "react";
import type {BSTOperationAction, BSTOperationState} from "../../hooks/useBSTOperation.ts";
import BSTAlgorithm from "./BSTAlgorithm.tsx";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";
import {bstSearch} from "../../algorithms/bstSearch.ts";

function BSTSearch() {
    function setAlgorithmState(value: any, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) {
        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, stateRef.current.targetNumber)
                });
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                break;
            case "found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент найден!"});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
            case "not-found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент не найден!"});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
        }
    }

    return <BSTAlgorithm algo={bstSearch} setAlgorithmState={setAlgorithmState}
                         startBST={bstBfs(generateRandomBST(8, 0, 20))} title="BST Search"></BSTAlgorithm>
}

export default BSTSearch;