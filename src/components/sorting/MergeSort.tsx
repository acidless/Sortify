import {useContext, useEffect, useReducer, useRef} from "react";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {mergeSort, type MergeSortAction} from "../../algorithms/mergeSort.ts";
import type {SampleArray} from "../../types.ts";
import {TheoryContext} from "../../TheoryContext.ts";
import Tabs from "../Tabs.tsx";

type State = {
    leftPart: SampleArray | undefined;
    rightPart: SampleArray | undefined;
    checkingIndices: number[] | undefined;
    overwriteIndex: number | undefined;
};

const initialState: State = {
    leftPart: undefined,
    rightPart: undefined,
    checkingIndices: undefined,
    overwriteIndex: undefined
};

type Action =
    { type: "SET_LEFT_PART", payload: SampleArray | undefined } |
    { type: "SET_RIGHT_PART", payload: SampleArray | undefined } |
    { type: "SET_CHECKING_INDICES", payload: number[] | undefined } |
    { type: "SET_OVERWRITE_INDEX", payload: number | undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_LEFT_PART":
            return {...state, leftPart: action.payload};
        case "SET_RIGHT_PART":
            return {...state, rightPart: action.payload};
        case "SET_CHECKING_INDICES":
            return {...state, checkingIndices: action.payload};
        case "SET_OVERWRITE_INDEX":
            return {...state, overwriteIndex: action.payload};
    }
}

function MergeSortTheory() {
    return <>
        <h3 className="mb-2">📌 Сортировка слиянием (Merge Sort)</h3>
        <p className="mb-6 text-base font-light leading-6">
            Сортировка слиянием — это эффективный алгоритм сортировки, который использует метод <span
            className="text-green-400">"разделяй и властвуй"</span>.
            Алгоритм рекурсивно делит массив на две половины, сортирует каждую половину, а затем <span
            className="text-green-400">объединяет</span> (сливает) отсортированные половины в один отсортированный
            массив.
            Это похоже на процесс сортировки книг по категориям: сначала вы делите книги на группы, сортируете каждую
            группу, а затем объединяете их в одну упорядоченную коллекцию.
        </p>

        <h4 className="mb-2 text-lg font-semibold">👍 Плюсы и 👎 Минусы</h4>
        <ul className="list-disc list-inside text-base font-light leading-6">
            <li>Стабильная сортировка (не меняет порядок равных элементов).</li>
            <li>Эффективна для больших массивов — гарантированная сложность O(n*logn).</li>
            <li className="text-red-400">Требует дополнительной памяти для слияния (O(n)).</li>
            <li className="text-red-400">Реализация сложнее, чем у простых сортировок (пузырьком или вставками).</li>
        </ul>
    </>
}

function MergeSortAsymptotics() {
    return <>
        <h3 className="mb-2">⏱ Сложность</h3>
        <table className="mb-2 text-base font-light leading-6 text-left border-collapse">
            <thead>
            <tr>
                <th className="border-neutral-700 border-1 p-2">Случай</th>
                <th className="border-neutral-700 border-1 p-2">Время</th>
            </tr>
            </thead>
            <tbody>
            <tr className="bg-green-900/40">
                <td className="border-neutral-700 border-1 p-2">Лучший (отсортированный массив)</td>
                <td className="border-neutral-700 border-1 p-2">O(n*logn)</td>
            </tr>
            <tr className="bg-yellow-900/40">
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(n*logn)</td>
            </tr>
            <tr className="bg-red-900/40">
                <td className="border-neutral-700 border-1 p-2">Худший</td>
                <td className="border-neutral-700 border-1 p-2">O(n*logn)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(n)</p>
    </>
}

function MergeSortAlgorithm() {
    return <>
        <h3 className="mb-2">🧠 Пошаговое объяснение</h3>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>⚠️ Если массив содержит один или ноль элементов, он уже отсортирован.</li>
            <li>↔️ Разделите массив на две равные части.</li>
            <li>🔁 Рекурсивно отсортируйте каждую половину.</li>
            <li>🤜🤛 Объедините (слейте) две отсортированные половины в один отсортированный массив.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure mergeSort(A)
    if len(A) <= 1 then
        return A
    mid = len(A) / 2
    left = mergeSort(A[0:mid])
    right = mergeSort(A[mid:len(A)])
    return merge(left, right)

procedure merge(left, right)
    result = []
    while !left.empty() 
        and !right.empty() do
        
        if left[0] <= right[0] then
            append left[0] to result
            remove left[0] from left
        else
            append right[0] to result
            remove right[0] from right
            
    while !left.empty() do
        append left[0] to result
        remove left[0] from left
        
    while !right.empty() do
        append right[0] to result
        remove right[0] from right
    return result
end procedure`}
      </code>
    </pre>
    </>
}

function MergeSortText() {
    return <Tabs tabs={[{content: MergeSortTheory(), name: "Теория"}, {
        content: MergeSortAsymptotics(),
        name: "Сложность"
    }, {content: MergeSortAlgorithm(), name: "Шаги"}]}>
    </Tabs>
}

function MergeSort() {
    const {setTheory} = useContext(TheoryContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        setTheory(<MergeSortText/>);
    }, []);

    function makeSnapshot() {
        return {
            checkingIndices: stateRef.current.checkingIndices,
            overwriteIndex: stateRef.current.overwriteIndex,
            leftPart: stateRef.current.leftPart,
            rightPart: stateRef.current.rightPart
        };
    }

    function updateData(next: State) {
        dispatch({type: "SET_LEFT_PART", payload: next.leftPart});
        dispatch({type: "SET_RIGHT_PART", payload: next.rightPart});
        dispatch({type: "SET_CHECKING_INDICES", payload: next.checkingIndices});
        dispatch({type: "SET_OVERWRITE_INDEX", payload: next.overwriteIndex});
    }

    function setAlgorithmState(action: MergeSortAction) {
        switch (action.type) {
            case "slice":
                dispatch({type: "SET_LEFT_PART", payload: action.left});
                dispatch({type: "SET_RIGHT_PART", payload: action.right});
                dispatch({type: "SET_CHECKING_INDICES", payload: undefined});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: undefined});
                break;
            case "compare":
                dispatch({type: "SET_CHECKING_INDICES", payload: action.indices});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: undefined});
                break;
            case "overwrite":
                dispatch({type: "SET_CHECKING_INDICES", payload: undefined});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: action.index});
                break;
            case "done":
                dispatch({type: "SET_CHECKING_INDICES", payload: undefined});
                dispatch({type: "SET_OVERWRITE_INDEX", payload: undefined});
                break;
        }
    }

    function nodeClassName(index: number, key: number) {
        if (index === state.overwriteIndex) return "border-green-400";
        if (state.checkingIndices?.includes(index)) return "border-yellow-400";
        if (state.leftPart?.filter(item => item.key === key).length) return "border-blue-400";
        if (state.rightPart?.filter(item => item.key === key).length) return "border-orange-400";
    }

    return <SortingAlgorithm
        name="Merge Sort"
        algorithm={mergeSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={state.checkingIndices}
        classNameFn={nodeClassName}
    ></SortingAlgorithm>;
}

export default MergeSort;