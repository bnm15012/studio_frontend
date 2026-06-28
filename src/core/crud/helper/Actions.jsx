import { ButtonBase, Box, Typography, useTheme } from "@mui/material";
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
                gap: 0.5,
            }}
        >
            {visibleActions.map(({ name, enabled, onClick, icon, sx }, index) => {
                const isEnabled = typeof enabled === "function" ? enabled(row) : enabled;
                const isLast = index === visibleActions.length - 1;

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
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 44,
                            minHeight: 44,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "12px",
                            gap: 0.25,
                            transition: "all 0.2s ease",
                            opacity: isEnabled ? 1 : 0.4,
                            ...(isLast && isEnabled
                                ? {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                      "&:hover": {
                                          backgroundColor: alpha(theme.palette.primary.main, 0.14),
                                      },
                                  }
                                : {
                                      "&:hover": {
                                          backgroundColor: alpha(theme.palette.action.hover, 0.6),
                                      },
                                  }),
                        }}
                        aria-label={name}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "& .MuiSvgIcon-root": {
                                    fontSize: "1.25rem",
                                },
                                "& svg": {
                                    width: 20,
                                    height: 20,
                                },
                                color: sx?.color || theme.palette.text.secondary,
                            }}
                        >
                            {icon
                                ? React.isValidElement(icon)
                                    ? React.cloneElement(icon, {
                                          sx: {
                                              fontSize: "1.25rem",
                                              color: "inherit",
                                              ...(icon.props?.sx || {}),
                                          },
                                      })
                                    : icon
                                : null}
                        </Box>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: "0.625rem",
                                fontWeight: 500,
                                color: sx?.color || theme.palette.text.secondary,
                                lineHeight: 1,
                                textTransform: "capitalize",
                            }}
                        >
                            {name}
                        </Typography>
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
