import './App.css'
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
import Home from "./components/Home.tsx";
import Dijkstra from "./components/graphs/Dijkstra.tsx";
import Layout from './components/Layout.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
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
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
