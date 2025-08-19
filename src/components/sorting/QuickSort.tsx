import {useContext, useEffect, useReducer, useRef} from "react";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {quickSort, type QuickSortAction} from "../../algorithms/quickSort.ts";
import type {SampleArray} from "../../types.ts";
import {TheoryContext} from "../../TheoryContext.ts";
import Tabs from "../Tabs.tsx";

type State = {
    pivotIndex: number | undefined;
    leftPart: SampleArray | undefined;
    rightPart: SampleArray | undefined;
    checkingIndices: number[] | undefined;
    swapIndices: number[] | undefined;
};

const initialState: State = {
    pivotIndex: undefined,
    leftPart: undefined,
    rightPart: undefined,
    checkingIndices: undefined,
    swapIndices: undefined
};

type Action =
    | { type: "SET_PIVOT", payload: number | undefined }
    | { type: "SET_LEFT", payload: SampleArray | undefined }
    | { type: "SET_RIGHT", payload: SampleArray | undefined }
    | { type: "SET_CHECKING", payload: number[] | undefined }
    | { type: "SET_SWAP", payload: number[] | undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PIVOT":
            return {...state, pivotIndex: action.payload};
        case "SET_LEFT":
            return {...state, leftPart: action.payload};
        case "SET_RIGHT":
            return {...state, rightPart: action.payload};
        case "SET_CHECKING":
            return {...state, checkingIndices: action.payload};
        case "SET_SWAP":
            return {...state, swapIndices: action.payload};
        default:
            return state;
    }
}

function QuickSortTheory() {
    return <>
        <h3 className="mb-2">📌 Быстрая сортировка (Quick Sort)</h3>
        <p className="mb-6 text-base font-light leading-6">
            Быстрая сортировка — это эффективный алгоритм сортировки, который также использует метод <span
            className="text-green-400">"разделяй и властвуй"</span>.
            Алгоритм выбирает <span className="text-green-400">опорный элемент (pivot)</span> из массива и разделяет
            остальные элементы на две группы: элементы,
            меньшие опорного, и элементы, большие опорного.
            Затем он рекурсивно сортирует обе группы. Этот процесс продолжается, пока массив не будет отсортирован.
            Быстрая сортировка часто сравнивается с процессом сортировки карт: вы берете одну карту (опорный элемент) и
            делите остальные карты на две группы — те, что меньше, и те, что больше.
        </p>

        <h4 className="mb-2 text-lg font-semibold">👍 Плюсы и 👎 Минусы</h4>
        <ul className="list-disc list-inside text-base font-light leading-6">
            <li>Очень быстрая на большинстве случайных массивов — средняя сложность O(n log n).</li>
            <li>Не требует большого дополнительного объёма памяти (O(log n) на стек рекурсии).</li>
            <li className="text-red-400">Худший случай O(n²), если плохо выбирать опорный элемент.</li>
            <li className="text-red-400">Рекурсивная реализация может привести к переполнению стека на очень больших
                массивах.
            </li>
        </ul>
    </>
}

function QuickSortAsymptotics() {
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
                <td className="border-neutral-700 border-1 p-2">O(n²)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(logn)</p>
    </>
}

function QuickSortAlgorithm() {
    return <>
        <h3 className="mb-2">🧠 Пошаговое объяснение</h3>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>⚠️ Если массив содержит один или ноль элементов, он уже отсортирован.</li>
            <li>🩼 Выберите опорный элемент из массива.</li>
            <li>↔️ Разделите массив на две части: элементы меньше опорного и элементы больше опорного.</li>
            <li>🔁 Рекурсивно отсортируйте обе части.</li>
            <li>🤜🤛 Объедините отсортированные части, чтобы получить окончательный отсортированный массив.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure quickSort(A, low, high)
    if low >= high then
        return
        
    pivotIndex = partition(A, low, high)
    quickSort(A, low, pivotIndex - 1)
    quickSort(A, pivotIndex + 1, high)

procedure partition(A, low, high)
    pivot = A[high]
    i = low - 1
    for j = low to high - 1 do
        if A[j] < pivot then
            i = i + 1
            swap A[i] with A[j]
    swap A[i + 1] with A[high]
    return i + 1
end procedure`}
      </code>
    </pre>
    </>
}

function QuickSortText() {
    return <Tabs tabs={[{content: QuickSortTheory(), name: "Теория"}, {
        content: QuickSortAsymptotics(),
        name: "Сложность"
    }, {content: QuickSortAlgorithm(), name: "Шаги"}]}>
    </Tabs>
}

function QuickSort() {
    const {setTheory} = useContext(TheoryContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        setTheory(<QuickSortText/>);
    }, []);

    function makeSnapshot() {
        return {
            checkingIndices: stateRef.current.checkingIndices,
            pivotIndex: stateRef.current.pivotIndex,
            leftPart: stateRef.current.leftPart,
            rightPart: stateRef.current.rightPart,
            swapIndices: stateRef.current.swapIndices
        };
    }

    function updateData(next: any) {
        dispatch({type: "SET_LEFT", payload: next.leftPart});
        dispatch({type: "SET_RIGHT", payload: next.rightPart});
        dispatch({type: "SET_CHECKING", payload: next.indices});
        dispatch({type: "SET_PIVOT", payload: next.pivotIndex});
        dispatch({type: "SET_SWAP", payload: next.swapIndices});
    }

    function setAlgorithmState(action: QuickSortAction) {
        switch (action.type) {
            case "partition":
                dispatch({type: "SET_PIVOT", payload: action.pivotIndex});
                dispatch({type: "SET_LEFT", payload: action.left});
                dispatch({type: "SET_RIGHT", payload: action.right});
                dispatch({type: "SET_CHECKING", payload: undefined});
                dispatch({type: "SET_SWAP", payload: undefined});
                break;
            case "compare":
                dispatch({type: "SET_CHECKING", payload: action.indices});
                dispatch({type: "SET_SWAP", payload: undefined});
                break;
            case "swap":
                dispatch({type: "SET_SWAP", payload: action.indices});
                dispatch({type: "SET_CHECKING", payload: undefined});
                break;
            case "done":
                dispatch({type: "SET_PIVOT", payload: undefined});
                dispatch({type: "SET_CHECKING", payload: undefined});
                dispatch({type: "SET_SWAP", payload: undefined});
                break;
        }
    }

    function nodeClassName(index: number, key: number) {
        if (index === state.pivotIndex) return "border-red-400";
        if (state.swapIndices?.includes(index)) return "border-green-400";
        if (state.checkingIndices?.includes(index)) return "border-yellow-400";
        if (state.leftPart?.some(item => item.key === key)) return "border-blue-400";
        if (state.rightPart?.some(item => item.key === key)) return "border-orange-400";
    }

    return <SortingAlgorithm
        name="Quick Sort"
        algorithm={quickSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={state.checkingIndices}
        classNameFn={nodeClassName}
    />;
}

export default QuickSort;
