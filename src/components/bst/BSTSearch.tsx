import {type RefObject, useContext, useEffect} from "react";
import type {BSTOperationAction, BSTOperationState} from "../../hooks/useBSTOperation.ts";
import BSTAlgorithm from "./BSTAlgorithm.tsx";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";
import {bstSearch, type BSTSearchAction} from "../../algorithms/bstSearch.ts";
import {TheoryContext} from "../../TheoryContext.ts";
import Tabs from "../Tabs.tsx";

function BSTSearchTheory() {
    return <>
        <h3 className="mb-2">📌 Поиск в бинарном дереве поиска (Binary Search Tree, BST)</h3>
        <p className="mb-6 text-base font-light leading-6">
            Поиск в бинарном дереве поиска — это алгоритм для поиска узла в бинарном дереве, который использует свойства
            бинарного дерева поиска:
            для любого узла, все значения в левом поддереве <span className="text-green-400">меньше</span>, а все
            значения в правом поддереве <span className="text-green-400">больше</span> значения узла.
            Это позволяет эффективно находить узлы, начиная с корневого узла и рекурсивно или итеративно перемещаясь
            влево или вправо в зависимости от искомого значения.
        </p>

        <h4 className="mb-2 text-lg font-semibold">👍 Плюсы и 👎 Минусы</h4>
        <ul className="list-disc list-inside text-base font-light leading-6">
            <li>Быстрый поиск при сбалансированном дереве.</li>
            <li>Простая рекурсивная или итеративная реализация.</li>
            <li className="text-red-400">Худший случай при не сбалансированном дереве — O(n).</li>
            <li className="text-red-400">Требуется дополнительная память для рекурсии (если рекурсивная реализация).
            </li>
        </ul>
    </>
}

function BSTSearchAsymptotics() {
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
                <td className="border-neutral-700 border-1 p-2">O(1)</td>
            </tr>
            <tr className="bg-yellow-900/40">
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(logn)</td>
            </tr>
            <tr className="bg-red-900/40">
                <td className="border-neutral-700 border-1 p-2">Худший</td>
                <td className="border-neutral-700 border-1 p-2">O(h)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(h), где h - высота дерева</p>
    </>
}

function BSTSearchAlgorithm() {
    return <>
        <h3 className="mb-2">🧠 Пошаговое объяснение</h3>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>🫚 Начните с корневого узла.</li>
            <li>🔎 Сравните искомое значение с значением текущего узла.</li>
            <li>✅ Если значение совпадает, узел найден.</li>
            <li>⬅️ Если искомое значение меньше текущего узла, переходите в левое поддерево.</li>
            <li>➡️ Если искомое значение больше текущего узла, переходите в правое поддерево.</li>
            <li>🔁 Повторяйте шаги 2-5, пока не найдете узел или не достигнете конца дерева.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure searchBST(node, val)
    if node is null then
        return null
    if val == node.val then
        return node
    else if val < node.val then
        return searchBST(node.left, val)
    return searchBST(node.right, val)

procedure startSearchBST(root, val)
    return searchBST(root, val)
end procedure`}
      </code>
    </pre>
    </>
}

function BSTSearchText() {
    return <Tabs tabs={[{content: BSTSearchTheory(), name: "Теория"}, {
        content: BSTSearchAsymptotics(),
        name: "Сложность"
    }, {content: BSTSearchAlgorithm(), name: "Шаги"}]}>
    </Tabs>
}

function BSTSearch() {
    const {setTheory} = useContext(TheoryContext);

    useEffect(() => {
        setTheory(<BSTSearchText/>);
    }, []);

    function setAlgorithmState(value: BSTSearchAction, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) {
        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, stateRef.current.targetNumber)
                });
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                break;
            case "found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент найден!"});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
            case "not-found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент не найден!"});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
        }
    }

    return <BSTAlgorithm algo={bstSearch} setAlgorithmState={setAlgorithmState}
                         startBST={bstBfs(generateRandomBST(8, 0, 20))} title="BST Search"></BSTAlgorithm>
}

export default BSTSearch;