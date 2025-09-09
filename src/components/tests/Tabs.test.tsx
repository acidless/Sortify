import {render} from '@testing-library/react'
import Tabs from "../Tabs.tsx";
import {beforeEach} from "vitest";
import userEvent from '@testing-library/user-event';

describe('Tabs Component', () => {
    let tabs: ReturnType<typeof render>;
    beforeEach(() => {
        tabs = render(<Tabs tabs={[{content: <div className="tab-1">1</div>, name: "First Tab"}, {
            content: <div className="tab-2">2</div>, name: "Second Tab"
        }]}/>);
    });

    it('empty tabs should render nothing', () => {
        tabs = render(<Tabs tabs={[]}/>);

        expect(tabs.container.textContent).toBe("");
    });

    it('default tab should be first', () => {
        expect(tabs.container.querySelector(".tab-1")).toBeInTheDocument();
    });

    it('default tab shouldn\'t be rendered', () => {
        expect(tabs.container.querySelector(".tab-2")).toBeNull();
    });

    it('tab should change on click', async () => {
        await userEvent.click(tabs.getByText("Second Tab"));
        expect(tabs.container.querySelector(".tab-2")).toBeInTheDocument();
    });
})