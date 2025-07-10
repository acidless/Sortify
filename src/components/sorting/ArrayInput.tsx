import {useState} from "react";
import type {SampleArray} from "../../types.ts";
import {Play} from "lucide-react";

type Props = {
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (value: SampleArray) => void;
};

const ArrayInput = ({onInputChange, onSubmit}: Props) => {
    const [input, setInput] = useState("");
    const [validationError, setValidationError] = useState("");

    function parseArray(input: string) {
        try {
            const arr = JSON.parse(input);
            if (!Array.isArray(arr)) {
                throw new Error("Был введен не массив");
            }

            return arr.map((x: number, idx: number) => ({value: x, key: idx}));
        } catch (e: any) {
            setValidationError(e.message);
            console.error(e);
            return [];
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
        setValidationError("");

        onInputChange(e);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(parseArray(input));
    }

    return (
        <div className="w-full flex flex-col items-center md:items-start">
            <label htmlFor="data-in">Введите входной массив</label>
            <form className="flex items-center gap-1" onSubmit={handleSubmit}>
                <input id="data-in" className="border border-neutral-700 py-2 px-4 rounded min-w-[200px] md:min-w-[300px]"
                       value={input} onChange={handleInputChange}
                       placeholder="[3, 5, 1, 2]" type="text" autoComplete="off"/>
                <button type="submit"
                        className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded cursor-pointer">
                    <Play></Play>
                </button>
            </form>
            {validationError && <p className="text-red-600">{validationError}</p>}
        </div>
    );
}

export default ArrayInput;