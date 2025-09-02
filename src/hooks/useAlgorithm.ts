import {type RefObject, useEffect, useReducer, useRef} from "react";
import useAlgorithmInterval from "./useAlgorithmInterval.ts";

export type BaseAlgorithmState = {
    isDone?: boolean;
    isPaused: boolean;
    firstState: boolean;
}

type Action =
    | { type: "SET_DONE"; payload: boolean | undefined }
    | { type: "SET_PAUSED"; payload: boolean }
    | { type: "SET_FIRST_STATE"; payload: boolean };

const initialState: BaseAlgorithmState = {
    isDone: false,
    isPaused: false,
    firstState: true
};

function reducer(state: BaseAlgorithmState, action: Action): BaseAlgorithmState {
    switch (action.type) {
        case "SET_DONE":
            return {...state, isDone: action.payload};
        case "SET_PAUSED":
            return {...state, isPaused: action.payload};
        case "SET_FIRST_STATE":
            return {...state, firstState: action.payload};
        default:
            return state;
    }
}


function useAlgorithm<I, A, H extends Partial<BaseAlgorithmState>>(algorithm: (input: I) => Generator<A, void, unknown>, updateAllData: (data: H) => void, onStart: (data: I, historyRef: RefObject<Array<H>>) => void, onStep: (data: A, historyRef: RefObject<Array<H>>) => void, waitTime: number = 1000) {
    const [intervalRef, cleanupInterval] = useAlgorithmInterval();
    const generatorRef = useRef<Generator<A, void, unknown> | undefined>(undefined);
    const historyRef = useRef<Array<H>>([]);
    const currentStep = useRef(0);

    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<BaseAlgorithmState>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);


    function startAlgorithm(input: I) {
        if (!input) return;

        cleanupInterval();
        dispatch({type: "SET_DONE", payload: false});
        dispatch({type: "SET_PAUSED", payload: false});

        generatorRef.current = algorithm(input);
        currentStep.current = 0;

        onStart(input, historyRef);

        runStep();
        intervalRef.current = setInterval(() => {
            runStep();
        }, waitTime);
    }

    function runStep() {
        if (currentStep.current + 1 < historyRef.current.length) {
            const next = historyRef.current[++currentStep.current];

            updateAllData(next);

            dispatch({type: "SET_DONE", payload: next.isDone});
            dispatch({type: "SET_FIRST_STATE", payload: false});

            return;
        }

        if (!generatorRef.current) return;

        const {done, value} = generatorRef.current.next();

        if (!done && value) {
            onStep(value, historyRef);
            currentStep.current++;

            dispatch({type: "SET_FIRST_STATE", payload: false});
        }
    }

    function stepBack() {
        if (currentStep.current < 0) return;

        dispatch({type: "SET_DONE", payload: false});
        dispatch({type: "SET_PAUSED", payload: true});
        cleanupInterval();

        const prev = historyRef.current[currentStep.current];
        currentStep.current = Math.max(0, currentStep.current - 1);
        if (currentStep.current === 0) {
            dispatch({type: "SET_FIRST_STATE", payload: true});
        }

        updateAllData(prev);
    }

    function toggleAlgorithm() {
        if (state.isPaused) {
            runStep();
            intervalRef.current = setInterval(() => {
                runStep();
            }, waitTime);
        } else {
            cleanupInterval();
        }


        dispatch({type: "SET_PAUSED", payload: !state.isPaused});
    }

    function stepForward() {
        runStep();
        dispatch({type: "SET_PAUSED", payload: true});
        cleanupInterval();
    }

    return {
        startAlgorithm,
        stepBack,
        toggleAlgorithm,
        algorithmState: state,
        algorithmDispatch: dispatch,
        algorithmStateRef: stateRef,
        stepForward,
        cleanupInterval
    };
}

export default useAlgorithm;