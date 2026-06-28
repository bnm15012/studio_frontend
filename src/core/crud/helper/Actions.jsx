import { ButtonBase, Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

const Actions = ({ actions, row }) => {
    const theme = useTheme();
    const visibleActions = actions.filter((a) => !a.hide);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
            }}
        >
            {visibleActions.map(({ name, enabled, onClick, icon, sx }) => {
                const isEnabled = typeof enabled === "function" ? enabled(row) : enabled;

                return (
                    <ButtonBase
                        key={name}
                        disabled={!isEnabled}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(row);
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
                                    ? React.cloneElement(icon, {
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
        </Box>
    );
};

Actions.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            icon: PropTypes.element,
            sx: PropTypes.object,
            hide: PropTypes.bool,
            enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        }),
    ),
    row: PropTypes.object.isRequired,
};

export default Actions;
