/** Renders a list of action buttons (ButtonBase) for a given row, filtering hidden/disabled actions. */
import { ButtonBase, Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React from "react";
import { ActionItem, Entity } from "../../types";

interface ActionsProps<T extends Entity> {
    actions: ActionItem<T>[];
    row: T | T[];
}

function Actions<T extends Entity>({ actions, row }: ActionsProps<T>) {
    const theme = useTheme();
    const visibleActions = actions.filter((a) => !a.hide);

    return (
        <>
            {visibleActions.map(({ name, enabled, onClick, icon, sx }) => {
                const isEnabled =
                    typeof enabled === "function" ? enabled(row as T) : (enabled ?? true);

                return (
                    <ButtonBase
                        key={name}
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
                        aria-label={name}
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
                                              ...(icon.props?.sx || {}),
                                          },
                                      })
                                    : icon
                                : null}
                        </Box>
                    </ButtonBase>
                );
            })}
        </>
    );
}

export default Actions;
