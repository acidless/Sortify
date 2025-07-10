import {ChevronLeft, ChevronRight, Pause, Play} from "lucide-react";

type Props = {
  stepBack: () => void;
  stepForward: () => void;
  toggleAlgorithm: () => void;
  firstState: boolean;
  isPaused: boolean;
  isDone: boolean;
};

const Controls = ({stepBack, stepForward, toggleAlgorithm, firstState, isPaused, isDone}: Props) => {
    return <div className="flex justify-center items-center w-full gap-1">
        <button onClick={stepBack}
                disabled={firstState}
                className="bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-800 disabled:cursor-not-allowed transition-colors duration-300 font-bold py-2 px-4 rounded cursor-pointer">
            <ChevronLeft></ChevronLeft>
        </button>
        <button onClick={toggleAlgorithm}
                className="bg-green-600 hover:bg-green-700 transition-colors duration-300 font-bold py-2 px-4 rounded cursor-pointer">
            {isPaused ? <Play></Play> : <Pause></Pause>}
        </button>
        <button onClick={stepForward}
                disabled={isDone}
                className="bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-800 disabled:cursor-not-allowed transition-colors duration-300 font-bold py-2 px-4 rounded cursor-pointer">
            <ChevronRight></ChevronRight>
        </button>
    </div>
}

export default Controls;