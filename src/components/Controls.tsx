import {ChevronLeft, ChevronRight, Pause, Play} from "lucide-react";
import {useEffect} from "react";

type Props = {
  stepBack: () => void;
  stepForward: () => void;
  toggleAlgorithm: () => void;
  firstState: boolean;
  isPaused: boolean;
  isDone: boolean;
};

const Controls = ({stepBack, stepForward, toggleAlgorithm, firstState, isPaused, isDone}: Props) => {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && !firstState) {
                stepBack();
            } else if (e.key === "ArrowRight" && !isDone) {
                stepForward();
            } else if (e.key === " ") {
                toggleAlgorithm();
            }
        };

        document.addEventListener("keyup", listener);

        return () => {
            document.removeEventListener("keyup", listener);
        }
    }, []);

    return <div className="flex justify-center items-center w-full gap-1 sticky bottom-4">
        <button aria-label="step-back" onClick={stepBack}
                disabled={firstState}
                className="bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-800 disabled:cursor-not-allowed transition-colors duration-300 font-bold py-2 px-4 rounded cursor-pointer">
            <ChevronLeft></ChevronLeft>
        </button>
        <button aria-label="pause" onClick={toggleAlgorithm}
                className="bg-green-600 hover:bg-green-700 transition-colors duration-300 font-bold py-2 px-4 rounded cursor-pointer">
            {isPaused ? <Play></Play> : <Pause></Pause>}
        </button>
        <button aria-label="step-forward" onClick={stepForward}
                disabled={isDone}
                className="bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-800 disabled:cursor-not-allowed transition-colors duration-300 font-bold py-2 px-4 rounded cursor-pointer">
            <ChevronRight></ChevronRight>
        </button>
    </div>
}

export default Controls;