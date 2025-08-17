import {type RefObject, useCallback, useRef, useState} from "react";
import type {SampleArray} from "../../types.ts";
import useAlgorithm from "../../hooks/useAlgorithm.ts";
import ArrayInput from "./ArrayInput.tsx";
import ComparisionIndices from "../ComparisionIndices.tsx";
import ArrayNode from "./ArrayNode.tsx";
import Controls from "../Controls.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";

type Props = {
    name: string;
    algorithm: any;
    makeSnapshot: () => any;
    updateData: (next: any) => void;
    setAlgorithmState: (value: any) => void;
    checkingIndices?: number[];
    classNameFn: (index: number, key: number) => string | undefined;
    children?: (array: SampleArray) => JSX.Element;
}

const SortingAlgorithm = ({
                              name,
                              algorithm,
                              makeSnapshot,
                              updateData,
                              setAlgorithmState,
                              checkingIndices,
                              classNameFn,
                              children
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
        if(next.array) {
            updateArray(next.array);
        }
        updateData(next)
    }, []);

    const onStep = useCallback((value: any, historyRef: RefObject<Array<any>>) => {
        if(value.array) {
            updateArray(value.array);
        }

        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            array: structuredClone(arrayRef.current),
            isDone: algorithmStateRef.current.isDone,
            ...makeSnapshot()
        });
    }, [makeSnapshot]);

    const {
        cleanupInterval,
        stepBack,
        stepForward,
        toggleAlgorithm,
        startAlgorithm,
        algorithmDispatch,
        algorithmState,
        algorithmStateRef
    } = useAlgorithm(algorithm, updateAll, onStart, onStep);

    function updateArray(newArray: SampleArray) {
        setArray(newArray);
        arrayRef.current = newArray;
    }

    function handleInputChange() {
        algorithmDispatch({type: "SET_DONE", payload: false});
        cleanupInterval();
    }

    function setAlgorithmStateWrapper(value: any) {
        if(value.type === "done") {
            cleanupInterval();
            algorithmDispatch({type: "SET_DONE", payload: true});
        }

        setAlgorithmState(value);
    }

    return (
        <div className="h-full flex flex-col items-start flex-1">
            <h1 className="font-bold text-3xl text-center mb-10 self-center">{name}</h1>
            <ArrayInput onSubmit={startAlgorithm} onInputChange={handleInputChange}></ArrayInput>
            <div className="flex-1 self-stretch flex flex-col justify-center items-center">
                <div className="relative max-w-full">
                    <ComparisionIndices array={array}
                                        indecies={checkingIndices}></ComparisionIndices>
                    <div className="flex gap-1 justify-start max-w-full mb-10 overflow-x-auto overflow-y-hidden">
                        {array.map((item, index) => (
                            <ArrayNode key={item.key} value={item.value} className={classNameFn(index, item.key)}></ArrayNode>
                        ))}
                    </div>
                    <EndAlgorithm isDone={algorithmState.isDone}/>
                </div>
                {children && children(array)}
            </div>
            <Controls stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                      firstState={algorithmState.firstState} isPaused={algorithmState.isPaused} isDone={algorithmState.isDone}></Controls>
        </div>
    );
}

export default SortingAlgorithm;