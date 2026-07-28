/** Hook that merges user-provided actions with default CRUD actions (edit, delete, form), allowing overrides by name. */
import { useMemo } from "react";
import { defaultActions, DefaultActionsProps } from "@/core/crud/constant/defaultActions";
import { ActionItem } from "@/core/types";

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

        return [...merged, ...actions.filter((a) => !defaultNames.has(a.name))];
    }, [args, actions]);
