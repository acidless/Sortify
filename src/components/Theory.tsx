import {useContext, useState} from "react";
import {TheoryContext} from "../TheoryContext";

function Theory() {
    const [isOpen, setIsOpen] = useState(false);
    const {theory} = useContext(TheoryContext);

    return <>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`orientation-vertical absolute ${isOpen ? "right-[400px]" : "right-0"} top-1/5 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 font-bold text-xl py-1 px-6 rounded-l-xl cursor-pointer`}>Теория
        </button>
        <div
                className={`theory-container absolute ${isOpen ? "right-0" : "-right-full"} transition-all h-full w-[400px] top-0 bg-neutral-900 border-l-1 border-neutral-600 duration-300 font-bold text-xl py-4 px-6 overflow-auto`}>
            {theory ||
                <div className="h-full flex items-center justify-center">
                    <p>Тут пока ничего нет :(</p>
                </div>
            }
        </div>
    </>
}

export default Theory;