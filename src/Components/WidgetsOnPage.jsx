import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { Navbar } from "../NavigationComponets/Navbar/Navbar";
import Sidebar from "../NavigationComponets/Sidebar/Sidebar";
import FlexBetween from "./FlexBetween";
import FlexBetweenColumn from "./FlexBetweenColumn";
import { useUI } from "../context/UIContext";

const WidgetsOnPage = ({ components, isSidebarShouldBeOn = false }) => {
    const theme = useTheme();
    const { isMobile } = useUI();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                // border: "1px solid red",
            }}
            height={"100vh"}
        >
            <Navbar position="static" />
            <FlexBetween height={"calc(100vh - 3.2rem)"}>
                <Sidebar sidebarOpen={isSidebarShouldBeOn} />
                <FlexBetweenColumn
                    overflow={"auto"}
                    p={2}
                    width={isMobile ? "100vw" : "calc(100vw - 13rem)"}
                    mx={0}
                    my={0}
                    pb={15}
                >
                    {components}
                </FlexBetweenColumn>
            </FlexBetween>
        </Box>
    );
};

WidgetsOnPage.propTypes = {
    title: PropTypes.string,
    components: PropTypes.node.isRequired,
    isSidebarShouldBeOn: PropTypes.bool,
    footer: PropTypes.bool,
    scrollable: PropTypes.bool,
};

export default WidgetsOnPage;
