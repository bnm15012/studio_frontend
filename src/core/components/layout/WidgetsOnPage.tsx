import React from "react";
import { Box } from "@mui/material";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import Sidebar from "@/NavigationComponets/Sidebar/Sidebar";
import { useUI } from "@/context/UIContext";
import AuthenticatedNavbarSection from "@/NavigationComponets/Navbar/AuthenticatedNavbarSection";

/**
 * WidgetsOnPage
 *
 * Shell layout: Navbar (top) + optional Sidebar (left) + scrollable content area.
 *
 * The navbar height is captured once via a CSS custom property (`--navbar-h`) set
 * on the outer Box, so every child can reference it without magic numbers.
 *
 * Supports both `children` (preferred) and the legacy `components` prop so existing
 * call-sites don't need to be updated immediately.
 */

// Navbar height — single source of truth used everywhere in this component
const NAVBAR_H = "3.2rem";

export interface WidgetsOnPageProps {
    children?: React.ReactNode;
    isSidebarShouldBeOn?: boolean;
}

const WidgetsOnPage: React.FC<WidgetsOnPageProps> = ({ children, isSidebarShouldBeOn = false }) => {
    const { isMobile } = useUI();

    return (
        <Box
            sx={{
                "--navbar-h": NAVBAR_H,
                display: "flex",
                flexDirection: "column",
                height: "100dvh",
                maxWidth: "100vw",
                overflow: "hidden",
                bgcolor: "background.default",
            }}
        >
            <Box sx={{ flexShrink: 0 }}>
                <Navbar position="static" Component={AuthenticatedNavbarSection} />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <Sidebar sidebarOpen={isSidebarShouldBeOn} />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        px: isMobile ? 1 : 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default WidgetsOnPage;
