import {type GraphTraversalAction, type GraphTraversalState} from "../../hooks/useGraphTraversal.ts";
import GraphTraversal from "./GraphTraversal.tsx";
import {dfs} from "../../algorithms/dfs.ts";

function DFS() {
    function setAlgorithmState(value: any, dispatch: React.Dispatch<GraphTraversalAction>, stateRef: React.RefObject<GraphTraversalState>) {
        switch (value.type) {
            case "push":
                dispatch({
                    type: "SET_QUEUED_NODES",
                    payload: [...stateRef.current.queuedNodes, value.node],
                });
                dispatch({ type: "SET_POPUP_TEXT", payload: `Кладём ${value.node.value} в стек` });
                break;
            case "pop":
                dispatch({
                    type: "SET_QUEUED_NODES",
                    payload: stateRef.current.queuedNodes.filter(n => n.id !== value.node.id),
                });
                dispatch({ type: "SET_POPUP_TEXT", payload: `Достаём ${value.node.value} из стека` });
                break;
            case "visit": {
                const visitedNodes = new Set(stateRef.current.visitedNodes);
                visitedNodes.add(value.node.id);
                dispatch({ type: "SET_VISITED_NODES", payload: visitedNodes });
                dispatch({ type: "SET_POPUP_TEXT", payload: `Посещаем ${value.node.value}` });
                break;
            }
        }
    }

    return <GraphTraversal algorithm={dfs} setAlgorithmState={setAlgorithmState} title="DFS (Depth-first search)"/>;
}

export default DFS;
