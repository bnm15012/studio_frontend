import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { Navbar } from "../NavigationComponets/Navbar/Navbar";
import Sidebar from "../NavigationComponets/Sidebar/Sidebar";
import FlexBetween from "./FlexBetween";
import FlexBetweenColumn from "./FlexBetweenColumn";

const WidgetsOnPage = ({
  components,
  isSidebarShouldBeOn = false,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }} height={"100vh"} >
      <Navbar position="static" />
      <FlexBetween height={"calc(100vh - 3.2rem)"}>
        <Sidebar
          sidebarOn={isSidebarShouldBeOn}
        />
        <FlexBetweenColumn overflow={"auto"} p={2} width={"calc(100vw - 13rem)"} mx={0} my={0}>
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
