import type {GraphNode} from "../types.ts";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import {generateRandomGraph} from "../algorithms/graphUtils.ts";
import useAlgorithm from "./useAlgorithm.ts";

export type GraphTraversalState = {
    graph: GraphNode[];
    queuedNodes: GraphNode[];
    visitedNodes: Set<string>;
    popupText: string;
};

export type GraphTraversalAction =
    | { type: "SET_GRAPH"; payload: GraphNode[] }
    | { type: "SET_QUEUED_NODES"; payload: GraphNode[] }
    | { type: "SET_VISITED_NODES"; payload: Set<string> }
    | { type: "SET_POPUP_TEXT"; payload: string };

const initialState: GraphTraversalState = {
    graph: [],
    queuedNodes: [],
    visitedNodes: new Set(),
    popupText: "",
};

function reducer(state: GraphTraversalState, action: GraphTraversalAction): GraphTraversalState {
    switch (action.type) {
        case "SET_GRAPH":
            return {...state, graph: action.payload};
        case "SET_QUEUED_NODES":
            return {...state, queuedNodes: action.payload};
        case "SET_VISITED_NODES":
            return {...state, visitedNodes: action.payload};
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        default:
            return state;
    }
}

export function useGraphTraversal(algo: (root: GraphNode, graph: GraphNode[]) => Generator<any, void, unknown>,
                           setAlgorithmState: (state: any, dispatch: React.Dispatch<GraphTraversalAction>, stateRef: RefObject<GraphTraversalState>) => void) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef(state);

    useEffect(() => {
        dispatch({type: "SET_GRAPH", payload: generateRandomGraph(6)});
    }, []);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const algorithm = useCallback(() => {
        return algo(state.graph[0], state.graph);
    }, [state.graph]);

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
        dispatch({type: "SET_VISITED_NODES", payload: new Set(next.visitedNodes)});
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            stackNodes: stateRef.current.queuedNodes,
            isDone: algorithmData.algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText,
            visitedNodes: new Set(stateRef.current.visitedNodes)
        });
    }, []);

    function setAlgorithmStateWrapper(value: any) {
        if (value.type === "done") {
            algorithmData.algorithmDispatch({type: "SET_DONE", payload: true});
            algorithmData.cleanupInterval();
            return;
        }

        setAlgorithmState(value, dispatch, stateRef);
    }

    function nodeStateFunc(id: string) {
        if (state.visitedNodes.has(id)) return "border-green-400";
        if (state.queuedNodes.find(n => n.id === id)) return "border-blue-400";

        return "border-neutral-700";
    }

    const algorithmData = useAlgorithm(algorithm, updateAll, onStart, onStep);

    return {
        traversalState: state,
        useAlgorithmData: algorithmData,
        nodeStateFunc
    };
}