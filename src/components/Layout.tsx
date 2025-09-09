import {TheoryContext} from "../TheoryContext.ts";
import {Outlet} from "react-router";
import SideMenu from "./SideMenu.tsx";
import Theory from "./Theory.tsx";
import {useState} from "react";

function Layout() {
    const [theory, setTheory] = useState<React.ReactNode | null>(null);

    return <div className="flex h-max min-h-full overflow-x-hidden">
        <TheoryContext.Provider value={{theory, setTheory}}>
            <SideMenu></SideMenu>
            <main className="p-4 md:p-10 w-full h-max min-h-full flex flex-col overflow-x-hidden relative">
                <Outlet></Outlet>
                <Theory></Theory>
            </main>
        </TheoryContext.Provider>
    </div>
}

export default Layout;