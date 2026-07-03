import React from "react";
import { Box, ListItemButton, Typography, useTheme } from "@mui/material";

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
    isNonMobileScreens: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    route,
    isSelected,
    onClick,
    isNonMobileScreens,
}) => {
    const theme = useTheme();

    return (
        <ListItemButton
            selected={isSelected}
            onClick={onClick}
            sx={{
                m: "0.2rem",
                py: isNonMobileScreens ? "1rem" : "0.75rem",
                borderRadius: "0.75rem",
                flexDirection: isNonMobileScreens ? "row" : "column",
                justifyContent: isNonMobileScreens ? "left" : "center",
                alignItems: "center",
                transition: "all 0.25s ease-in-out",
                color: "white",
                "&.Mui-selected": { bgcolor: theme.palette.primary.main },
                "&.Mui-selected:hover": { bgcolor: theme.palette.primary.dark },
                "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
        >
            <Box
                fontSize={isNonMobileScreens ? "1.6rem" : "1.4rem"}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {route.icon}
            </Box>

            <Typography
                fontSize={isNonMobileScreens ? "0.95rem" : "0.75rem"}
                mx={isNonMobileScreens ? 2 : "0.25rem"}
                fontWeight={isSelected && isNonMobileScreens ? 700 : 400}
                color="inherit"
                textAlign="center"
                sx={{
                    lineHeight: 1.2,
                    mt: isNonMobileScreens ? 0 : 0.5,
                }}
            >
                {route.label}
            </Typography>
        </ListItemButton>
    );
};

export default SidebarItem;
