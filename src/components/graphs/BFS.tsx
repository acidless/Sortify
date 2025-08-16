import {type GraphTraversalAction, type GraphTraversalState} from "../../hooks/useGraphTraversal.ts";
import {bfs} from "../../algorithms/bfs.ts";
import GraphTraversal from "./GraphTraversal.tsx";
import { useContext, useEffect } from "react";
import {TheoryContext} from "../../TheoryContext.ts";

function BFSTheory() {
    return <>
        <h3 className="mb-6">📌 Поиск в ширину (Breadth-First Search, BFS)</h3>

        <h4 className="mb-2">💡 Идея алгоритма</h4>
        <p className="mb-6 text-base font-light leading-6">
            Поиск в ширину — это алгоритм для обхода или поиска в графах, который исследует все соседние узлы текущего узла перед тем, как перейти к узлам следующего уровня.
            Алгоритм использует очередь для хранения узлов, которые нужно посетить, и гарантирует, что узлы будут посещены в порядке их расстояния от начального узла.
            BFS часто сравнивается с поиском по этажам здания: вы исследуете все комнаты на одном этаже, прежде чем подняться на следующий этаж.
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
                <td className="border-neutral-700 border-1 p-2">O(V + E)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Средний</td>
                <td className="border-neutral-700 border-1 p-2">O(V + E)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">Лучший</td>
                <td className="border-neutral-700 border-1 p-2">O(V + E)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(V)</p>

        <h4 className="mb-2">🧠 Пошаговое объяснение</h4>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>Начните с корневого узла (или любого начального узла).</li>
            <li>Поместите начальный узел в очередь и отметьте его как посещенный.</li>
            <li>Пока очередь не пуста, извлекайте узел из очереди.</li>
            <li>Для каждого непосещенного соседнего узла добавьте его в очередь и отметьте как посещенный.</li>
            <li>Продолжайте, пока все узлы не будут посещены или пока не будет найден искомый узел.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure BFS(graph, startNode)
    queue = []
    visited = []
    enqueue(queue, startNode)
    add startNode to visited

    while queue is not empty do
        node = dequeue(queue)
        foreach u in node.neighbors do
            if u is not in visited then
                enqueue(queue, u)
                add u to visited
end procedure`}
      </code>
    </pre>
    </>
}

function BFS() {
    const {setTheory} = useContext(TheoryContext);

    useEffect(() => {
        setTheory(<BFSTheory/>);
    }, []);

    function setAlgorithmState(value: any, dispatch: React.Dispatch<GraphTraversalAction>, stateRef: React.RefObject<GraphTraversalState>) {
        switch (value.type) {
            case "enqueue":
                dispatch({
                    type: "SET_QUEUED_NODES",
                    payload: [...stateRef.current.queuedNodes, value.node],
                });
                dispatch({type: "SET_POPUP_TEXT", payload: `Добавляем ${value.node.value} в очередь`});
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

    return <GraphTraversal algorithm={bfs} setAlgorithmState={setAlgorithmState} title="BFS (Breadth-first search)"/>;
}

export default BFS;