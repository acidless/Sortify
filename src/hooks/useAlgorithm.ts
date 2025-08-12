import {type RefObject, useEffect, useReducer, useRef} from "react";
import useAlgorithmInterval from "./useAlgorithmInterval.ts";

type State = {
    isDone: boolean;
    isPaused: boolean;
    firstState: boolean;
}

type Action =
    | { type: "SET_DONE"; payload: boolean }
    | { type: "SET_PAUSED"; payload: boolean }
    | { type: "SET_FIRST_STATE"; payload: boolean };

const initialState: State = {
    isDone: false,
    isPaused: false,
    firstState: true
};

function reducer(state: State, action: Action): State {
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


function useAlgorithm<I, A>(algorithm: (input: I) => Generator<A, void, unknown>, updateAllData: (data: any) => void, onStart: (data: I, historyRef: RefObject<Array<any>>) => void, onStep: (data: A, historyRef: RefObject<Array<any>>) => void) {
    const [intervalRef, cleanupInterval] = useAlgorithmInterval();
    const generatorRef = useRef<Generator<A, void, unknown> | undefined>(undefined);
    const historyRef = useRef<Array<any>>([]);
    const currentStep = useRef(0);

    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

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
        intervalRef.current = setInterval(() => {
            runStep();
        }, 1000);
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
            intervalRef.current = setInterval(() => {
                runStep();
            }, 1000);
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