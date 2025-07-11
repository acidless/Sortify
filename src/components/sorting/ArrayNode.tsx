import {ArrowUp} from "lucide-react";
import {motion} from 'framer-motion'

type Props = {
    value: number;
    className?: string;
}

const ArrayNode = ({value, className = "border-neutral-700"}: Props) => {
    return (
        <motion.div layout transition={{type: 'spring', stiffness: 100, damping: 30}}
                    className={`flex-shrink-0 text-3xl w-24 h-24 border ${className} transition-colors duration-300 flex items-center justify-center rounded-xl relative`}>
            {value}
            <div
                className={`absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${className === "border-yellow-400" ? "opacity-100" : "opacity-0"}`}>
                <ArrowUp className="w-8 h-auto"></ArrowUp>
            </div>
        </motion.div>
    );
}

export default ArrayNode;