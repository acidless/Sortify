import BSTSearchInput from "./BSTInput.tsx";
import PopupText from "../PopupText.tsx";
import BinarySearchTree from "./BinarySearchTree.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import Controls from "../Controls.tsx";
import {type BSTOperationAction, type BSTOperationState, useBSTOperation} from "../../hooks/useBSTOperation.ts";
import type {BSTNode} from "../../types.ts";
import {type RefObject, useState} from "react";

type Props = {
    algo: (input: BSTNode, target: number) => Generator<any, void, unknown>,
    setAlgorithmState: (state: any, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) => void,
    startBST: BSTNode[],
    title: string
}

const BSTAlgorithm = ({algo, setAlgorithmState, startBST, title}: Props) => {
    const [bst, setBST] = useState(startBST);
    const {
        onOperation,
        onOperationChange,
        nodeStateFunc,
        useAlgorithmData,
        state
    } = useBSTOperation(algo, setAlgorithmState, bst);

    return <div className="flex flex-col items-start h-max">
        <h1 className="font-bold text-3xl text-center mb-10 self-center">{title}</h1>
        <BSTSearchInput setBST={setBST} onOperation={onOperation} operationLabel="Введите значение для поиска"
                        onOperationChange={onOperationChange}/>
        <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
            <PopupText id={state.popupText} text={state.popupText}/>
            {state.bstNodes.length ? <BinarySearchTree nodeStateFunc={nodeStateFunc} root={state.bstNodes[0]}
                                                       size={state.bstNodes.length}></BinarySearchTree> : null}
            <EndAlgorithm isDone={useAlgorithmData.algorithmState.isDone} bottom="bottom-12"/>
        </div>
        <Controls stepBack={useAlgorithmData.stepBack} stepForward={useAlgorithmData.stepForward}
                  toggleAlgorithm={useAlgorithmData.toggleAlgorithm}
                  firstState={useAlgorithmData.algorithmState.firstState}
                  isPaused={useAlgorithmData.algorithmState.isPaused}
                  isDone={useAlgorithmData.algorithmState.isDone}></Controls>
    </div>
}

export default BSTAlgorithm;