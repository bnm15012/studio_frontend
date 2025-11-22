import { useMemo } from "react";

export const useMergedActions = (defaultActions, actions) =>
    useMemo(() => {
        const merged = defaultActions.map((d) => ({
            ...d,
            ...(actions.find((a) => a.name === d.name) || {}),
        }));
        return [...merged, ...actions.filter((a) => !merged.some((m) => m.name === a.name))];
    }, [defaultActions, actions]);
