import {
  Box,
  Button,
  styled,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropDown";
import BranchesDropdown from "./BranchesDropdown";
import Notification from "./Notification";
import { logoutUser } from "../../state/thunks";
// import { toggleMode } from "../../state/authSlice";
import PropTypes from "prop-types";
import AuthButtons from "./AuthButtons";
import { useUI } from "../../context/UIContext";
// import DarkMode from "@mui/icons-material/DarkMode";
// import LightMode from "@mui/icons-material/LightMode";

const MenuItems = ({ isNonMobileScreens }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isEnabled, FEATURE_KEYS } = useUI();
  const location = useLocation();
  // const mode = useSelector(s => s.auth.mode);
  const isHomePage = location.pathname === "/";
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/");
  };

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
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    textWrap: "nowrap",
    width: isNonMobileScreens ? "" : "100%",
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: 'transparent',
    },
  }));

  const navButton = (label, path) => (
    <NavButton
      // variant={location.pathname === path ? "contained" : ""}
      key={label}
      onClick={() => handleNavigation(path)}
    >
      {label}
    </NavButton>
  );

  // const renderIconButton = (icon, onClick, tooltip) => (
  //   <IconButton sx={{ mx: "auto" }} onClick={onClick} title={tooltip}>
  //     {icon}
  //   </IconButton>
  // );

  return (
    <>
      <Box
        display={isNonMobileScreens ? "flex" : "flex"}
        flexDirection={isNonMobileScreens ? "row" : "column"}
        alignItems={isNonMobileScreens ? "center" : "flex-start"}
        gap={isNonMobileScreens ? 3 : 2}
        px={isNonMobileScreens ? 0 : 1}
        py={isNonMobileScreens ? 0 : 1}
      >
        {/* Public Nav Items */}
        {!user && (
          <>
            {!isHomePage && navButton("Home", "/")}
            {navButton("About Us", "/aboutus")}
            {navButton("Contact Us", "/contactus")}
            {isHomePage && navButton("Testimonials", "#testimonials")}
            {isHomePage && navButton("Pricing", "#pricing")}
          </>
        )}
        {/* {user && (
          renderIconButton(
            mode === "dark" ? <LightMode sx={{ color: "whitesmoke" }} /> :
              <DarkMode sx={{ color: "black" }} />,
            async () => {
              dispatch(toggleMode())
            },
            "change mode"
          )
        )} */}

        {/* Authenticated User Menu */}
        {user && (
          <>
            <Notification />
            {user.role === "ADMIN" &&
              isEnabled(FEATURE_KEYS.BRANCH) && (
                <BranchesDropdown isNonMobileScreens={isNonMobileScreens} />
              )}
            <UserProfileDropdown
              user={user}
              navigate={navigate}
              handleLogout={handleLogout}
            />
          </>
        )}
      </Box>
      {
        !user && <AuthButtons isNonMobileScreens={isNonMobileScreens} />
      }
    </>
  );
};

MenuItems.propTypes = {
  isNonMobileScreens: PropTypes.bool,
};

export default MenuItems;
