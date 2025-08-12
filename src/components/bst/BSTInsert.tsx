import BinarySearchTree from "./BinarySearchTree.tsx";
import {type RefObject, useCallback, useRef, useState} from "react";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import type {BSTNode} from "../../types.ts";
import Controls from "../Controls.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import PopupText from "../PopupText.tsx";
import BSTSearchInput from "./BSTInput.tsx";
import {bstInsert} from "../../algorhitms/bstInsert.ts";

const node = {value: 10, id: crypto.randomUUID(), left: null, right: null};

function BSTSearch() {
    const [checkingNode, setCheckingNode] = useState<null | BSTNode>(null);
    const [insertedNode, setInsertedNode] = useState<null | BSTNode>(null);
    const [popupText, setPopupText] = useState<string>("");
    const [insertingNumber, setInsertingNumber] = useState<number>(0);
    const [bstNodes, setBstNodes] = useState<BSTNode[]>([node]);

    const checkingNodeRef = useRef<null | BSTNode>(null);
    const insertedNodeRef = useRef<null | BSTNode>(null);
    const popupTextRef = useRef<string>("");
    const insertingNumberRef = useRef<number>(0);
    const bstNodesRef = useRef<BSTNode[]>([node]);

    const algorithm = useCallback((input: BSTNode) => {
        return bstInsert(input, insertingNumber);
    }, [insertingNumber]);

    function makeComparison(a: number, b: number) {
        if (a > b) return `${a} > ${b}, идем влево`;
        if (a < b) return `${a} < ${b}, идем вправо`;
        return `${a} = ${b}`;
    }

    function updateBstNodes(nodes: BSTNode[]) {
        setBstNodes(nodes);
        bstNodesRef.current = nodes;
    }

    function updateInsertingNumber(number: number) {
        setInsertingNumber(number);
        insertingNumberRef.current = number;
    }

    function updatePopupText(newPopupText: string) {
        setPopupText(newPopupText);
        popupTextRef.current = newPopupText;
    }

    function updateCheckingNode(newCheckingNode: null | BSTNode) {
        setCheckingNode(newCheckingNode);
        checkingNodeRef.current = newCheckingNode;
    }

    function updateInsertedNode(newInsertedNode: null | BSTNode) {
        setInsertedNode(newInsertedNode);
        insertedNodeRef.current = newInsertedNode;
    }

    const onStart = useCallback((input: BSTNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current = [{
            checkingNode: null,
            insertedNode: null,
            isDone: false,
            popupText: "",
            nodes: bstNodesRef.current.map((node) => ({...node}))
        }];
    }, []);

    const updateAll = useCallback((next: any) => {
        updateCheckingNode(next.checkingNode);
        updateInsertedNode(next.insertedNode);
        updatePopupText(next.popupText);
        updateBstNodes(next.nodes)
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            checkingNode: checkingNodeRef.current,
            insertedNode: insertedNodeRef.current,
            isDone: doneRef.current,
            popupText: popupTextRef.current,
            nodes: bstNodesRef.current.map((node) => ({...node}))
        });
    }, [insertingNumber]);

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "not-found" || value.type === "found") {
            cleanupInterval();
            updateDone(true);
        }

        switch (value.type) {
            case "compare":
                updatePopupText(makeComparison(value.node.value, insertingNumberRef.current));
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
                setBstNodes([...bstNodes, value.node]);
                break;
        }
    }

    function nodeStateFunc(id: string) {
        if (insertedNode?.id === id) return "border-green-400";
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

    function onOperationChange(value: number) {
        updateInsertingNumber(value);
    }

    function onOperation() {
        startAlgorithm(bstNodes[0]);
    }

    return <div className="h-full flex flex-col items-start h-max">
        <h1 className="font-bold text-3xl text-center mb-10 self-center">BST Insert</h1>
        <BSTSearchInput onOperation={onOperation} operationLabel="Введите значение для вставки"
                        onOperationChange={onOperationChange}/>
        <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
            <PopupText id={popupText} text={popupText}/>
            {bstNodes.length ? <BinarySearchTree nodeStateFunc={nodeStateFunc} root={bstNodes[0]}
                                                 size={bstNodes.length}></BinarySearchTree> : null}
            <EndAlgorithm isDone={isDone} bottom="bottom-12"/>
        </div>
        <Controls stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                  firstState={firstState} isPaused={isPaused} isDone={isDone}></Controls>
    </div>
}

export default BSTSearch;