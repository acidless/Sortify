import type {GraphNode, GraphTraversalAction} from "../types.ts";
import {type RefObject, useCallback, useEffect, useReducer, useRef} from "react";
import {generateRandomGraph} from "../algorithms/graphUtils.ts";
import useAlgorithm, {type BaseAlgorithmState} from "./useAlgorithm.ts";

export type GraphTraversalState = Partial<BaseAlgorithmState> & {
    graph: GraphNode<number>[];
    queuedNodes: GraphNode<number>[];
    visitedNodes: Set<string>;
    popupText: string;
};

export type TraversalAction =
    | { type: "SET_GRAPH"; payload: GraphNode<number>[] }
    | { type: "SET_QUEUED_NODES"; payload: GraphNode<number>[] }
    | { type: "SET_VISITED_NODES"; payload: Set<string> }
    | { type: "SET_POPUP_TEXT"; payload: string };

const initialState: GraphTraversalState = {
    graph: [],
    queuedNodes: [],
    visitedNodes: new Set(),
    popupText: "",
};

function reducer(state: GraphTraversalState, action: TraversalAction): GraphTraversalState {
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

export type GraphHistoryState = Omit<GraphTraversalState, "graph">;

export function useGraphTraversal(algo: (root: GraphNode<number>, graph: GraphNode<number>[]) => Generator<GraphTraversalAction, void, unknown>,
                                  setAlgorithmState: (state: GraphTraversalAction, dispatch: React.Dispatch<TraversalAction>, stateRef: RefObject<GraphHistoryState>) => void) {
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

    const onStart = useCallback((_input: GraphNode<number>, historyRef: RefObject<Array<GraphHistoryState>>) => {
        historyRef.current.push({
            queuedNodes: [],
            visitedNodes: new Set(),
            popupText: "",
        });
    }, []);

    const updateAll = useCallback((next: GraphTraversalState) => {
        dispatch({type: "SET_QUEUED_NODES", payload: next.queuedNodes});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
        dispatch({type: "SET_VISITED_NODES", payload: new Set(next.visitedNodes)});
    }, []);

    const onStep = useCallback((value: GraphTraversalAction, historyRef: RefObject<Array<GraphHistoryState>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            queuedNodes: stateRef.current.queuedNodes,
            isDone: algorithmData.algorithmStateRef.current.isDone,
            popupText: stateRef.current.popupText,
            visitedNodes: new Set(stateRef.current.visitedNodes)
        });
    }, []);

    function setAlgorithmStateWrapper(value: GraphTraversalAction) {
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
        dispatch,
        nodeStateFunc
    };
}