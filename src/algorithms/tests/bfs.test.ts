import {bfs} from "../bfs.ts";
import {expectAction} from "./testUtils.ts";

describe('BFS', () => {
    it('graph with one node', () => {
        const node = {id: '1', value: 1, neighbors: []};

        const generator = bfs(node, [node]);
        expectAction(generator.next(), "enqueue");
        expectAction(generator.next(), "visit");
        expectAction(generator.next(), "done");
    });

    it('all nodes should be visited', () => {
        const node = {id: '1', value: 1, neighbors: [{to: '2', weight: 1}, {to: '3', weight: 1}]};
        const node2 = {id: '2', value: 2, neighbors: [{to: '3', weight: 1}]};
        const node3 = {id: '3', value: 3, neighbors: []};

        const generator = bfs(node, [node, node2, node3]);
        let value = generator.next();
        const visitedNodes = [];
        while (!value.done) {
            if (value.value.type == "visit") {
                visitedNodes.push(value.value.node.id);
            }
            value = generator.next();
        }

        expect(visitedNodes).toEqual(['1', '2', '3']);
    });
});