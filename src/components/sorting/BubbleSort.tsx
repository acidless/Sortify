import {useContext, useEffect, useRef, useState} from "react";
import {bubbleSort, type BubbleSortAction} from "../../algorithms/bubbleSort.ts";
import SortingAlgorithm from "./SortingAlgorithm.tsx";
import {TheoryContext} from "../../TheoryContext.ts";
import Tabs from "../Tabs.tsx";

function BubbleSortTheory() {
    return <>
        <h3 className="mb-2">📌 Сортировка пузырьком (Bubble Sort)</h3>
        <p className="mb-6 text-base font-light leading-6">
            Пузырьковая сортировка — это простой алгоритм сортировки, который многократно проходит по списку,
            сравнивает <span className="text-green-400">соседние элементы</span> и меняет их местами, если они стоят в
            неправильном порядке.
            На каждой итерации <span className="text-green-400">"всплывает"</span> (перемещается в конец массива) самый
            большой из оставшихся элементов —
            как пузырёк в воде.
        </p>

        <h4 className="mb-2 text-lg font-semibold">👍 Плюсы и 👎 Минусы</h4>
        <ul className="list-disc list-inside text-base font-light leading-6">
            <li>Простая реализация (буквально несколько строк кода).</li>
            <li>Хорошо подходит для обучения основам алгоритмов сортировки.</li>
            <li className="text-red-400">Медленная на больших массивах (O(n²)).</li>
            <li className="text-red-400">Редко применяется в реальных системах.</li>
        </ul>
    </>
}

function BubbleSortAsymptotics() {
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
                <td className="border-neutral-700 border-1 p-2">O(n)</td>
            </tr>
            <tr className="bg-yellow-900/40">
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(n²)</td>
            </tr>
            <tr className="bg-red-900/40">
                <td className="border-neutral-700 border-1 p-2">Худший</td>
                <td className="border-neutral-700 border-1 p-2">O(n²)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(1)</p>
    </>
}

function BubbleSortAlgorithm() {
    return <>
        <h3 className="mb-2">🧠 Пошаговое объяснение</h3>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>➡️ Проходим по массиву слева направо.</li>
            <li>🔍 Сравниваем текущий элемент с следующим.</li>
            <li>🔄 Если текущий элемент больше следующего — меняем их местами.</li>
            <li>✅ После прохода последний элемент гарантированно на своём месте.</li>
            <li>🔁 Повторяем для оставшейся части массива (не включая уже отсортированные элементы в конце).</li>
            <li>⚠️ Если за проход не было обменов — массив уже отсортирован (оптимизация).</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
              <code>
                {`procedure bubbleSort(A)
    n = len(A)
    repeat
        swapped = false
        for i = 0 to n - 2 do
            if A[i] > A[i + 1] then
                swap A[i] and A[i + 1]
                swapped = true
        n = n - 1
    until not swapped
end procedure`}
              </code>
            </pre>
    </>
}

function BubbleSortText() {
    return <Tabs tabs={[{content: BubbleSortTheory(), name: "Теория"}, {
        content: BubbleSortAsymptotics(),
        name: "Сложность"
    }, {content: BubbleSortAlgorithm(), name: "Шаги"}]}>
    </Tabs>
}

function BubbleSort() {
    const {setTheory} = useContext(TheoryContext);
    const [checkingIndices, setCheckingIndices] = useState<number[] | undefined>();
    const checkingIndicesRef = useRef<number[] | undefined>(checkingIndices);

    useEffect(() => {
        setTheory(<BubbleSortText/>);
    }, [checkingIndices]);

    function makeSnapshot() {
        return {
            checkingIndices: checkingIndicesRef.current
        };
    }

    function updateCheckingIndices(newCheckingIndices: number[] | undefined) {
        setCheckingIndices(newCheckingIndices);
        checkingIndicesRef.current = newCheckingIndices;
    }

    function updateData(next: {checkingIndices: number[]}) {
        updateCheckingIndices(next.checkingIndices);
    }

    function setAlgorithmState(action: BubbleSortAction) {
        switch (action.type) {
            case "compare":
                updateCheckingIndices(action.indices);
                break;
            case "swap":
                updateCheckingIndices(undefined);
                break;
            case "done":
                updateCheckingIndices(undefined);
                break;
        }
    }

    function nodeClassName(index: number) {
        return checkingIndices?.includes(index) ? "border-green-400" : undefined;
    }

    return <SortingAlgorithm
        name="Bubble Sort"
        algorithm={bubbleSort}
        makeSnapshot={makeSnapshot}
        updateData={updateData}
        setAlgorithmState={setAlgorithmState}
        checkingIndices={checkingIndices}
        classNameFn={nodeClassName}
    />;
}

export default BubbleSort;