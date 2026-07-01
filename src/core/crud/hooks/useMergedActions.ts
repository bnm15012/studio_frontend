import { useMemo } from "react";
import { defaultActions } from "../constant/defaultActions";
import { ActionItem } from "../helper/Actions";

export const useMergedActions = (actions: ActionItem[], args: Record<string, unknown>): ActionItem[] =>
    useMemo(() => {
        // Compute once and reuse — avoids calling defaultActions(args) twice per render.
        const defaults = defaultActions(args);
        const defaultNames = new Set(defaults.map((d) => d.name));

        const merged = defaults.map((def) => {
            const override = actions.find((a) => a.name === def.name);
            return override ? { ...def, ...override } : def;
        });

        return [
            ...merged,
            ...actions.filter((a) => !defaultNames.has(a.name)),
        ];
    }, [args, actions]);
