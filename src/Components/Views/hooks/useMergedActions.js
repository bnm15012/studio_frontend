import { useMemo } from "react";
import { defaultActions } from "../constant/defaultActions";

export const useMergedActions = (actions, args) =>
    useMemo(() => {
        const merged = defaultActions(args).map((d) => ({
            ...d,
            ...(actions.find((a) => a.name === d.name) || {}),
        }));
        return [...merged, ...actions.filter((a) => !merged.some((m) => m.name === a.name))];
    }, [args, actions]);
