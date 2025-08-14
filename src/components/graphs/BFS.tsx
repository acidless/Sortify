import Graph from "./Graph.tsx";
import type {GraphNode} from "../../types.ts";
import {useReducer, useRef, useCallback, useEffect, type RefObject} from "react";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import {bfs} from "../../algorithms/bfs.ts";
import Controls from "../Controls.tsx";
import PopupText from "../PopupText.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";

export const testGraph: GraphNode[] = [
    {id: "A", value: 1, neighbors: ["B", "C"]},
    {id: "B", value: 2, neighbors: ["A", "D", "E"]},
    {id: "C", value: 3, neighbors: ["A", "F"]},
    {id: "D", value: 4, neighbors: ["B"]},
    {id: "E", value: 5, neighbors: ["B", "F"]},
    {id: "F", value: 6, neighbors: ["C", "E"]},
];

type State = {
    queuedNodes: GraphNode[];
    visitedNodes: Set<string>;
    popupText: string;
};

type Action =
    | { type: "SET_QUEUED_NODES"; payload: GraphNode[] }
    | { type: "SET_VISITED_NODES"; payload: Set<string> }
    | { type: "SET_POPUP_TEXT"; payload: string };

const initialState: State = {
    queuedNodes: [],
    visitedNodes: new Set(),
    popupText: "",
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_QUEUED_NODES":
            return {...state, queuedNodes: [...action.payload]};
        case "SET_VISITED_NODES": {
            return {...state, visitedNodes: action.payload};
        }
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        default:
            return state;
    }
}

function BFS() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const algorithm = useCallback(() => {
        return bfs(testGraph[0], testGraph);
    }, []);


    const onStart = useCallback((_input: GraphNode, historyRef: RefObject<Array<any>>) => {
        historyRef.current.push({
            queuedNodes: [],
            visitedNodes: new Set(),
            popupText: "",
        });
    }, []);

    const updateAll = useCallback((next: any) => {
        dispatch({type: "SET_QUEUED_NODES", payload: next.queuedNodes});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
        dispatch({type: "SET_VISITED_NODES", payload: new Set(next.nodes)});
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            queuedNodes: stateRef.current.queuedNodes,
            isDone: algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText,
            visitedNodes: structuredClone(stateRef.current.visitedNodes)
        });
    }, []);

    function setAlgorithmStateWrapper(value: any) {
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
                dispatch({ type: "SET_VISITED_NODES", payload: visitedNodes });
                dispatch({ type: "SET_POPUP_TEXT", payload: `Посещаем ${value.node.value}` });
                break;
            }
            case "done": {
                algorithmDispatch({type: "SET_DONE", payload: true});
                cleanupInterval();
                break;
            }
        }
    }

    function nodeStateFunc(id: string) {
        if (state.visitedNodes.has(id)) return "border-green-400";
        if (state.queuedNodes.find(n => n.id === id)) return "border-blue-400";

        return "border-neutral-700";
    }

    const {
        stepBack,
        stepForward,
        toggleAlgorithm,
        cleanupInterval,
        algorithmState,
        startAlgorithm,
        algorithmStateRef,
        algorithmDispatch
    } = useAlgorithm(algorithm, updateAll, onStart, onStep);

    return (
        <div className="flex flex-col items-start h-max flex-1">
            <h1 className="font-bold text-3xl text-center mb-10 self-center">BFS Visualizer</h1>
            <div className="flex justify-center item-center w-full">
                <button className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => startAlgorithm(testGraph[0])}>Начать
                </button>
            </div>
            <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
                <PopupText id={state.popupText} text={state.popupText}/>
                <Graph nodes={testGraph} nodeStateFunc={nodeStateFunc}/>
                <EndAlgorithm isDone={algorithmState.isDone} bottom="bottom-12"/>
            </div>
            <Controls
                stepBack={stepBack}
                stepForward={stepForward}
                toggleAlgorithm={toggleAlgorithm}
                firstState={algorithmState.firstState}
                isPaused={algorithmState.isPaused}
                isDone={algorithmState.isDone}
            />
        </div>
    );
}

export default BFS;