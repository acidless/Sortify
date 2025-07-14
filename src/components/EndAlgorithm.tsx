type Props = {
    isDone: boolean;
    bottom?: string;
};

const EndAlgorithm = ({isDone, bottom = "-bottom-8"}: Props) => {
    return <div
        className={`absolute ${bottom} left-1/2 -translate-x-1/2 w-max text-center transition-all duration-500 ${isDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <p className="text-xl text-green-400">Работа алгоритма завершена</p>
    </div>
}

export default EndAlgorithm;