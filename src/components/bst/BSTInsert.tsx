import BSTAlgorithm from "./BSTAlgorithm.tsx";
import type {BSTOperationAction, BSTOperationState} from "../../hooks/useBSTOperation.ts";
import {type RefObject, useContext, useEffect} from "react";
import {bstInsert} from "../../algorithms/bstInsert.ts";
import {TheoryContext} from "../../TheoryContext.ts";

const node = {value: 10, id: crypto.randomUUID(), left: null, right: null};

function BSTInsertTheory() {
    return <>
        <h3 className="mb-6">📌 Вставка в бинарное дерево поиска (Binary Search Tree, BST)</h3>

        <h4 className="mb-2">💡 Идея алгоритма</h4>
        <p className="mb-6 text-base font-light leading-6">
            Вставка в бинарное дерево поиска — это процесс добавления нового узла в дерево с учетом его свойств.
            Новый узел вставляется таким образом, чтобы все значения в левом поддереве оставались меньше, а все значения в правом поддереве — больше, чем значение нового узла.
            Алгоритм начинается с корневого узла и рекурсивно или итеративно перемещается влево или вправо в зависимости от значения, которое нужно вставить.
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
            <li>Сравните значение, которое нужно вставить, с значением текущего узла.</li>
            <li>Если значение меньше текущего узла, переходите в левое поддерево.</li>
            <li>Если значение больше текущего узла, переходите в правое поддерево.</li>
            <li>Если текущий узел — null, вставьте новый узел здесь.</li>
            <li>Повторяйте шаги 2-5, пока не найдете подходящее место для вставки.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure insertBST(node, val)
    if node is null then
        return new Node(val)
    if val < node.val then
        node.left = 
            insertBST(node.left, val)
    else if val > node.val then
        node.right = 
            insertBST(node.right, val)
    return node

procedure startInsertBST(root, val)
    return insertBST(root, val)
end procedure`}
      </code>
    </pre>
    </>
}

function BSTInsert() {
    const {setTheory} = useContext(TheoryContext);

    useEffect(() => {
        setTheory(<BSTInsertTheory/>);
    }, []);

    function setAlgorithmState(value: any, dispatch: React.Dispatch<BSTOperationAction>, stateRef: RefObject<BSTOperationState>, makeComparison: (a: number, b: number) => string) {
        switch (value.type) {
            case "compare":
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: makeComparison(value.node.value, stateRef.current.targetNumber)
                });

                dispatch({type: "SET_CHECKING_NODE", payload: value.node});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                break;
            case "exists":
                dispatch({type: "SET_POPUP_TEXT", payload: `Элемент уже существует!`});
                dispatch({type: "SET_RESULT_NODE", payload: null});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                break;
            case "inserted":
                dispatch({type: "SET_POPUP_TEXT", payload: `Элемент вставлен!`});
                dispatch({type: "SET_RESULT_NODE", payload: value.node});
                dispatch({type: "SET_CHECKING_NODE", payload: null});
                dispatch({type: "SET_BST_NODES", payload: [...stateRef.current.bstNodes, value.node]});
                break;
        }
    }

    return <BSTAlgorithm algo={bstInsert} setAlgorithmState={setAlgorithmState}
                                startBST={[node]} title="BST Insert"></BSTAlgorithm>
}

export default BSTInsert;