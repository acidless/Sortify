import {type RefObject, useCallback, useRef, useState} from "react";
import type {SampleArray} from "../../types.ts";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import ArrayInput from "./ArrayInput.tsx";
import ComparisionText from "./ComparisionText.tsx";
import ArrayNode from "./ArrayNode.tsx";
import Controls from "../Controls.tsx";

type Props = {
    algorithm: any;
    makeSnapshot: () => any;
    updateData: (next: any) => void;
    setAlgorithmState: (value: any) => void;
    checkingIndices?: number[];
    isNodeActive: (index: number) => boolean;
    isNodeChecking: (index: number) => boolean;
}

const SortingAlgorithm = ({
                              algorithm,
                              makeSnapshot,
                              updateData,
                              setAlgorithmState,
                              checkingIndices,
                              isNodeActive,
                              isNodeChecking
                          }: Props) => {
    const [array, setArray] = useState<SampleArray>([]);
    const arrayRef = useRef<SampleArray>(array);

    const onStart = useCallback((input: SampleArray, historyRef: RefObject<Array<any>>) => {
        updateArray(input);
        historyRef.current = [{
            array: structuredClone(arrayRef.current),
            isDone: false,
            ...makeSnapshot()
        }];
    }, []);

    const updateAll = useCallback((next: any) => {
        updateArray(next.array);
        updateData(next)
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        updateArray(value.array);
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            array: structuredClone(arrayRef.current),
            isDone: doneRef.current,
            ...makeSnapshot()
        });
    }, [makeSnapshot]);

    const {
        cleanupInterval,
        doneRef,
        stepBack,
        stepForward,
        toggleAlgorithm,
        isPaused,
        isDone,
        firstState,
        startAlgorithm,
        updateDone
    } = useAlgorithm(algorithm, updateAll, onStart, onStep);

    function updateArray(newArray: SampleArray) {
        setArray(newArray);
        arrayRef.current = newArray;
    }

    function handleInputChange() {
        updateDone(false);
        cleanupInterval();
    }

    function setAlgorithmStateWrapper(value: any) {
        if(value.type === "done") {
            cleanupInterval();
            updateDone(true);
        }

        setAlgorithmState(value);
    }

    return (
        <div className="h-full flex flex-col items-start">
            <h1 className="font-bold text-3xl text-center mb-10 self-center">Bubble sort</h1>
            <ArrayInput onSubmit={startAlgorithm} onInputChange={handleInputChange}></ArrayInput>
            <div className="flex-1 self-stretch flex flex-col justify-center items-center">
                <div className="relative max-w-full">
                    <ComparisionText array={array}
                                     indecies={checkingIndices}></ComparisionText>
                    <div className="flex gap-1 justify-center max-w-full overflow-x-auto overflow-y-hidden mb-10">
                        {array.map((item, index) => (
                            <ArrayNode key={item.key} value={item.value}
                                       active={isNodeActive(index)} checking={isNodeChecking(index)}></ArrayNode>
                        ))}
                    </div>
                    <div
                        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-max text-center transition-all duration-500 ${isDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <p className="text-xl text-green-400">Работа алгоритма завершена</p>
                    </div>
                </div>
            </div>
            <Controls stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                      firstState={firstState} isPaused={isPaused} isDone={isDone}></Controls>
        </div>
    );
}

export default SortingAlgorithm;