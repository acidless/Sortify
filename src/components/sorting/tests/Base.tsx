import {vi} from "vitest";

export let lastProps: any;

vi.mock("../../Tabs.tsx", () => ({
    default: ({ tabs }: any) => (
        <div>
            {tabs.map((t: any, i: number) => (
                <button key={i} onClick={() => (document.body.innerHTML += t.name)}>
                    {t.name}
                </button>
            ))}
        </div>
    ),
}));

vi.mock("../SortingAlgorithm.tsx", () => ({
    default: (props: any) => {
        lastProps = props;
        return (
            <div>
                <button onClick={() => props.setAlgorithmState({ type: "compare", indices: [0, 1] })}>
                    Compare
                </button>
                <button onClick={() => props.setAlgorithmState({type: "swap"})}>Swap</button>
                <button onClick={() => props.setAlgorithmState({type: "done"})}>Done</button>
                <button onClick={() => props.updateData({ checkingIndices: [1] })}>
                    UpdateData
                </button>
                <button onClick={() => JSON.stringify(props.makeSnapshot())}>
                    MakeSnapshot
                </button>
                <div data-testid="node-0" className={props.classNameFn(0)} />
                <div data-testid="node-1" className={props.classNameFn(1)} />
            </div>
        );
    },
}));