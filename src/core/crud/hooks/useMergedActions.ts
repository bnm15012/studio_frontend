import { useMemo } from "react";
import { defaultActions, DefaultActionsProps } from "../constant/defaultActions";
import { ActionItem } from "../../types";

export const useMergedActions = (actions: ActionItem[], args: DefaultActionsProps): ActionItem[] =>
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
