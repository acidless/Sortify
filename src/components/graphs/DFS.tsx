import {type GraphTraversalAction, type GraphTraversalState} from "../../hooks/useGraphTraversal.ts";
import GraphTraversal from "./GraphTraversal.tsx";
import {dfs} from "../../algorithms/dfs.ts";
import {useContext, useEffect} from "react";
import {TheoryContext} from "../../TheoryContext.ts";
import Tabs from "../Tabs.tsx";

function DFSTheory() {
    return <>
        <h3 className="mb-2">📌 Поиск в глубину (Depth-First Search, DFS)</h3>
        <p className="mb-6 text-base font-light leading-6">
            Поиск в глубину — это алгоритм для обхода или поиска в графах. Он начинает с корневого узла (или любого
            начального узла) и исследует как можно дальше <span
            className="text-green-400">вдоль каждого ветвления</span>, прежде чем отступить.
            Алгоритм использует <span className="text-green-400">стек</span> для хранения узлов, которые нужно посетить,
            и может быть реализован как рекурсивно,
            так и итеративно.
            DFS часто сравнивается с исследованием лабиринта: вы идете по одному пути, пока не достигнете конца, а затем
            возвращаетесь назад, чтобы исследовать другие пути.
        </p>

        <h4 className="mb-2 text-lg font-semibold">👍 Плюсы и 👎 Минусы</h4>
        <ul className="list-disc list-inside text-base font-light leading-6">
            <li>Простая и наглядная реализация (рекурсивно или через стек).</li>
            <li>Позволяет легко находить пути и проверять связность графа.</li>
            <li>Подходит для задач поиска на глубину (например, топологическая сортировка, проверка циклов).</li>
            <li className="text-red-400">Может «уйти слишком глубоко» и вызвать переполнение стека при больших графах.
            </li>
            <li className="text-red-400">Не всегда находит кратчайший путь (в отличие от BFS).</li>
        </ul>
    </>
}

function DFSAsymptotics() {
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
                <td className="border-neutral-700 border-1 p-2">Лучший</td>
                <td className="border-neutral-700 border-1 p-2">O(V + E)</td>
            </tr>
            <tr className="bg-yellow-900/40">
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(V + E)</td>
            </tr>
            <tr className="bg-red-900/40">
                <td className="border-neutral-700 border-1 p-2">Худший</td>
                <td className="border-neutral-700 border-1 p-2">O(V + E)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(V), где V — количество вершин в графе.</p>
    </>
}

function DFSAlgorithm() {
    return <>
        <h3 className="mb-2">🧠 Пошаговое объяснение</h3>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>🫚 Начните с корневого узла (или любого начального узла).</li>
            <li>✅ Посетите узел и отметьте его как посещенный.</li>
            <li>🔁 Для каждого непосещенного соседнего узла выполните рекурсивный вызов DFS.</li>
            <li>🔎 Продолжайте, пока все узлы не будут посещены или пока не будет найден искомый узел.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure DFS(node, visited)
    if node is not in visited then
        add node to visited
        foreach u in node.neighbors do
            DFS(u, visited)

procedure startDFS(graph, startNode)
    visited = []
    DFS(startNode, visited)
end procedure`}
      </code>
    </pre>
    </>
}

function DFSText() {
    return <Tabs tabs={[{content: DFSTheory(), name: "Теория"}, {
        content: DFSAsymptotics(),
        name: "Сложность"
    }, {content: DFSAlgorithm(), name: "Шаги"}]}>
    </Tabs>
}

function DFS() {
    const {setTheory} = useContext(TheoryContext);

    useEffect(() => {
        setTheory(<DFSText/>);
    }, []);

    function setAlgorithmState(value: any, dispatch: React.Dispatch<GraphTraversalAction>, stateRef: React.RefObject<GraphTraversalState>) {
        switch (value.type) {
            case "push":
                dispatch({
                    type: "SET_QUEUED_NODES",
                    payload: [...stateRef.current.queuedNodes, value.node],
                });
                dispatch({type: "SET_POPUP_TEXT", payload: `Кладём ${value.node.value} в стек`});
                break;
            case "pop":
                dispatch({
                    type: "SET_QUEUED_NODES",
                    payload: stateRef.current.queuedNodes.filter(n => n.id !== value.node.id),
                });
                dispatch({type: "SET_POPUP_TEXT", payload: `Достаём ${value.node.value} из стека`});
                break;
            case "visit": {
                const visitedNodes = new Set(stateRef.current.visitedNodes);
                visitedNodes.add(value.node.id);
                dispatch({type: "SET_VISITED_NODES", payload: visitedNodes});
                dispatch({type: "SET_POPUP_TEXT", payload: `Посещаем ${value.node.value}`});
                break;
            }
        }
    }

    return <GraphTraversal algorithm={dfs} setAlgorithmState={setAlgorithmState} title="DFS (Depth-first search)"/>;
}

export default DFS;
