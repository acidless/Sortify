import BinarySearchTree from "./BinarySearchTree.tsx";
import {type RefObject, useCallback, useRef, useState} from "react";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import type {BSTNode} from "../../types.ts";
import {bstSearch} from "../../algorhitms/bstSearch.ts";
import Controls from "../Controls.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import PopupText from "../PopupText.tsx";
import BSTInput from "./BSTInput.tsx";

const node2 = {
    value: 5,
    left: null,
    right: null,
    id: "node2"
};
const node3 = {
    value: 15,
    left: null,
    right: null,
    id: "node3"
};
const node1 = {
    value: 10,
    left: node2,
    right: node3,
    id: "node1"
};

function BSTSearch() {
    const [checkingNode, setCheckingNode] = useState<null | BSTNode>(null);
    const [foundNode, setFoundNode] = useState<null | BSTNode>(null);
    const [popupText, setPopupText] = useState<string>("");
    const [findingNumber, setFindingNumber] = useState<number>(0);

    const checkingNodeRef = useRef<null | BSTNode>(null);
    const foundNodeRef = useRef<null | BSTNode>(null);
    const popupTextRef = useRef<string>("");
    const findingNumberRef = useRef<number>(0);

    const algorithm = useCallback((input: BSTNode) => {
        return bstSearch(input, findingNumber);
    }, [findingNumber]);

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    function updateFindingNumber(number: number) {
        setFindingNumber(number);
        findingNumberRef.current = number;
    }

    function updatePopupText(newPopupText: string) {
        setPopupText(newPopupText);
        popupTextRef.current = newPopupText;
    }

    function updateCheckingNode(newCheckingNode: null | BSTNode) {
        setCheckingNode(newCheckingNode);
        checkingNodeRef.current = newCheckingNode;
    }

    function updateFoundNode(newFoundNode: null | BSTNode) {
        setFoundNode(newFoundNode);
        foundNodeRef.current = newFoundNode;
    }

    const onStart = useCallback((input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [{
            checkingNode: null,
            foundNode: null,
            isDone: false,
            popupText: ""
        }];
    }, []);

    const updateAll = useCallback((next: any) => {
        updateCheckingNode(next.checkingNode);
        updateFoundNode(next.foundNode);
        updatePopupText(next.popupText);
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: checkingNodeRef.current,
            foundNode: foundNodeRef.current,
            isDone: doneRef.current,
            popupText: popupTextRef.current
        });
    }, [findingNumber]);

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "not-found" || value.type === "found") {
            cleanupInterval();
            updateDone(true);
        }

        switch (value.type) {
            case "compare":
                updatePopupText(makeComparison(value.node.value, findingNumberRef.current));
                updateCheckingNode(value.node);
                updateFoundNode(null);
                break;
            case "found":
                updatePopupText(`Элемент найден!`);
                updateFoundNode(value.node);
                updateCheckingNode(null);
                break;
            case "not-found":
                updatePopupText(`Элемент не найден!`);
                updateFoundNode(null);
                updateCheckingNode(null);
                break;
        }
    }

    function nodeStateFunc(id: string) {
        if (foundNode?.id === id) return "border-green-400";
        if (checkingNode?.id === id) return "border-yellow-400";

        return "border-neutral-700";
    }

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

    function onNodeAdd(value: number) {
    }

    function onOperationChange(value: number) {
        updateFindingNumber(value);
    }

    function onOperation() {
        startAlgorithm(node1);
    }

    return <div className="h-full flex flex-col items-start">
        <h1 className="font-bold text-3xl text-center mb-10 self-center">BST Search</h1>
        <BSTInput onNodeAdd={onNodeAdd} onOperation={onOperation} operationLabel="Введите значение для поиска"
                  onOperationChange={onOperationChange}/>
        <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
            <PopupText id={popupText} text={popupText}/>
            <BinarySearchTree nodeStateFunc={nodeStateFunc} root={node1}></BinarySearchTree>
            <EndAlgorithm isDone={isDone} bottom="bottom-12"/>
        </div>
        <Controls stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                  firstState={firstState} isPaused={isPaused} isDone={isDone}></Controls>
    </div>
}

export default BSTSearch;