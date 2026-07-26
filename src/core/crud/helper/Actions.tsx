/** Renders a list of action buttons (ButtonBase) for a given row, filtering hidden/disabled actions. */
import { ButtonBase, Box, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React from "react";
import { ActionItem } from "../../types";

interface ActionsProps<T> {
    actions: ActionItem<T>[];
    row: T | T[];
}

function Actions<T>({ actions, row }: ActionsProps<T>) {
    const theme = useTheme();
    const visibleActions = actions.filter((a) => {
        if (typeof a.hide === "function") {
            return !(a.hide as (r: T | T[]) => boolean)(row);
        }
        return !a.hide;
    });

    return (
        <>
            {visibleActions.map(({ name, enabled, onClick, icon, sx, help }) => {
                const isEnabled =
                    typeof enabled === "function" ? enabled(row as T) : (enabled ?? true);

                return (
                    <Tooltip key={name} title={help ?? name}>
                        <ButtonBase
                            disabled={!isEnabled}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.(row as T);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 44,
                                minHeight: 40,
                                px: 1.5,
                                borderRadius: "10px",
                                transition: "all 0.15s ease",
                                opacity: isEnabled ? 1 : 0.35,
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                },
                            }}
                            aria-label={help ?? name}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "1.2rem",
                                    },
                                    "& svg": {
                                        width: 19,
                                        height: 19,
                                    },
                                    color: sx?.color || theme.palette.text.secondary,
                                }}
                            >
                                {icon
                                    ? React.isValidElement(icon)
                                        ? React.cloneElement(icon as React.ReactElement, {
                                              sx: {
                                                  fontSize: "1.2rem",
                                                  color: "inherit",
                                                  ...(icon.props.sx || {}),
                                              },
                                          })
                                        : icon
                                    : null}
                            </Box>
                        </ButtonBase>
                    </Tooltip>
                );
            })}
        </>
    );
}

export default Actions;
