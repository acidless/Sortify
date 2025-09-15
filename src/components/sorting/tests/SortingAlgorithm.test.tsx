import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SortingAlgorithm from "../SortingAlgorithm.tsx";
import useAlgorithm, {type BaseAlgorithmState} from "../../../hooks/useAlgorithm.ts";

vi.mock("../../../hooks/useAlgorithm.ts", () => {
    return {
        default: vi.fn(() => ({
            cleanupInterval: vi.fn(),
            stepBack: vi.fn(),
            stepForward: vi.fn(),
            toggleAlgorithm: vi.fn(),
            startAlgorithm: vi.fn(),
            algorithmDispatch: vi.fn(),
            algorithmState: { isDone: false, isPaused: true, firstState: true },
            algorithmStateRef: { current: { isDone: false } },
        })),
    };
});

vi.mock("../ArrayInput.tsx", () => ({
    default: ({ onSubmit, onInputChange }: any) => (
        <form data-testid="array-input" onSubmit={(e) => { e.preventDefault(); onSubmit?.([]); }}>
            <input data-testid="array-input-field" onChange={onInputChange} />
            <button type="submit">Submit</button>
        </form>
    ),
}));

vi.mock("../ArrayNode.tsx", () => ({
    default: ({ value, className }: any) => (
        <div data-testid="array-node" className={className}>{value}</div>
    ),
}));

vi.mock("../../ComparisionIndices.tsx", () => ({
    default: ({ indices }: any) => (
        <div data-testid="cmp-indices">{indices?.join(",")}</div>
    ),
}));

vi.mock("../../Controls.tsx", () => ({
    default: (props: any) => (
        <div data-testid="controls">
            <button onClick={props.stepBack}>Back</button>
            <button onClick={props.stepForward}>Forward</button>
        </div>
    ),
}));

vi.mock("../../EndAlgorithm.tsx", () => ({
    default: ({ isDone }: any) => (
        <div data-testid="end-alg">{isDone ? "done" : "not done"}</div>
    ),
}));

