import BSTAlgorithm from "./BSTAlgorithm.tsx";
import type {BSTOperationAction, BSTOperationState} from "../../hooks/useBSTOperation.ts";
import type {RefObject} from "react";
import {bstInsert} from "../../algorithms/bstInsert.ts";

const node = {value: 10, id: crypto.randomUUID(), left: null, right: null};

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
            case "exists":
                dispatch({type: "SET_POPUP_TEXT", payload: `Элемент уже существует!`});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
            case "inserted":
                dispatch({type: "SET_POPUP_TEXT", payload: `Элемент вставлен!`});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                dispatch({type: "SET_BST_NODES", payload: [...stateRef.current.bstNodes, value.node]});
                break;
        }
    }

    return <BSTAlgorithm algo={bstInsert} setAlgorithmState={setAlgorithmState}
                                startBST={[node]} title="BST Insert"></BSTAlgorithm>
}

export default BSTSearch;