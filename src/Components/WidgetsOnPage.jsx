import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { Navbar } from "../NavigationComponets/Navbar/Navbar";
import Sidebar from "../NavigationComponets/Sidebar/Sidebar";
import FlexEvenly from "./FlexEvenly";
import Footer from "./Footer";
import PropTypes from "prop-types";

const WidgetsOnPage = ({
  title,
  components,
  isSidebarShouldBeOn = false,
  footer = false,
  scrollable = true,
}) => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Navbar />
      <FlexBetween height={scrollable ? "93vh" : "none"}>
        <Sidebar
          sidebarOn={isSidebarShouldBeOn}
          isNonMobileScreens={isNonMobileScreens}
        />
        <Box
          width={
            isNonMobileScreens ? "calc(100vw - 15rem)" : "calc(100vw - 4rem)"
          }
          gap={2}
          flexGrow={1}
          maxHeight={scrollable ? "93vh" : "none"}
          overflow="auto"
        >
          {title && (
            <Box
              width="100%"
              textAlign="center"
              padding={2}
              backgroundColor={theme.palette.background.default}
              sx={{
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography
                fontWeight="bold"
                fontSize="1.5rem"
                color={theme.palette.neutral.main}
              >
                {title}
              </Typography>
            </Box>
          )}
          <FlexEvenly mx={0} my={0}>
            <Box
              display="grid"
              gridTemplateColumns={"1fr"}
              gap={1}
              width="100%"
            >
              {components}
            </Box>
          </FlexEvenly>
        </Box>
      </FlexBetween>
      {footer && <Footer />}
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
