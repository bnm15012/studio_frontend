import React from "react";
import { Box, ListItemButton, Tooltip, Typography, useTheme } from "@mui/material";

export interface SidebarRoute {
    path: string;
    label: string;
    icon: React.ReactNode;
    show?: boolean;
    showOnBottomBar?: boolean;
}

interface SidebarItemProps {
    route: SidebarRoute;
    isSelected: boolean;
    onClick: () => void;
    /** Desktop full-width sidebar (true) vs mobile grid card (false) */
    isNonMobileScreens: boolean;
    /** Desktop icon-only collapsed mode */
    iconOnly?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    route,
    isSelected,
    onClick,
    isNonMobileScreens,
    iconOnly = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const btn = (
        <ListItemButton
            selected={isSelected}
            onClick={onClick}
            sx={{
                m: "0.2rem",
                py: "0.75rem",
                px: iconOnly ? "0.5rem" : isNonMobileScreens ? "0.75rem" : "0.5rem",
                borderRadius: "0.75rem",
                flexDirection: isNonMobileScreens && !iconOnly ? "row" : "column",
                justifyContent: isNonMobileScreens && !iconOnly ? "flex-start" : "center",
                alignItems: "center",
                transition: "all 0.25s ease-in-out",
                color: isDark ? theme.palette.text.primary : "white",
                minWidth: 0,
                "&.Mui-selected": { bgcolor: theme.palette.primary.main },
                "&.Mui-selected:hover": { bgcolor: theme.palette.primary.dark },
                "&:hover": {
                    bgcolor: isDark ? "rgba(255,255,255,0.08)" : theme.palette.primary.dark,
                },
            }}
        >
            <Box
                fontSize="1.4rem"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ flexShrink: 0 }}
            >
                {route.icon}
            </Box>

            {/* Label: hidden in icon-only mode, shown in mobile grid and full desktop */}
            {!iconOnly && (
                <Typography
                    fontSize={isNonMobileScreens ? "0.875rem" : "0.75rem"}
                    mx={isNonMobileScreens ? 1.5 : "0.25rem"}
                    fontWeight={isSelected && isNonMobileScreens ? 700 : 400}
                    color="inherit"
                    textAlign={isNonMobileScreens ? "left" : "center"}
                    noWrap={isNonMobileScreens}
                    sx={{
                        lineHeight: 1.2,
                        mt: isNonMobileScreens ? 0 : 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {route.label}
                </Typography>
            )}
        </ListItemButton>
    );

    // Wrap with tooltip when icon-only so users still see the label on hover
    if (iconOnly && isNonMobileScreens) {
        return (
            <Tooltip title={route.label} placement="right" arrow>
                {btn}
            </Tooltip>
        );
    }

    return btn;
};

export default SidebarItem;
