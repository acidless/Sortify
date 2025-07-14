import { forwardRef } from "react";

type Props = {
    node: number;
    id: string;
    x: number;
    y: number;
    stateFunc: (id: string) => string;
};

const BSTNode = forwardRef<HTMLDivElement, Props>(({ node, id, x, y, stateFunc }, ref) => {
    return (
        <div
            ref={ref}
            id={id}
            style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
            }}
            className={`w-24 h-24 border ${stateFunc(id)} dark-bg text-3xl flex items-center justify-center rounded-full shadow-md absolute`}
        >
            {node}
        </div>
    );
});

export default BSTNode;