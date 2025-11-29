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
import UserProfileDropdown from "./UserProfileDropDown";
import BranchesDropdown from "./BranchesDropdown";
import Notification from "./Notification";
import FlexBetween from "../../Components/FlexBetween";
import PropTypes from "prop-types";
import AuthButtons from "./AuthButtons";
import { logoutUser } from "../../state/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useUI } from "../../context/UIContext";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";

export const Navbar = ({ position = "fixed" }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { isMobile } = useUI();

    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isEnabled, isAdmin, FEATURE_KEYS } = useUI();
    const handleLogout = async () => {
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <FlexBetween zIndex={1000}>
            <AppBar
                position={position}
                sx={{
                    height: "3.2rem",
                    boxShadow: theme.shadows[5],
                    backgroundColor: "rgb(37,10,49)",
                    backdropFilter: "blur(50px)",
                    transition: "all 0.3s ease",
                    color: "primary",
                }}
            >
                <FlexBetween px={isMobile ? 0 : 2} my={"auto"}>
                    {/* Logo */}
                    <Box
                        mr={"auto"}
                        sx={{
                            cursor: "pointer",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
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

                    <ToggleTheme />

                    {isNonMobileScreens && (
                        <FlexBetween gap={3}>
                            <MenuItems isNonMobileScreens={isNonMobileScreens} />
                        </FlexBetween>
                    )}

                    {!user ? (
                        <Box display="flex" gap={1} mt={0}>
                            <AuthButtons isNonMobileScreens={isNonMobileScreens} />
                        </Box>
                    ) : (
                        <FlexBetween>
                            <Notification />
                            {isAdmin && isEnabled(FEATURE_KEYS.BRANCH) && (
                                <BranchesDropdown isNonMobileScreens={isNonMobileScreens} />
                            )}
                            <UserProfileDropdown
                                user={user}
                                navigate={navigate}
                                handleLogout={handleLogout}
                            />
                        </FlexBetween>
                    )}
                    {!isNonMobileScreens && !isMenuOpen && !user && (
                        <IconButton
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            sx={{ mx: 1, color: "white" }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </FlexBetween>
                <Drawer
                    anchor="right"
                    open={isMenuOpen && !isNonMobileScreens && !user}
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
                        </FlexBetween>
                    </Box>
                </Drawer>
            </AppBar>
        </FlexBetween>
    );
};

Navbar.propTypes = { position: PropTypes.string };
