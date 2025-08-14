import {type GraphTraversalAction, type GraphTraversalState} from "../../hooks/useGraphTraversal.ts";
import {bfs} from "../../algorithms/bfs.ts";
import GraphTraversal from "./GraphTraversal.tsx";

function BFS() {
    function setAlgorithmState(value: any, dispatch: React.Dispatch<GraphTraversalAction>, stateRef: React.RefObject<GraphTraversalState>) {
        switch (value.type) {
            case "enqueue":
                dispatch({
                    type: "SET_QUEUED_NODES",
                    payload: [...stateRef.current.queuedNodes, value.node],
                });
                dispatch({type: "SET_POPUP_TEXT", payload: `Добавляем ${value.node.value} в очередь`});
                break;
            case "visit": {
                const visitedNodes = new Set(stateRef.current.visitedNodes);
                visitedNodes.add(value.node.id);
                dispatch({type: "SET_VISITED_NODES", payload: visitedNodes});
                dispatch({type: "SET_POPUP_TEXT", payload: `Посещаем ${value.node.value}`});
                break;
            }
        }
    }

    return <GraphTraversal algorithm={bfs} setAlgorithmState={setAlgorithmState} title="BFS (Breadth-first search)"/>;
}

export default BFS;