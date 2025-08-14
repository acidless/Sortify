import {type RefObject} from "react";
import type {GraphNode} from "../../types.ts";
import PopupText from "../PopupText.tsx";
import Graph from "./Graph.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import Controls from "../Controls.tsx";
import {type GraphTraversalAction, type GraphTraversalState, useGraphTraversal} from "../../hooks/useGraphTraversal.ts";

type Props = {
    algorithm: (root: GraphNode, graph: GraphNode[]) => Generator<any, void, unknown>;
    setAlgorithmState: (state: any, dispatch: React.Dispatch<GraphTraversalAction>, stateRef: RefObject<GraphTraversalState>) => void;
    title: string;
}

const GraphTraversal = ({algorithm, setAlgorithmState, title}: Props) => {
    const {traversalState, useAlgorithmData, nodeStateFunc} = useGraphTraversal(algorithm, setAlgorithmState);

    return (
        <div className="flex flex-col items-start h-max flex-1">
            <h1 className="font-bold text-3xl text-center mb-10 self-center">{title}</h1>
            <div className="flex justify-center item-center w-full">
                {
                    traversalState.graph.length > 0 &&
                    <button className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer"
                            onClick={() => useAlgorithmData.startAlgorithm(traversalState.graph[0])}>Начать
                    </button>
                }
            </div>
            <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
                <PopupText id={traversalState.popupText} text={traversalState.popupText}/>
                <Graph nodes={traversalState.graph} nodeStateFunc={nodeStateFunc}/>
                <EndAlgorithm isDone={useAlgorithmData.algorithmState.isDone} bottom="bottom-12"/>
            </div>
            <Controls
                stepBack={useAlgorithmData.stepBack}
                stepForward={useAlgorithmData.stepForward}
                toggleAlgorithm={useAlgorithmData.toggleAlgorithm}
                firstState={useAlgorithmData.algorithmState.firstState}
                isPaused={useAlgorithmData.algorithmState.isPaused}
                isDone={useAlgorithmData.algorithmState.isDone}
            />
        </div>
    );
}

export default GraphTraversal;