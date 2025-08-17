import './App.css'
import SideMenu from "./components/SideMenu.tsx";
import {BrowserRouter, Routes, Route} from "react-router";
import BubbleSort from "./components/sorting/BubbleSort.tsx";
import InsertionSort from "./components/sorting/InsertionSort.tsx";
import MergeSort from "./components/sorting/MergeSort.tsx";
import BSTSearch from "./components/bst/BSTSearch.tsx";
import BSTInsert from "./components/bst/BSTInsert.tsx";
import BSTDelete from "./components/bst/BSTDelete.tsx";
import QuickSort from "./components/sorting/QuickSort.tsx";
import BFS from "./components/graphs/BFS.tsx";
import DFS from "./components/graphs/DFS.tsx";
import Theory from "./components/Theory.tsx";
import Home from "./components/Home.tsx";
import {useState} from "react";
import { TheoryContext } from './TheoryContext.ts';
import Dijkstra from "./components/graphs/Dijkstra.tsx";

function App() {
    const [theory, setTheory] = useState(null);

    return (
        <div className="flex h-max min-h-full overflow-hidden">
            <TheoryContext.Provider value={{theory, setTheory}}>
                <BrowserRouter>
                    <SideMenu></SideMenu>
                    <main className="p-4 md:p-10 w-full h-max min-h-full flex flex-col overflow-hidden relative">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/bubble-sort" element={<BubbleSort/>}/>
                            <Route path="/insertion-sort" element={<InsertionSort/>}/>
                            <Route path="/merge-sort" element={<MergeSort/>}/>
                            <Route path="/quick-sort" element={<QuickSort/>}/>
                            <Route path="/bfs" element={<BFS/>}/>
                            <Route path="/dfs" element={<DFS/>}/>
                            <Route path="/dijkstra" element={<Dijkstra/>}/>
                            <Route path="/bst-search" element={<BSTSearch/>}/>
                            <Route path="/bst-insert" element={<BSTInsert/>}/>
                            <Route path="/bst-delete" element={<BSTDelete/>}/>
                        </Routes>
                        <Theory/>
                    </main>
                </BrowserRouter>
            </TheoryContext.Provider>
        </div>
    )
}

export default App
