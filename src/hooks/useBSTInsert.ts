import {type RefObject, useCallback, useRef, useState} from "react";
import type {BSTNode} from "../types.ts";
import useAlgorithm from "./useAlgorithm.ts";
import {bstInsert} from "../algorhitms/bstSearch.ts";

function useBSTInsert(updatePopupText: (text: string) => void, updateCheckingNode: (node: null | BSTNode) => void, updateInsertedNode: (node: null | BSTNode) => void, makeComparison: (a: number, b: number) => string) {
    const [insertingNumber, setInsertingNumber] = useState<number>(0);

    const checkingNodeRef = useRef<null | BSTNode>(null);
    const foundNodeRef = useRef<null | BSTNode>(null);
    const popupTextRef = useRef<string>("");
    const findingNumberRef = useRef<number>(0);

    const algorithm = useCallback((input: BSTNode) => {
        return bstInsert(input, insertingNumber);
    }, [insertingNumber]);

    const onStart = useCallback((input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [{
            checkingNode: null,
            foundNode: null,
            isDone: false,
            popupText: ""
        }];
    }, []);

    const updateAll = useCallback((next: any) => {

    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: checkingNodeRef.current,
            foundNode: foundNodeRef.current,
            isDone: doneRef.current,
            popupText: popupTextRef.current
        });
    }, [insertingNumber]);

    const {
        cleanupInterval,
        doneRef,
        stepBack,
        stepForward,
        toggleAlgorithm,
        isPaused,
        isDone,
        firstState,
        startAlgorithm,
        updateDone
    } = useAlgorithm(algorithm, updateAll, onStart, onStep);

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "not-found" || value.type === "found") {
            cleanupInterval();
            updateDone(true);
        }

        switch (value.type) {
            case "compare":
                updatePopupText(makeComparison(value.node.value, findingNumberRef.current));
                updateCheckingNode(value.node);
                updateInsertedNode(null);
                break;
            case "exists":
                updatePopupText(`Элемент уже существует!`);
                updateInsertedNode(null);
                updateCheckingNode(null);
                break;
            case "inserted":
                updatePopupText(`Элемент вставлен!`);
                updateInsertedNode(value.node);
                updateCheckingNode(null);
                break;
        }
    }

    return {setInsertingNumber};
}

export default useBSTInsert;