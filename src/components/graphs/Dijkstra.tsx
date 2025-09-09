import Graph from "./Graph.tsx";
import type {GraphNode} from "../../types.ts";
import {useReducer, useRef, useCallback, useEffect, type RefObject, useContext} from "react";
import useAlgorithm, {type BaseAlgorithmState} from "../../hooks/useAlgorithm.ts";
import Controls from "../Controls.tsx";
import PopupText from "../PopupText.tsx";
import EndAlgorithm from "../EndAlgorithm.tsx";
import {dijkstra, type DijkstraAction} from "../../algorithms/dijkstra.ts";
import {generateRandomGraph} from "../../algorithms/graphUtils.ts";
import {Dices, Play} from "lucide-react";
import {TheoryContext} from "../../TheoryContext.ts";
import Tabs from "../Tabs.tsx";

type State = {
    graph: GraphNode<number>[];
    visitedNodes: Set<string>;
    distances: Map<string, number>;
    popupText: string;
};

type Action =
    | { type: "SET_GRAPH"; payload: GraphNode<number>[] }
    | { type: "SET_VISITED_NODES"; payload: Set<string> }
    | { type: "SET_DISTANCES"; payload: Map<string, number> }
    | { type: "SET_POPUP_TEXT"; payload: string };

const initialState: State = {
    graph: [],
    visitedNodes: new Set(),
    distances: new Map(),
    popupText: "",
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_GRAPH":
            return {...state, graph: action.payload};
        case "SET_VISITED_NODES":
            return {...state, visitedNodes: action.payload};
        case "SET_DISTANCES":
            return {...state, distances: new Map(action.payload)};
        case "SET_POPUP_TEXT":
            return {...state, popupText: action.payload};
        default:
            return state;
    }
}

type DjikstraHistoryState = Omit<State, "graph"> & Partial<BaseAlgorithmState>;

function DijkstraTheory() {
    return <>
        <h3 className="mb-2">📌 Алгоритм Дейкстры</h3>
        <p className="mb-6 text-base font-light leading-6">
            Алгоритм Дейкстры предназначен для нахождения кратчайших путей от одной вершины (источника) до всех
            остальных вершин в графе с <span className="text-green-400">неотрицательными</span> весами рёбер.
            Он работает, постепенно «расширяя» известные кратчайшие пути, используя <span className="text-green-400">приоритетную очередь</span> для
            выбора следующей вершины с минимальным расстоянием.
        </p>

        <h4 className="mb-2 text-lg font-semibold">👍 Плюсы и 👎 Минусы</h4>
        <ul className="list-disc list-inside text-base font-light leading-6">
            <li>Находит кратчайшие пути от одной вершины до всех остальных в графе.</li>
            <li>Гарантированно работает для графов с неотрицательными весами рёбер.</li>
            <li>Эффективен при использовании очереди с приоритетами (O((V + E) log V)).</li>
            <li className="text-red-400">Не работает с отрицательными весами рёбер.</li>
            <li className="text-red-400">Может быть ресурсоёмким для очень больших графов (особенно плотных).</li>
        </ul>
    </>
}

function DijkstraAsymptotics() {
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
            <tr>
                <td className="border-neutral-700 border-1 p-2">С использованием массива</td>
                <td className="border-neutral-700 border-1 p-2">O(V^2)</td>
            </tr>
            <tr>
                <td className="border-neutral-700 border-1 p-2">С использованием приоритетной очереди</td>
                <td className="border-neutral-700 border-1 p-2 min-w-[180px]">O((E + V)*logV)</td>
            </tr>
            </tbody>
        </table>
        <p className="mb-6 text-base font-light leading-6">Память: O(V), где V — количество вершин в графе.</p>
    </>
}

function DijkstraAlgorithm() {
    return <>
        <h3 className="mb-2">🧠 Пошаговое объяснение</h3>
        <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
            <li>0️⃣ Инициализируйте расстояние до источника как 0 и до всех остальных вершин как бесконечность.</li>
            <li>➕ Создайте пустую приоритетную очередь и добавьте в неё источник.</li>
            <li>🔁 Пока очередь не пуста:</li>
            <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
                <li>⬆️ Извлеките вершину с минимальным расстоянием из очереди.</li>
                <li>↔️ Для каждого соседнего узла:</li>
                <ol className="list-decimal list-inside mb-6 text-base font-light leading-6">
                    <li>✅ Если новое расстояние до соседа меньше известного, обновите его.</li>
                    <li>➕ Добавьте соседа в очередь, если он ещё не был добавлен.</li>
                </ol>
            </ol>
            <li>🔁 Повторяйте шаги 3-4, пока не обработаете все вершины.</li>
        </ol>

        <h4 className="mb-2">📄 Псевдокод</h4>
        <pre className="bg-gray-900 p-4 rounded-md text-sm font-light mb-4">
      <code>
        {`procedure dijkstra(graph, source)
    dist[source] = 0
    foreach vertex v in graph do
        if v ≠ source then
            dist[v] = infinity
        prev[v] = undefined
    p = new MinPriorityQueue()
    p.insert(source, dist[source])

    while not p.isEmpty() do
        current = p.extractMin()
        foreach u in graph[current] do
            alt = dist[current]
                + weight(current, u)
                
            if alt < dist[u] then
                dist[u] = alt
                prev[u] = current
                p.insert(u, dist[u])
    return dist, prev

procedure startDijkstra(graph, source)
    return dijkstra(graph, source)
end procedure`}
      </code>
    </pre>
    </>
}

