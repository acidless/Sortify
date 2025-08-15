import {useState} from "react";

function Theory() {
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`orientation-vertical absolute ${isOpen ? "right-96" : "right-0"} top-1/5 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 font-bold text-xl py-1 px-6 rounded-l-xl cursor-pointer`}>Теория
        </button>
        <div
            className={`absolute ${isOpen ? "right-0" : "-right-full"} transition-all h-full w-96 top-0 bg-neutral-900 border-l-1 border-neutral-600 duration-300 font-bold text-xl py-1 px-6 overflow-auto`}>
            <h3 className="mb-6">📌 Сортировка пузырьком (Bubble Sort)</h3>

            <h4 className="mb-2">💡 Идея алгоритма</h4>
            <p className="mb-4 text-base font-light leading-6">
                Пузырьковая сортировка — это простой алгоритм сортировки, который многократно проходит по списку,
                сравнивает соседние элементы и меняет их местами, если они стоят в неправильном порядке.
                На каждой итерации "всплывает" (перемещается в конец массива) самый большой из оставшихся элементов —
                как пузырёк в воде.
            </p>

            <h4 className="mb-2">⏱ Сложность</h4>
            <table className="mb-4 text-base font-light leading-6">
                <thead>
                <tr>
                    <th>Случай</th>
                    <th>Время</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Худший</td>
                    <td>O(n²)</td>
                </tr>
                <tr>
                    <td>Средний</td>
                    <td>O(n²)</td>
                </tr>
                <tr>
                    <td>Лучший (отсортированный массив)</td>
                    <td>O(n)</td>
                </tr>
                </tbody>
            </table>
            <p className="mb-4 text-base font-light leading-6">Память O(1)</p>

            <h4 className="mb-2">🧠 Пошаговое объяснение</h4>
            <ol className="list-decimal list-inside mb-4 text-base font-light leading-6">
                <li>Проходим по массиву слева направо.</li>
                <li>Сравниваем текущий элемент с следующим.</li>
                <li>Если текущий элемент больше следующего — меняем их местами.</li>
                <li>После прохода последний элемент гарантированно на своём месте.</li>
                <li>Повторяем для оставшейся части массива (не включая уже отсортированные элементы в конце).</li>
                <li>Если за проход не было обменов — массив уже отсортирован (оптимизация).</li>
            </ol>

            <h4 className="mb-2">📄 Псевдокод</h4>
            <pre className="bg-gray-900 p-4 rounded-md text-sm font-light">
              <code>
                {`procedure bubbleSort(A)
    n = длина(A)
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
        </div>
    </>
}

export default Theory;