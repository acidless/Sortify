import {motion} from "framer-motion";

type Props = {
    id: string;
    text: string;
};

const PopupText = ({id, text}: Props) => {
    return <motion.div key={id}
                       initial={{opacity: 0, y: -10}}
                       animate={{opacity: 1, y: 0}}
                       transition={{duration: 0.3}}
                       className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl w-max">
        <p>{text}</p>
    </motion.div>
}

export default PopupText;