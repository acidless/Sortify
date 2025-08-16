import {useContext, useEffect, useReducer, useRef} from "react";
import {insertionSort, type InsertionSortAction} from "../../algorithms/insertionSort.ts";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {TheoryContext} from "../../TheoryContext.ts";

type State = {
    pivotIndex: number | undefined,
    checkingIndex: number | undefined
};

const initialState: State = {
    pivotIndex: undefined,
    checkingIndex: undefined
};

type Action =
    { type: "SET_PIVOT_INDEX", payload: number | undefined } |
    { type: "SET_CHECKING_INDEX", payload: number | undefined };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PIVOT_INDEX":
            return {...state, pivotIndex: action.payload};
        case "SET_CHECKING_INDEX":
            return {...state, checkingIndex: action.payload};
        default:
            return state;
    }
}

function InsertionSortTheory() {
    return <>
        <h3 className="mb-6">📌 Сортировка вставками (Insertion Sort)</h3>

        <h4 className="mb-2">💡 Идея алгоритма</h4>
        <p className="mb-6 text-base font-light leading-6">
            Сортировка вставками — это простой алгоритм сортировки, который строит отсортированный массив поэлементно.
            Он проходит по массиву, беря один элемент за раз и вставляя его в правильную позицию в уже отсортированной
            части массива.
            Алгоритм напоминает способ, которым люди сортируют карточки: беря одну карточку, они вставляют её в нужное
            место среди уже отсортированных карточек.
        </p>

        <h4 className="mb-2">⏱ Сложность</h4>
        <table className="mb-2 text-base font-light leading-6 text-left border-collapse">
            <thead>
            <tr>
                <th className="border-neutral-700 border-1 p-2">Случай</th>
                <th className="border-neutral-700 border-1 p-2">Время</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Худший</td>
                <td className="border-neutral-700 border-1 p-2">O(n²)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(n²)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Лучший (отсортированный массив)</td>
                <td className="border-neutral-700 border-1 p-2">O(n)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(1)</p>

        <h4 className="mb-2">🧠 Пошаговое объяснение</h4>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>Начинаем с второго элемента массива (первый элемент считается отсортированным).</li>
            <li>Сравниваем текущий элемент с предыдущими элементами в отсортированной части массива.</li>
            <li>Сдвигаем все элементы, которые больше текущего, вправо, чтобы освободить место для вставки.</li>
            <li>Вставляем текущий элемент на его правильную позицию в отсортированной части массива.</li>
            <li>Повторяем процесс для всех оставшихся элементов в массиве.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure insertionSort(A)
    n = len(A)
    for i = 1 to n - 1 do
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key do
            A[j + 1] = A[j]
            j = j - 1
        A[j + 1] = key
end procedure`}
      </code>
    </pre>
    </>
}

function InsertionSort() {
    const {setTheory} = useContext(TheoryContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef<State>(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        setTheory(<InsertionSortTheory/>);
    }, []);


    function makeSnapshot() {
        return {
            pivotIndex: stateRef.current.pivotIndex,
            checkingIndex: stateRef.current.checkingIndex
        };
    }

    function updateData(next: any) {
        dispatch({type: "SET_PIVOT_INDEX", payload: next.pivotIndex});
        dispatch({type: "SET_CHECKING_INDEX", payload: next.checkingIndex});
    }

    function setAlgorithmState(action: InsertionSortAction) {
        switch (action.type) {
            case "key":
                dispatch({type: "SET_PIVOT_INDEX", payload: action.index});
                dispatch({type: "SET_CHECKING_INDEX", payload: undefined});
                break;
            case "checking":
                dispatch({type: "SET_CHECKING_INDEX", payload: action.checkingIndex});
                break;
            case "insert":
            case "done":
                dispatch({type: "SET_CHECKING_INDEX", payload: undefined});
                dispatch({type: "SET_PIVOT_INDEX", payload: undefined});
                break;
        }
    }

    function nodeClassName(index: number) {
        if (state.pivotIndex === index) return "border-green-400";
        if (state.checkingIndex === index) return "border-yellow-400";
    }

    return <SortingAlgorithm
        name="Insertion Sort"
        algorithm={insertionSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={state.pivotIndex !== undefined && state.checkingIndex !== undefined ? [state.pivotIndex, state.checkingIndex] : undefined}
        classNameFn={nodeClassName}
    />;
}

export default InsertionSort;