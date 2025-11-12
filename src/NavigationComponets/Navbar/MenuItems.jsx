import { Button, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const MenuItems = ({ isNonMobileScreens }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const user = useSelector((state) => state.auth.user);
    

    const scrollTo = (target) => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const handleNavigation = (path) => {
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

    const navButton = (label, path) => (
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

MenuItems.propTypes = {
    isNonMobileScreens: PropTypes.bool,
};

export default MenuItems;
