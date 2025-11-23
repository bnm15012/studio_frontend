import { useMemo } from "react";
import { defaultActions } from "../constant/defaultActions";

export const useMergedActions = (actions, args) =>
    useMemo(() => {
        const defaults = defaultActions(args).map((def) => {
            const override = actions.find((a) => a.name === def.name);
            return override ? { ...def, ...override } : def;
        });
        return [
            ...defaults,
            ...actions.filter((a) => !defaultActions(args).some((def) => def.name === a.name)),
        ];
    }, [args, actions]);
