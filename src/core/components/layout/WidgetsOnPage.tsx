import React from "react";
import { Box, useTheme } from "@mui/material";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import Sidebar from "@/NavigationComponets/Sidebar/Sidebar";
import { FlexBetween, FlexBetweenColumn } from "./FlexBox";
import { useUI } from "@/context/UIContext";

export interface WidgetsOnPageProps {
    components: React.ReactNode;
    isSidebarShouldBeOn?: boolean;
    title?: string;
    footer?: boolean;
    scrollable?: boolean;
}

const WidgetsOnPage: React.FC<WidgetsOnPageProps> = ({
    components,
    isSidebarShouldBeOn = false,
}) => {
    const theme = useTheme();
    const { isMobile } = useUI();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                overflowX: "hidden",
                maxWidth: "100vw",
            }}
            height={"100vh"}
        >
            <Navbar position="static" />
            <FlexBetween height={"calc(100vh - 3.2rem)"} sx={{ overflowX: "hidden" }}>
                <Sidebar sidebarOpen={isSidebarShouldBeOn} />
                <FlexBetweenColumn
                    overflow={"auto"}
                    p={isMobile ? 1 : 2}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: "100%",
                    }}
                    mx={0}
                    my={0}
                >
                    {components}
                </FlexBetweenColumn>
            </FlexBetween>
        </Box>
    );
};

export default WidgetsOnPage;
