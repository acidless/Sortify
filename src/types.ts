import type {DFSAction} from "./algorithms/dfs.ts";
import type {BFSAction} from "./algorithms/bfs.ts";
import type {BSTSearchAction} from "./algorithms/bstSearch.ts";
import type {BSTDeleteAction} from "./algorithms/bstDelete.ts";
import type {BSTInsertAction} from "./algorithms/bstInsert.ts";

export type SampleArray = Array<{ value: number, key: number }>;

export type BSTNode<T> = {
    value: number;
    left: BSTNode<T> | null;
    right: BSTNode<T> | null;
    id: string;
};

export type GraphEdge = {
    to: string;
    weight: number;
};

export type GraphNode<T> = {
    id: string;
    value: T;
    neighbors: GraphEdge[];
};

export type PositionedNode<T> = BSTNode<T> & { x: number; y: number };

export type GraphTraversalAction = DFSAction | BFSAction;
export type BSTAction = BSTSearchAction | BSTInsertAction | BSTDeleteAction;