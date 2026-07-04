import { useMemo } from "react";
import { defaultActions, DefaultActionsProps } from "../constant/defaultActions";
import { ActionItem } from "../../types";

export const useMergedActions = <T extends Record<string, unknown> = Record<string, unknown>>(
    actions: ActionItem<T>[],
    args: DefaultActionsProps<T>,
): ActionItem<T>[] =>
    useMemo(() => {
        // Compute once and reuse — avoids calling defaultActions(args) twice per render.
        const defaults = defaultActions<T>(args);
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
