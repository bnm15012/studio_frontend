/** useLongPress — fires a callback after a long press/touch (default 700ms), returning mouse/touch event handlers. */
import { useCallback, useRef } from "react";

type UseLongPressOptions = {
    delay?: number;
};

export function useLongPress(
    callback: (e: React.MouseEvent | React.TouchEvent) => void,
    { delay = 700 }: UseLongPressOptions = {},
) {
    const timerRef = useRef<number | null>(null);
    const fired = useRef(false);

    const start = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            fired.current = false;
            timerRef.current = window.setTimeout(() => {
                fired.current = true;
                callback(e);
            }, delay);
        },
        [callback, delay],
    );

    const stop = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return {
        fired,
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
        onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
}
