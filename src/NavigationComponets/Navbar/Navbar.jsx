import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  AppBar,
  Drawer,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItems from "./MenuItems";
import ImageComponent from "../../Components/ImageComponent";
import FlexBetween from "../../Components/FlexBetween";
import PropTypes from "prop-types";

export const Navbar = ({ position = "fixed" }) => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <FlexBetween zIndex={1000}>
      <AppBar
        position={position}
        sx={{
          height: "3.2rem",
          boxShadow: theme.shadows[10],
          backgroundColor: "rgb(37,10,49)",
          backdropFilter: 'blur(50px)',
          transition: 'all 0.3s ease',
          color: 'primary',
        }}
      >
        <FlexBetween px={2} my={"auto"}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ImageComponent size={"2.5rem"} image={"/logo.png"} isCircular={false} />
            <Typography fontSize={"1.4rem"} component="div" sx={{ textWrap: "nowrap", fontWeight: 'bold' }} color="white">
              Book & Manage
            </Typography>
          </Box>

          {isNonMobileScreens && <MenuItems isNonMobileScreens={isNonMobileScreens} />}

          {/* Mobile Menu Button */}
          {!isNonMobileScreens && !isMenuOpen && (
            <IconButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </FlexBetween>
        <Drawer
          anchor="right"
          open={isMenuOpen && !isNonMobileScreens}
          onClose={() => setIsMenuOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              backgroundColor: "rgb(37,10,49)"
            },
          }}
        >
          <Box >
            <FlexBetween p={2}>
              <Box></Box>
              <IconButton
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                sx={{ p: 3, color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </FlexBetween>
            <MenuItems />
          </Box>
        </Drawer>
      </AppBar>
    </FlexBetween>
  );
};

Navbar.propTypes = {
  position: PropTypes.string,
};