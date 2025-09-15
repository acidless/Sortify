import {render,} from "@testing-library/react";
import Controls from "../Controls.tsx";
import userEvent from "@testing-library/user-event";


describe('ControlsComponent', () => {
    it("back button should be disabled on first step", () => {
        const controls =
            render(
                <Controls isDone={false} firstState={true}
                          stepBack={() => {}}
                          stepForward={() => {}}
                          toggleAlgorithm={() => {}}
                          isPaused={false}/>);
        expect(controls.getByRole("button", {"name": "step-back"})).toHaveAttribute("disabled", "");
        expect(controls.getByRole("button", {"name": "step-forward"})).not.toHaveAttribute("disabled", "");
    });

    it("forward button should be disabled on last step", () => {
        const controls = render(
            <Controls isDone={true} firstState={false}
                      stepBack={() => {}} stepForward={() => {}}
                      toggleAlgorithm={() => {}} isPaused={false}/>);
        expect(controls.getByRole("button", {"name": "step-back"})).not.toHaveAttribute("disabled", "");
        expect(controls.getByRole("button", {"name": "step-forward"})).toHaveAttribute("disabled", "");
    });

    it("stepBack and stepForward should be called on button clicks", async () => {
        const stepBack = vi.fn(() => {});
        const stepForward = vi.fn(() => {});
        const toggleAlgorithm = vi.fn(() => {});

        const controls = render(<Controls isDone={false} firstState={false}
                                          stepBack={stepBack} stepForward={stepForward}
                                          toggleAlgorithm={toggleAlgorithm} isPaused={false}/>);
        const backBtn = controls.getByRole("button", {"name": "step-back"});
        await userEvent.click(backBtn);
        expect(stepBack).toHaveBeenCalled();

        const toggleAlgorithmBtn = controls.getByRole("button", {"name": "pause"});
        await userEvent.click(toggleAlgorithmBtn);

        expect(toggleAlgorithm).toHaveBeenCalled();

        const forwardBtn = controls.getByRole("button", {"name": "step-forward"});
        await userEvent.click(forwardBtn);

        expect(stepForward).toHaveBeenCalled();
    });

    it("functions should be called on arrows click", async () => {
        const stepBack = vi.fn(() => {});
        const stepForward = vi.fn(() => {});
        const toggleAlgorithm = vi.fn(() => {});

        render(<Controls isDone={false} firstState={false}
                         stepBack={stepBack} stepForward={stepForward} toggleAlgorithm={toggleAlgorithm}
                         isPaused={false}/>);
        await userEvent.keyboard("[ArrowLeft]");
        expect(stepBack).toHaveBeenCalled();

        await userEvent.keyboard("[ArrowRight]");
        expect(stepForward).toHaveBeenCalled();

        await userEvent.keyboard("[Space]");
        expect(toggleAlgorithm).toHaveBeenCalled();
    });

    it("should toggle between Play and Pause icons", () => {
        const {rerender, getByRole} = render(
            <Controls
                isDone={false}
                firstState={false}
                isPaused={false}
                stepBack={() => {}}
                stepForward={() => {}}
                toggleAlgorithm={() => {}}
            />
        );

        expect(getByRole("button", {"name": "pause"}).firstChild).toHaveClass("lucide-pause");

        rerender(
            <Controls
                isDone={false}
                firstState={false}
                isPaused={true}
                stepBack={() => {}}
                stepForward={() => {}}
                toggleAlgorithm={() => {}}
            />
        );

        expect(getByRole("button", {"name": "pause"}).firstChild).toHaveClass("lucide-play");
    });

    it("should cleanup keyboard listener on unmount", async () => {
        const stepBack = vi.fn();
        const {unmount} = render(
            <Controls
                isDone={false}
                firstState={false}
                isPaused={false}
                stepBack={stepBack}
                stepForward={() => {}}
                toggleAlgorithm={() => {}}
            />
        );

        unmount();

        await userEvent.keyboard("[ArrowLeft]");
        expect(stepBack).not.toHaveBeenCalled();
    });
});