import {Play} from "lucide-react";
import {useState} from "react";

type Props = {
    onNodeAdd: (value: number) => void;
    onOperation: (value: number) => void;
    onOperationChange: (value: number) => void;
    operationLabel: string;
}

const BSTInput = ({onNodeAdd, operationLabel, onOperation, onOperationChange}: Props) => {
    const [input, setInput] = useState("");
    const [inputOperation, setInputOperation] = useState("");
    const [validationError, setValidationError] = useState("");

    function parseNumber(input: string) {
        const result = parseInt(input);
        if (isNaN(result)) {
            setValidationError("Поле должно содержать число");
        }

        return result;
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
        setValidationError("");
        parseNumber(e.target.value);
    }

    function handleInputOperationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputOperation(e.target.value);
        setValidationError("");
        onOperationChange(parseNumber(e.target.value));
    }

    function handleNodeAdd(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onNodeAdd(parseNumber(input));
    }

    function handleOperation(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onOperation(parseNumber(inputOperation));
    }

    return <div className="w-full">
        <div className="flex items-center justify-center gap-16 flex-wrap mb-4">
            <div className="flex flex-col items-center">
                <label htmlFor="data-in">Введите значение для вставки</label>
                <form className="flex items-center gap-1" onSubmit={handleNodeAdd}>
                    <input id="data-in"
                           className="border border-neutral-700 py-2 px-4 rounded min-w-[200px] md:min-w-[300px]"
                           value={input} onChange={handleInputChange}
                           placeholder="5" type="text" autoComplete="off"/>
                    <button type="submit"
                            className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer">
                        <Play></Play>
                    </button>
                </form>
            </div>
            <div className="flex flex-col items-center">
                <label htmlFor="data-in">{operationLabel}</label>
                <form className="flex items-center gap-1" onSubmit={handleOperation}>
                    <input id="data-in"
                           className="border border-neutral-700 py-2 px-4 rounded min-w-[200px] md:min-w-[300px]"
                           value={inputOperation} onChange={handleInputOperationChange}
                           placeholder="10" type="text" autoComplete="off"/>
                    <button type="submit"
                            className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer">
                        <Play></Play>
                    </button>
                </form>
            </div>
        </div>
        {validationError && <p className="text-red-600 text-center">{validationError}</p>}
    </div>
}

export default BSTInput;