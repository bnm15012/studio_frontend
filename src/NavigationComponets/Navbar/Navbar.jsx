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
import AuthButtons from "./AuthButtons";
import { useSelector } from "react-redux";
import SearchField from "../../Components/SearchField";
import { useUI } from "../../context/UIContext";
import { usePageSearch } from "../../hooks/useSearch";

export const Navbar = ({ position = "fixed" }) => {
    const theme = useTheme();
    const { isMobile } = useUI();
    const user = useSelector((state) => state.auth.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { triggerSearch } = usePageSearch();

    return (
        <FlexBetween zIndex={1000}>
            <AppBar
                position={position}
                sx={{
                    height: "3.2rem",
                    boxShadow: theme.shadows[10],
                    backgroundColor: "rgb(37,10,49)",
                    backdropFilter: "blur(50px)",
                    transition: "all 0.3s ease",
                    color: "primary",
                }}
            >
                <FlexBetween px={2} my={"auto"}>
                    {/* Logo */}
                    <Box mr={"auto"} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <ImageComponent size={"2.5rem"} value={"/logo.png"} isCircular={false} />
                        {!isMobile && (
                            <Typography
                                fontSize={"1.4rem"}
                                component="div"
                                sx={{ textWrap: "nowrap", fontWeight: "bold" }}
                                color="white"
                            >
                                Book & Manage
                            </Typography>
                        )}
                    </Box>
                    {user && <SearchField handleSearch={triggerSearch} />}
                    {isNonMobileScreens && (
                        <FlexBetween gap={3}>
                            <MenuItems isNonMobileScreens={isNonMobileScreens} />
                        </FlexBetween>
                    )}

                    {/* Mobile Menu Button */}
                    {!isNonMobileScreens && !isMenuOpen && (
                        <IconButton
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            sx={{ color: "white" }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    {isNonMobileScreens && !user && (
                        <Box
                            display="flex"
                            gap={2}
                            width={isNonMobileScreens ? "auto" : "100%"}
                            mt={isNonMobileScreens ? 0 : 2}
                        >
                            <AuthButtons isNonMobileScreens={isNonMobileScreens} />
                        </Box>
                    )}
                </FlexBetween>
                <Drawer
                    anchor="right"
                    open={isMenuOpen && !isNonMobileScreens}
                    onClose={() => setIsMenuOpen(false)}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: "250px",
                            backgroundColor: "rgb(37,10,49)",
                        },
                    }}
                >
                    <Box>
                        <FlexBetween p={2}>
                            <Box></Box>
                            <IconButton
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                sx={{ p: 3, color: "white" }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </FlexBetween>
                        <FlexBetween
                            flexDirection={"column"}
                            gap={2}
                            p={1}
                            width={"10rem"}
                            m={"auto"}
                        >
                            <MenuItems />
                            {!user && <AuthButtons isNonMobileScreens={isNonMobileScreens} />}
                        </FlexBetween>
                    </Box>
                </Drawer>
            </AppBar>
        </FlexBetween>
    );
};

Navbar.propTypes = { position: PropTypes.string };
