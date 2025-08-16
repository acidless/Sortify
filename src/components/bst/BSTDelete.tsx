import {type RefObject, useContext, useEffect} from "react";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";
import {bstDelete} from "../../algorithms/bstDelete.ts";
import BSTAlgorithm from "./BSTAlgorithm.tsx";
import type {BSTOperationAction, BSTOperationState} from "../../hooks/useBSTOperation.ts";
import {TheoryContext} from "../../TheoryContext.ts";

function BSTDeleteTheory() {
    return <>
        <h3 className="mb-6">📌 Удаление из бинарного дерева поиска (Binary Search Tree, BST)</h3>

        <h4 className="mb-2">💡 Идея алгоритма</h4>
        <p className="mb-6 text-base font-light leading-6">
            Удаление из бинарного дерева поиска — это процесс удаления узла с заданным значением, при этом необходимо сохранить свойства дерева.
            Удаление может быть выполнено в трех случаях:
            <ol>
                <li>Узел не имеет дочерних узлов (листовой узел).</li>
                <li>Узел имеет одного дочернего узла.</li>
                <li>Узел имеет двух дочерних узлов.</li>
            </ol>
            В каждом случае алгоритм обрабатывает удаление по-разному, чтобы сохранить структуру дерева.
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
                <td className="border-neutral-700 border-1 p-2">O(h)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(logn)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Лучший</td>
                <td className="border-neutral-700 border-1 p-2">O(1)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(h)</p>

        <h4 className="mb-2">🧠 Пошаговое объяснение</h4>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>Начните с корневого узла.</li>
            <li>Сравните значение, которое нужно удалить, с значением текущего узла.</li>
            <li>Если значение меньше текущего узла, переходите в левое поддерево.</li>
            <li>Если значение больше текущего узла, переходите в правое поддерево.</li>
            <li>Если значение совпадает, выполните удаление:</li>
            <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
                <li>Если узел не имеет дочерних узлов, просто удалите его.</li>
                <li>Если узел имеет одного дочернего узла, замените его на этот дочерний узел.</li>
                <li>Если узел имеет двух дочерних узлов, найдите наименьший узел в правом поддереве (или наибольший в левом) и замените им удаляемый узел.</li>
            </ol>
            <li>Повторяйте шаги 2-5, пока не найдете узел для удаления.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure deleteBST(node, val)
    if node is null then
        return null
    if val < node.val then
        node.left =
            deleteBST(node.left, val)
    else if val > node.val then
        node.right =
            deleteBST(node.right, val)
    else
        if node.left is null then
            return node.right
        else if node.right is null then
            return node.left
        else
            minNode = findMin(node.right)
            node.val = minNode.val
            node.right =
                deleteBST(
                    node.right,
                    minNode.val)
    return node

procedure findMin(node)
    while node.left is not null do
        node = node.left
    return node

procedure startDeleteBST(root, val)
    return deleteBST(root, val)
end procedure`}
      </code>
    </pre>
    </>
}

function BSTDelete() {
    const {setTheory} = useContext(TheoryContext);

    useEffect(() => {
        setTheory(<BSTDeleteTheory/>);
    }, []);

    function setAlgorithmState(value: any, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) {
        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, stateRef.current.targetNumber),
                });
                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                break;
            case "go-left":
            case "go-right":
                break;
            case "delete-leaf":
                dispatch({type: "SET_POPUP_TEXT", payload: "Удаляем лист"});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                break;
            case "delete-single-child":
                dispatch({type: "SET_POPUP_TEXT", payload: "Удаляем узел с одним ребёнком"});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                break;
            case "replace-with-successor":
                dispatch({type: "SET_POPUP_TEXT", payload: "Заменяем на преемника"});
                break;
            case "found":
                dispatch({type: "SET_POPUP_TEXT", payload: "Элемент удалён!"});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                dispatch({type: "SET_BST_NODES", payload: bstBfs(value.node)});
                break;
        }
    }

    return <BSTAlgorithm algo={bstDelete} setAlgorithmState={setAlgorithmState}
                         startBST={bstBfs(generateRandomBST(8, 0, 20))} title="BST Delete"></BSTAlgorithm>
}

export default BSTDelete;