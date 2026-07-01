import React from "react";
import { Button, styled } from "@mui/material";
import { useAppSelector } from "../../state";
import { useNavigate, useLocation } from "react-router-dom";

interface MenuItemsProps {
    isNonMobileScreens?: boolean;
}

const MenuItems: React.FC<MenuItemsProps> = ({ isNonMobileScreens }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const user = useAppSelector((state: any) => state.auth.user);

    const scrollTo = (target: string) => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const handleNavigation = (path: string) => {
        if (path.startsWith("#")) {
            scrollTo(path);
        } else {
            navigate(path);
        }
    };

    const NavButton = styled(Button)(() => ({
        color: "white",
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 500,
        textWrap: "nowrap",
        width: isNonMobileScreens ? "" : "100%",
        "&:hover": {
            transform: "scale(1.05)",
            backgroundColor: "transparent",
        },
    }));

    const navButton = (label: string, path: string) => (
        <NavButton key={label} onClick={() => handleNavigation(path)}>
            {label}
        </NavButton>
    );

    return !user ? (
        <>
            {!isHomePage && navButton("Home", "/")}
            {navButton("About Us", "/aboutus")}
            {navButton("Contact Us", "/contactus")}
            {isHomePage && navButton("Testimonials", "#testimonials")}
            {isHomePage && navButton("Pricing", "#pricing")}
        </>
    ) : (
        <></>
    );
};

export default MenuItems;
