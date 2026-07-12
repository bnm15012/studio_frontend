import React, { useState } from "react";
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
import ImageComponent from "@/core/components/fields/ImageComponent";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import AuthButtons from "./AuthButtons";
import { useUI } from "@/context/UIContext";

export interface NavbarProps {
    Component?: React.ElementType;
    position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
}

export const Navbar: React.FC<NavbarProps> = ({ position = "fixed", Component }) => {
    const theme = useTheme();
    const { isMobile } = useUI();

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <FlexBetween zIndex={1000}>
            <AppBar
                position={position}
                sx={{
                    minHeight: "3.2rem",
                    height: "auto",
                    boxShadow: theme.shadows[5],
                    backgroundColor: "rgb(37,10,49)",
                    backdropFilter: "blur(50px)",
                    transition: "all 0.3s ease",
                    color: "primary",
                }}
            >
                <FlexBetween px={isMobile ? 1 : 2} my={"auto"}>
                    {/* Logo */}
                    <Box
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

                    {/* <ToggleTheme /> */}
                    {isNonMobileScreens && (
                        <FlexBetween gap={3}>
                            <MenuItems isNonMobileScreens={isNonMobileScreens} />
                        </FlexBetween>
                    )}
                    <FlexBetween>
                        {!Component ? (
                            <Box display="flex" gap={1} mt={0}>
                                <AuthButtons isNonMobileScreens={isNonMobileScreens} />
                            </Box>
                        ) : (
                            <Component />
                        )}
                        {!isNonMobileScreens && !isMenuOpen && !Component && (
                            <IconButton
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                sx={{ mx: 1, color: "white" }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </FlexBetween>
                </FlexBetween>
                <Drawer
                    anchor="right"
                    open={isMenuOpen && !isNonMobileScreens && !Component}
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
