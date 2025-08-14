import './App.css'
import SideMenu from "./components/SideMenu.tsx";
import {BrowserRouter, Routes, Route} from "react-router";
import BubbleSort from "./components/sorting/BubbleSort.tsx";
import InsertionSort from "./components/sorting/InsertionSort.tsx";
import MergeSort from "./components/sorting/MergeSort.tsx";
import BSTSearch from "./components/bst/BSTSearch.tsx";
import BSTInsert from "./components/bst/BSTInsert.tsx";
import BSTDelete from "./components/bst/BSTDelete.tsx";

function App() {
  return (
    <div className="flex h-max min-h-full">
        <BrowserRouter>
            <SideMenu></SideMenu>
            <main className="p-4 md:p-10 w-full h-max min-h-full flex flex-col">
                <Routes>
                    <Route path="/" element={<p>Home</p>} />
                    <Route path="/bubble-sort" element={<BubbleSort />} />
                    <Route path="/insertion-sort" element={<InsertionSort />} />
                    <Route path="/merge-sort" element={<MergeSort />} />
                    <Route path="/bst-search" element={<BSTSearch />} />
                    <Route path="/bst-insert" element={<BSTInsert />} />
                    <Route path="/bst-delete" element={<BSTDelete />} />
                </Routes>
            </main>
        </BrowserRouter>
    </div>
  )
}

export default App
