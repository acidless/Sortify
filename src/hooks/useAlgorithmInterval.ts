import {type RefObject, useEffect, useRef} from "react";

function useAlgorithmInterval() : [RefObject<number | null>, () => void] {
    const intervalRef = useRef<number | null>(null);

    function cleanupInterval() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    useEffect(() => {
        return () => {
            cleanupInterval();
        };
    }, []);

    return [intervalRef, cleanupInterval];
}

export default useAlgorithmInterval;