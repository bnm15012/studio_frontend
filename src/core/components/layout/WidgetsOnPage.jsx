import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { Navbar } from "../../../NavigationComponets/Navbar/Navbar";
import Sidebar from "../../../NavigationComponets/Sidebar/Sidebar";
import { FlexBetween, FlexBetweenColumn } from "./FlexBox";
import { useUI } from "../../context/UIContext";

const WidgetsOnPage = ({ components, isSidebarShouldBeOn = false }) => {
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

WidgetsOnPage.propTypes = {
    title: PropTypes.string,
    components: PropTypes.node.isRequired,
    isSidebarShouldBeOn: PropTypes.bool,
    footer: PropTypes.bool,
    scrollable: PropTypes.bool,
};

export default WidgetsOnPage;