describe("SortingAlgorithm", () => {
    const makeSnapshot = vi.fn(() => ({ snap: true }));
    const updateData = vi.fn();
    const setAlgorithmState = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders title and children", () => {
        render(
            <SortingAlgorithm
                name="Bubble Sort"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            >
                {(arr) => <div data-testid="child">{arr.length}</div>}
            </SortingAlgorithm>
        );

        expect(screen.getByText("Bubble Sort")).toBeInTheDocument();
        expect(screen.getByTestId("child")).toHaveTextContent("0");
    });

    it("calls startAlgorithm on ArrayInput submit", () => {
        const useAlgorithmMock = vi.mocked(useAlgorithm);
        const startAlgorithm = vi.fn();
        useAlgorithmMock.mockReturnValueOnce({
            cleanupInterval: vi.fn(),
            stepBack: vi.fn(),
            stepForward: vi.fn(),
            toggleAlgorithm: vi.fn(),
            startAlgorithm,
            algorithmDispatch: vi.fn(),
            algorithmState: { isDone: false, isPaused: true, firstState: true },
            algorithmStateRef: { current: { isDone: false, isPaused: true, firstState: true } },
        });

        render(
            <SortingAlgorithm
                name="Test Sort"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        fireEvent.submit(screen.getByTestId("array-input"));
        expect(startAlgorithm).toHaveBeenCalled();
    });

    it("dispatches SET_DONE false on input change", () => {
        const useAlgorithmMock = vi.mocked(useAlgorithm);
        const dispatch = vi.fn();
        const cleanup = vi.fn();
        useAlgorithmMock.mockReturnValueOnce({
            cleanupInterval: cleanup,
            stepBack: vi.fn(),
            stepForward: vi.fn(),
            toggleAlgorithm: vi.fn(),
            startAlgorithm: vi.fn(),
            algorithmDispatch: dispatch,
            algorithmState: { isDone: false, isPaused: true, firstState: true },
            algorithmStateRef: { current: { isDone: false, isPaused: true, firstState: true } },
        });

        render(
            <SortingAlgorithm
                name="Test Sort"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        fireEvent.change(screen.getByTestId("array-input-field"), { target: { value: "1,2,3" } });
        expect(dispatch).toHaveBeenCalledWith({ type: "SET_DONE", payload: false });
        expect(cleanup).toHaveBeenCalled();
    });

    it("renders EndAlgorithm when isDone=true", () => {
        const useAlgorithmMock = vi.mocked(useAlgorithm);
        useAlgorithmMock.mockReturnValueOnce({
            cleanupInterval: vi.fn(),
            stepBack: vi.fn(),
            stepForward: vi.fn(),
            toggleAlgorithm: vi.fn(),
            startAlgorithm: vi.fn(),
            algorithmDispatch: vi.fn(),
            algorithmState: { isDone: true, isPaused: false, firstState: false },
            algorithmStateRef: { current: { isDone: true, isPaused: false, firstState: false } },
        });

        render(
            <SortingAlgorithm
                name="Done Sort"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        expect(screen.getByTestId("end-alg")).toHaveTextContent("done");
    });

    it("passes stepBack and stepForward to Controls", () => {
        const stepBack = vi.fn();
        const stepForward = vi.fn();

        const useAlgorithmMock = vi.mocked(useAlgorithm);
        useAlgorithmMock.mockReturnValueOnce({
            cleanupInterval: vi.fn(),
            stepBack,
            stepForward,
            toggleAlgorithm: vi.fn(),
            startAlgorithm: vi.fn(),
            algorithmDispatch: vi.fn(),
            algorithmState: { isDone: false, isPaused: true, firstState: true },
            algorithmStateRef: { current: { isDone: false, isPaused: true, firstState: true } },
        });

        render(
            <SortingAlgorithm
                name="Controls Sort"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        fireEvent.click(screen.getByText("Back"));
        expect(stepBack).toHaveBeenCalled();

        fireEvent.click(screen.getByText("Forward"));
        expect(stepForward).toHaveBeenCalled();
    });

    it("calls onStart and initializes historyRef", () => {
        let onStartFn: any;
        const useAlgorithmMock = vi.mocked(useAlgorithm);
        useAlgorithmMock.mockImplementation(
            (_algo: any, _updateAll: any, onStart: any) => {
                onStartFn = onStart;

                const mockState: BaseAlgorithmState = {
                    isDone: false,
                    isPaused: false,
                    firstState: true,
                };

                return {
                    cleanupInterval: vi.fn(),
                    stepBack: vi.fn(),
                    stepForward: vi.fn(),
                    toggleAlgorithm: vi.fn(),
                    startAlgorithm: vi.fn(),
                    algorithmDispatch: vi.fn(),
                    algorithmState: mockState,
                    algorithmStateRef: { current: mockState },
                };
            }
        );

        render(
            <SortingAlgorithm
                name="Test"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        const historyRef = { current: [] as any[] };
        const input = [{ key: 1, value: 10 }];
        onStartFn(input, historyRef);

        expect(historyRef.current[0].array).toEqual(input);
        expect(historyRef.current[0].isDone).toBe(false);
        expect(makeSnapshot).toHaveBeenCalled();
    });

    it("calls updateAll with and without array", () => {
        let updateAllFn: any;
        (useAlgorithm as any).mockImplementation(
            (_algo: any, updateAll: any) => {
                updateAllFn = updateAll;
                return {
                    cleanupInterval: vi.fn(),
                    stepBack: vi.fn(),
                    stepForward: vi.fn(),
                    toggleAlgorithm: vi.fn(),
                    startAlgorithm: vi.fn(),
                    algorithmDispatch: vi.fn(),
                    algorithmState: { isDone: false, isPaused: false, firstState: true },
                    algorithmStateRef: { current: { isDone: false } },
                };
            }
        );

        const { rerender } = render(
            <SortingAlgorithm
                name="Test"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        updateAllFn({ foo: 1 });
        expect(updateData).toHaveBeenCalledWith({ foo: 1 });

        const arr = [{ key: 2, value: 5 }];
        updateAllFn({ array: arr });
        rerender(
            <SortingAlgorithm
                name="Test"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );
    });

    it("calls onStep and pushes to history", () => {
        let onStepFn: any;
        const dispatch = vi.fn();
        (useAlgorithm as any).mockImplementation(
            (_algo: any, _updateAll: any, _onStart: any, onStep: any) => {
                onStepFn = onStep;
                return {
                    cleanupInterval: vi.fn(),
                    stepBack: vi.fn(),
                    stepForward: vi.fn(),
                    toggleAlgorithm: vi.fn(),
                    startAlgorithm: vi.fn(),
                    algorithmDispatch: dispatch,
                    algorithmState: { isDone: false, isPaused: false, firstState: true },
                    algorithmStateRef: { current: { isDone: false } },
                };
            }
        );

        render(
            <SortingAlgorithm
                name="Test"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        const historyRef = { current: [] as any[] };
        const value = { array: [{ key: 3, value: 7 }] };
        onStepFn(value, historyRef);

        expect(setAlgorithmState).toHaveBeenCalledWith(value);
        expect(historyRef.current.length).toBe(1);
        expect(historyRef.current[0].array).toEqual(value.array);
    });

    it("setAlgorithmStateWrapper handles 'done' type", () => {
        let onStepFn: any;
        const dispatch = vi.fn();
        const cleanup = vi.fn();

        (useAlgorithm as any).mockImplementation(
            (_algo: any, _updateAll: any, _onStart: any, onStep: any) => {
                onStepFn = onStep;
                return {
                    cleanupInterval: cleanup,
                    stepBack: vi.fn(),
                    stepForward: vi.fn(),
                    toggleAlgorithm: vi.fn(),
                    startAlgorithm: vi.fn(),
                    algorithmDispatch: dispatch,
                    algorithmState: { isDone: false, isPaused: false, firstState: true },
                    algorithmStateRef: { current: { isDone: false } },
                };
            }
        );

        render(
            <SortingAlgorithm
                name="Test"
                algorithm={{}}
                makeSnapshot={makeSnapshot}
                updateData={updateData}
                setAlgorithmState={setAlgorithmState}
                classNameFn={() => "cls"}
            />
        );

        const historyRef = { current: [] as any[] };
        const value = { type: "done", array: [{ key: 1, value: 2 }] };
        onStepFn(value, historyRef);

        expect(cleanup).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith({ type: "SET_DONE", payload: true });
        expect(setAlgorithmState).toHaveBeenCalledWith(value);
    });
});
