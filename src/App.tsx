import './App.css'
import SideMenu from "./components/SideMenu.tsx";
import {BrowserRouter, Routes, Route} from "react-router";
import BubbleSort from "./components/sorting/BubbleSort.tsx";
import InsertionSort from "./components/sorting/InsertionSort.tsx";
import MergeSort from "./components/sorting/MergeSort.tsx";

function App() {
  return (
    <div className="h-full flex">
        <BrowserRouter>
            <SideMenu></SideMenu>
            <main className="p-10 w-full">
                <Routes>
                    <Route path="/" element={<p>Home</p>} />
                    <Route path="/bubble-sort" element={<BubbleSort />} />
                    <Route path="/insertion-sort" element={<InsertionSort />} />
                    <Route path="/merge-sort" element={<MergeSort />} />
                </Routes>
            </main>
        </BrowserRouter>
    </div>
  )
}

export default App
