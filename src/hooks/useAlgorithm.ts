import {type RefObject, useRef, useState} from "react";
import useAlgorithmInterval from "./useAlgorithmInterval.ts";


function useAlgorithm<I, A>(algorithm: (input: I) => Generator<A, void, unknown>, updateAllData: (data: any) => void, onStart: (data: I, historyRef: RefObject<Array<any>>) => void, onStep: (data: A, historyRef: RefObject<Array<any>>) => void) {
    const [intervalRef, cleanupInterval] = useAlgorithmInterval();

    const [isDone, setIsDone] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [firstState, setFirstState] = useState(true);

    const generatorRef = useRef<Generator<A, void, unknown> | undefined>(undefined);
    const historyRef = useRef<Array<any>>([]);
    const doneRef = useRef(isDone);
    const currentStep = useRef(0);

    function updateDone(newDone: boolean) {
        setIsDone(newDone);
        doneRef.current = newDone;
    }

    function startAlgorithm(input: I) {
        if (!input) return;

        cleanupInterval();
        updateDone(false);
        setIsPaused(false);

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
            updateDone(next.isDone);
            setFirstState(false);
            return;
        }

        if (!generatorRef.current) return;

        const {done, value} = generatorRef.current.next();

        if (!done && value) {
            onStep(value, historyRef);
            currentStep.current++;
            setFirstState(false);
        }
    }

    function stepBack() {
        if (currentStep.current < 0) return;

        updateDone(false);
        setIsPaused(true);
        cleanupInterval();

        const prev = historyRef.current[currentStep.current];
        currentStep.current = Math.max(0, currentStep.current - 1);
        if (currentStep.current === 0) {
            setFirstState(true);
        }

        updateAllData(prev);
    }

    function toggleAlgorithm() {
        if (isPaused) {
            intervalRef.current = setInterval(() => {
                runStep();
            }, 1000);
        } else {
            cleanupInterval();
        }

        setIsPaused(prev => !prev);
    }

    function stepForward() {
        runStep();
        setIsPaused(true);
        cleanupInterval();
    }

    return {startAlgorithm, stepBack, toggleAlgorithm, isDone, isPaused, stepForward, firstState, cleanupInterval, updateDone, doneRef};
}

export default useAlgorithm;