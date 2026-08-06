/** Renders a list of action buttons (ButtonBase) for a given row, filtering hidden/disabled actions.
 * When more than `maxVisible` actions are visible, extra actions are collapsed into a MoreVert overflow menu.
 */
import {
    ButtonBase,
    Box,
    Tooltip,
    useTheme,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";
import { ActionItem } from "@/core/types";

interface ActionsProps<T> {
    actions: ActionItem<T>[];
    row: T | T[];
    /** Max number of actions to show inline before collapsing into MoreVert menu. Default: 3 */
    maxVisible?: number;
    /** Layout direction of inline action buttons. Default: "row" */
    direction?: "row" | "column";
}

function Actions<T>({ actions, row, maxVisible = 3, direction = "row" }: ActionsProps<T>) {
    const theme = useTheme();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const visibleActions = actions.filter((a) => {
        if (typeof a.hide === "function") {
            return !(a.hide as (r: T | T[]) => boolean)(row);
        }
        return !a.hide;
    });

    const inlineActions = visibleActions.slice(0, maxVisible);
    const overflowActions = visibleActions.slice(maxVisible);
    const hasOverflow = overflowActions.length > 0;

    const resolveColor = (colorStr?: string) => {
        if (!colorStr) return theme.palette.text.secondary;
        if (colorStr === "success.main") return theme.palette.success.main;
        if (colorStr === "error.main") return theme.palette.error.main;
        if (colorStr === "primary.main") return theme.palette.primary.main;
        if (colorStr === "warning.main") return theme.palette.warning.main;
        return colorStr;
    };

    const renderInlineButton = ({ name, enabled, onClick, icon, sx, help }: ActionItem<T>) => {
        const isEnabled = typeof enabled === "function" ? enabled(row as T) : (enabled ?? true);
        const actionColor = resolveColor(sx?.color);

        return (
            <Tooltip key={name} title={help ?? name} arrow placement="top">
                <ButtonBase
                    disabled={!isEnabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.(row as T);
                    }}
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        color: actionColor,
                        backgroundColor: isEnabled
                            ? alpha(actionColor, 0.08)
                            : alpha(theme.palette.action.disabled, 0.04),
                        border: `1px solid ${alpha(actionColor, 0.2)}`,
                        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                        opacity: isEnabled ? 1 : 0.4,
                        "&:hover": {
                            backgroundColor: alpha(actionColor, 0.16),
                            borderColor: alpha(actionColor, 0.4),
                            transform: "translateY(-1px)",
                            boxShadow: `0 2px 6px ${alpha(actionColor, 0.25)}`,
                        },
                    }}
                    aria-label={help ?? name}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "& .MuiSvgIcon-root": { fontSize: "1.1rem" },
                            "& svg": { width: 17, height: 17 },
                            color: "inherit",
                        }}
                    >
                        {icon
                            ? React.isValidElement(icon)
                                ? React.cloneElement(icon as React.ReactElement, {
                                      sx: {
                                          fontSize: "1.1rem",
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
    };

    return (
        <Box sx={{ display: "flex", flexDirection: direction, alignItems: "center", gap: 0.75 }}>
            {inlineActions.map(renderInlineButton)}

            {hasOverflow && (
                <>
                    <Tooltip title="More actions" arrow placement="top">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuAnchor(e.currentTarget);
                            }}
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                color: theme.palette.text.secondary,
                                backgroundColor: alpha(theme.palette.text.secondary, 0.06),
                                border: `1px solid ${alpha(theme.palette.text.secondary, 0.18)}`,
                                transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    borderColor: alpha(theme.palette.primary.main, 0.35),
                                    color: theme.palette.primary.main,
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            <MoreVertIcon sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={(e) => {
                            (e as React.MouseEvent)?.stopPropagation?.();
                            setMenuAnchor(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        slotProps={{
                            paper: {
                                sx: {
                                    borderRadius: 2,
                                    minWidth: 170,
                                    boxShadow: theme.shadows[4],
                                    p: 0.5,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        {overflowActions.map(({ name, enabled, onClick, icon, sx, help }, i) => {
                            const isEnabled =
                                typeof enabled === "function"
                                    ? enabled(row as T)
                                    : (enabled ?? true);
                            const actionColor = resolveColor(sx?.color);

                            return (
                                <React.Fragment key={name}>
                                    {i > 0 && i === overflowActions.length - 1 && (
                                        <Divider sx={{ my: 0.5 }} />
                                    )}
                                    <MenuItem
                                        disabled={!isEnabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuAnchor(null);
                                            onClick?.(row as T);
                                        }}
                                        sx={{
                                            borderRadius: 1,
                                            py: 0.75,
                                            px: 1.25,
                                            "&:hover": {
                                                backgroundColor: alpha(actionColor, 0.08),
                                            },
                                        }}
                                    >
                                        {icon && (
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 28,
                                                    color: actionColor,
                                                }}
                                            >
                                                {React.isValidElement(icon)
                                                    ? React.cloneElement(
                                                          icon as React.ReactElement,
                                                          { fontSize: "small" },
                                                      )
                                                    : icon}
                                            </ListItemIcon>
                                        )}
                                        <ListItemText
                                            primary={help ?? name}
                                            primaryTypographyProps={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: isEnabled ? "text.primary" : "text.disabled",
                                            }}
                                        />
                                    </MenuItem>
                                </React.Fragment>
                            );
                        })}
                    </Menu>
                </>
            )}
        </Box>
    );
}

export default Actions;
