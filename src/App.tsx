import './App.css'
import SideMenu from "./components/SideMenu.tsx";
import {BrowserRouter, Routes, Route} from "react-router";

function App() {

  return (
    <div className="h-full flex">
        <BrowserRouter>
            <SideMenu></SideMenu>
            <main className="p-10">

            </main>
        </BrowserRouter>
    </div>
  )
}

export default App
