import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  AppBar,
  Drawer,
  useTheme,
} from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import MenuItems from "./MenuItems";
import ImageComponent from "../../Components/ImageComponent";
import FlexBetween from "../../Components/FlexBetween";
import PropTypes from "prop-types";

export const Navbar = ({ position = "fixed" }) => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <FlexBetween zIndex={1000}>
      <AppBar
        position={position}
        sx={{
          height: "4rem",
          boxShadow: theme.shadows[2],
          backgroundColor: isScrolled ? theme.palette.background.default : theme.palette.background.alt,
          backdropFilter: 'blur(50px)',
          transition: 'all 0.3s ease',
          color: 'primary',
        }}
      >
        <FlexBetween px={2} my={"auto"}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ImageComponent size={"5vh"} image={"/logo.png"} isCircular={false} />
            <Typography fontSize={"2rem"} component="div" sx={{ fontWeight: 'bold' }} color="primary">
              Book & Manage
            </Typography>
          </Box>

          {isNonMobileScreens && <MenuItems />}

          {/* Mobile Menu Button */}
          {!isNonMobileScreens && !isMenuOpen && (
            <IconButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              sx={{ color: 'text.primary' }}
            >
              <Menu />
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
            },
          }}
        >
          <FlexBetween>
            <Box></Box>
            <IconButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              sx={{ p: 3, color: 'text.primary' }}
            >
              <Close />
            </IconButton>
          </FlexBetween>
          <MenuItems />
        </Drawer>
      </AppBar>
    </FlexBetween>
  );
};

Navbar.propTypes = {
    position: PropTypes.string,
};