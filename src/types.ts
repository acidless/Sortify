export type SampleArray = Array<{ value: number, key: number }>;

export type BSTNode = {
    value: number;
    left: BSTNode | null;
    right: BSTNode | null;
    id: string;
};

export type PositionedNode = BSTNode & { x: number; y: number };