function DijkstraText() {
    return <Tabs tabs={[{content: DijkstraTheory(), name: "Теория"}, {
        content: DijkstraAsymptotics(),
        name: "Сложность"
    }, {content: DijkstraAlgorithm(), name: "Шаги"}]}>
    </Tabs>
}

function Dijkstra() {
    const {setTheory} = useContext(TheoryContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        randomGraph();
        setTheory(<DijkstraText/>);
    }, []);

    useEffect(() => {
        initDistances();
    }, [state.graph.length]);

    function initDistances() {
        if (!state.graph.length) {
            return;
        }

        const initDistances = new Map<string, number>();
        state.graph.forEach(n => initDistances.set(n.id, Infinity));
        initDistances.set(state.graph[0].id, 0);
        dispatch({type: "SET_DISTANCES", payload: initDistances});
    }

    const algorithm = useCallback(() => {
        return dijkstra(stateRef.current.graph[0], stateRef.current.graph);
    }, []);

    const onStart = useCallback((_input: GraphNode<number>, historyRef: RefObject<Array<DjikstraHistoryState>>) => {
        historyRef.current.push({
            visitedNodes: new Set(),
            distances: new Map(stateRef.current.distances),
            popupText: "",
        });
    }, []);

    const updateAll = useCallback((next: DjikstraHistoryState) => {
        dispatch({type: "SET_VISITED_NODES", payload: new Set(next.visitedNodes)});
        dispatch({type: "SET_DISTANCES", payload: new Map(next.distances)});
        dispatch({type: "SET_POPUP_TEXT", payload: next.popupText});
    }, []);

    const onStep = useCallback((value: DijkstraAction, historyRef: RefObject<Array<DjikstraHistoryState>>) => {
        setAlgorithmStateWrapper(value);

        historyRef.current.push({
            visitedNodes: structuredClone(stateRef.current.visitedNodes),
            distances: new Map(stateRef.current.distances),
            popupText: stateRef.current.popupText,
        });
    }, []);

    function setAlgorithmStateWrapper(value: DijkstraAction) {
        switch (value.type) {
            case "visit": {
                const visitedNodes = new Set(stateRef.current.visitedNodes);
                visitedNodes.add(value.node.id);
                dispatch({type: "SET_VISITED_NODES", payload: visitedNodes});
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: `Извлекаем ${value.node.value} с расстоянием ${value.distance}`
                });
                break;
            }
            case "relax": {
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: `Рассматриваем ребро ${value.from.value} → ${value.to.value}`
                });
                break;
            }
            case "update": {
                const distances = new Map(stateRef.current.distances);
                distances.set(value.node.id, value.distance);
                dispatch({type: "SET_DISTANCES", payload: distances});
                dispatch({
                    type: "SET_POPUP_TEXT",
                    payload: `Обновляем расстояние для ${value.node.value}: ${value.distance}`
                });
                break;
            }
            case "done": {
                algorithmDispatch({type: "SET_DONE", payload: true});
                cleanupInterval();
                dispatch({type: "SET_POPUP_TEXT", payload: "Алгоритм завершён"});
                break;
            }
        }
    }

    function nodeStateFunc(id: string) {
        if (state.visitedNodes.has(id)) return "border-green-400";
        if (state.distances.get(id)! < Infinity) return "border-blue-400";
        return "border-neutral-700";
    }

    const {
        stepBack,
        stepForward,
        toggleAlgorithm,
        cleanupInterval,
        algorithmState,
        startAlgorithm,
        algorithmDispatch
    } = useAlgorithm(algorithm, updateAll, onStart, onStep, 2500);

    function randomGraph() {
        dispatch({type: "SET_GRAPH", payload: generateRandomGraph(6, 0.5, true)});
    }

    return (
        <div className="flex flex-col items-start h-max flex-1">
            <h1 className="font-bold text-3xl text-center mb-10 self-center">Dijkstra</h1>
            <div className="flex justify-center item-center w-full gap-1">
                <button type="button" onClick={randomGraph}
                        className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer">
                    <Dices></Dices>
                </button>
                <button
                    className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer"
                    onClick={() => startAlgorithm(state.graph[0])}
                >
                    <Play></Play>
                </button>
            </div>
            <div className="flex-1 self-stretch flex flex-col justify-center items-center relative mt-24">
                <PopupText id={state.popupText} text={state.popupText}/>
                <Graph nodes={state.graph} distances={state.distances} directed={true} weighted={true} nodeStateFunc={nodeStateFunc}/>
                <EndAlgorithm isDone={algorithmState.isDone!} bottom="bottom-12"/>
            </div>
            <Controls
                stepBack={stepBack}
                stepForward={stepForward}
                toggleAlgorithm={toggleAlgorithm}
                firstState={algorithmState.firstState}
                isPaused={algorithmState.isPaused}
                isDone={algorithmState.isDone!}
            />
        </div>
    );
}

export default Dijkstra;