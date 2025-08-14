import {
    ArrowDown,
    BetweenHorizonalStart,
    ListOrdered, Menu,
    Minimize2,
    Move, Plus,
    RabbitIcon, Route, Search, X
} from "lucide-react";
import {NavLink} from "react-router";
import {useState} from "react";

function SideMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <>
            <button onClick={() => setIsMenuOpen(true)}
                    className="cursor-pointer absolute top-4 left-4 2xl:hidden z-50 bg-neutral-700 hover:bg-neutral-800 transition-colors duration-300 w-12 h-12 rounded-2xl flex items-center justify-center">
                <Menu className="w-8 h-8"></Menu>
            </button>
            <aside
                className={`max-w-sm w-full h-full py-10 px-8 border-r border-b dark-bg z-100 transition-all duration-300 border-neutral-700 2xl:sticky fixed ${isMenuOpen ? "left-0" : "-left-full"}`}>
                <h2 className="font-bold text-3xl mb-10">Выбор алгоритма</h2>
                <button onClick={() => setIsMenuOpen(false)}
                        className="cursor-pointer absolute top-4 right-4 2xl:hidden block">
                    <X className="w-8 h-8"></X>
                </button>
                <nav>
                    <h3 className="font-semibold text-2xl mb-2">Сортировки</h3>
                    <ul className="grid grid-cols-2 gap-4 mb-12">
                        <li>
                            <NavLink to="/bubble-sort" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <ListOrdered className="w-16 h-16"></ListOrdered>
                                Bubble sort
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/insertion-sort" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <BetweenHorizonalStart className="w-16 h-16"></BetweenHorizonalStart>
                                Insertion sort
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/merge-sort" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <Minimize2 className="w-16 h-16"></Minimize2>
                                Merge sort
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/quick-sort" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <RabbitIcon className="w-16 h-16"></RabbitIcon>
                                Quick sort
                            </NavLink>
                        </li>
                    </ul>
                    <h3 className="font-semibold text-2xl mb-2">Графы</h3>
                    <ul className="grid grid-cols-2 gap-4 mb-12">
                        <li>
                            <NavLink to="/dfs" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <ArrowDown className="w-16 h-16"></ArrowDown>
                                DFS
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bfs" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <Move className="w-16 h-16"></Move>
                                BFS
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/djikstra" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <Route className="w-16 h-16"></Route>
                                Djikstra
                            </NavLink>
                        </li>
                    </ul>
                    <h3 className="font-semibold text-2xl mb-2">BST</h3>
                    <ul className="grid grid-cols-2 gap-4 mb-12">
                        <li>
                            <NavLink to="/bst-search" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <Search className="w-16 h-16"></Search>
                                Search
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bst-insert" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <Plus className="w-16 h-16"></Plus>
                                Insert
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bst-delete" className={({isActive}) =>
                                (isActive ? "text-green-400" : "") + " flex flex-col items-center"
                            }>
                                <X className="w-16 h-16"></X>
                                Remove
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>

    )
}

export default SideMenu;