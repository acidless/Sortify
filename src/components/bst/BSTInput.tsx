import {Dices, Play} from "lucide-react";
import {useState} from "react";
import type {BSTNode} from "../../types.ts";
import {bstBfs, generateRandomBST} from "../../algorithms/bstUtils.ts";

type Props = {
    onOperation: (value: number) => void;
    onOperationChange: (value: number) => void;
    operationLabel: string;
    setBST: (bst: BSTNode[]) => void
}

const BSTInput = ({operationLabel, onOperation, onOperationChange, setBST}: Props) => {
    const [inputOperation, setInputOperation] = useState("");
    const [validationError, setValidationError] = useState("");

    function parseNumber(input: string) {
        const result = parseInt(input);
        if (isNaN(result)) {
            setValidationError("Поле должно содержать число");
        }

        return result;
    }

    function handleInputOperationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputOperation(e.target.value);
        setValidationError("");
        onOperationChange(parseNumber(e.target.value));
    }

    function handleOperation(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onOperation(parseNumber(inputOperation));
    }

    function randomBst() {
        setBST(bstBfs(generateRandomBST(8, 0, 20)));
    }

    return <div className="w-full">
        <div className="flex items-center justify-center gap-16 flex-wrap mb-4">
            <div className="flex flex-col items-center">
                <label htmlFor="data-in">{operationLabel}</label>
                <form className="flex items-center gap-1 flex-col sm:flex-row" onSubmit={handleOperation}>
                    <input id="data-in"
                           className="border border-neutral-700 py-2 px-4 rounded min-w-[200px] md:min-w-[300px]"
                           value={inputOperation} onChange={handleInputOperationChange}
                           placeholder="10" type="text" autoComplete="off"/>
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={randomBst}
                                className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer">
                            <Dices></Dices>
                        </button>
                        <button type="submit"
                                className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer">
                            <Play></Play>
                        </button>
                    </div>

                </form>
            </div>
        </div>
        {validationError && <p className="text-red-600 text-center">{validationError}</p>}
    </div>
}

export default BSTInput;