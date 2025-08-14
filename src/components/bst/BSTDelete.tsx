import {type RefObject} from "react";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";
import {bstDelete} from "../../algorithms/bstDelete.ts";
import BSTAlgorithm from "./BSTAlgorithm.tsx";
import type {BSTOperationAction, BSTOperationState} from "../../hooks/useBSTOperation.ts";

function BSTDelete() {
    function setAlgorithmState(value: any, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) {
        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, stateRef.current.targetNumber),
                });
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                break;
            case "go-left":
            case "go-right":
                break;
            case "delete-leaf":
                dispatch({type: "SET_POPUP_TEXT", payload: "Удаляем лист"});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                break;
            case "delete-single-child":
                dispatch({type: "SET_POPUP_TEXT", payload: "Удаляем узел с одним ребёнком"});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                break;
            case "replace-with-successor":
                dispatch({type: "SET_POPUP_TEXT", payload: "Заменяем на преемника"});
                break;
            case "found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент удалён!"});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                dispatch({type: "SET_BST_NODES", payload: bstBfs(value.node)});
                break;
        }
    }

    return <BSTAlgorithm algo={bstDelete} setAlgorithmState={setAlgorithmState}
                         startBST={bstBfs(generateRandomBST(8, 0, 20))} title="BST Delete"></BSTAlgorithm>
}

export default BSTDelete;