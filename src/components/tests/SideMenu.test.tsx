import {render, waitFor} from "@testing-library/react";
import SideMenu from "../SideMenu.tsx";
import {MemoryRouter} from "react-router";
import userEvent from "@testing-library/user-event";

describe('Side Menu Component', () => {
    it("toggles menu on button clicks", async () => {
        const menu = render(<SideMenu/>, {wrapper: MemoryRouter,});
        const openButton = menu.getByRole("button", {name: "open-menu"});

        await userEvent.click(openButton);
        expect(menu.getByRole("complementary")).toHaveClass("left-0");

        const closeButton = menu.getByRole("button", {name: "close-menu"});
        await userEvent.click(closeButton);
        expect(menu.getByRole("complementary")).toHaveClass("-left-full");
    });

    const cases: Array<[string, string]> = [
        ["/bubble-sort", "Bubble sort"],
        ["/insertion-sort", "Insertion sort"],
        ["/merge-sort", "Merge sort"],
        ["/quick-sort", "Quick sort"],
        ["/bst-search", "Search"],
        ["/bst-insert", "Insert"],
        ["/bst-delete", "Remove"],
        ["/dfs", "DFS"],
        ["/bfs", "BFS"],
        ["/dijkstra", "Dijkstra"],
    ];

    it.each(cases)("highlights %s link when route is %s", (route, label) => {
        const menu = render(
            <MemoryRouter initialEntries={[route]}>
                <SideMenu />
            </MemoryRouter>
        );
        expect(menu.getByText(label)).toHaveClass("text-green-400");
    });

    it("closes menu on route change (clicking a NavLink)", async () => {
        const user = userEvent.setup();

        const menu = render(
            <MemoryRouter initialEntries={["/bubble-sort"]}>
                <SideMenu />
            </MemoryRouter>
        );

        const openButton = menu.getByRole("button", {name: "open-menu"});
        await user.click(openButton);

        const aside = menu.getByRole("complementary");
        expect(aside).toHaveClass("left-0");

        const mergeLink = menu.getByText("Merge sort");
        await user.click(mergeLink);

        await waitFor(() => {
            expect(aside).toHaveClass("-left-full");
        });
    });
});