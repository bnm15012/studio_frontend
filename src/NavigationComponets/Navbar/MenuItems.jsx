import {
  Box,
  Button,
  IconButton,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropDown";
import BranchesDropdown from "./BranchesDropdown";
import Notification from "./Notification";
import { openDialog } from "../../state/dialogSlice";
import { logoutUser } from "../../state/thunks";
import { DarkMode, LightMode } from "@mui/icons-material";
import { toggleMode } from "../../state/authSlice";

const MenuItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = useSelector(s => s.auth.mode);
  const isHomePage = location.pathname === "/";
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state) => state.auth.user);
  const settings = useSelector((state) => state.auth.settings);

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

  const NavButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.main,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    textWrap: "nowrap",
    width: isNonMobileScreens ? "" : "100%",
    '&:hover': {
      color: theme.palette.primary.dark,
      transform: 'scale(1.05)',
      backgroundColor: 'transparent',
    },
  }));

  const navButton = (label, path) => (
    <NavButton
      variant={location.pathname === path ? "contained" : ""}
      key={label}
      onClick={() => handleNavigation(path)}
    >
      {label}
    </NavButton>
  );

  const renderIconButton = (icon, onClick, tooltip) => (
    <IconButton sx={{ mx: "auto" }} onClick={onClick} title={tooltip}>
      {icon}
    </IconButton>
  );


  return (
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
      {user === "xyz" && (
        renderIconButton(
          mode === "dark" ? <LightMode sx={{ color: "whitesmoke" }} /> :
            <DarkMode sx={{ color: "black" }} />,
          async () => {
            dispatch(toggleMode())
          },
          "change mode"
        )
      )}

      {/* Authenticated User Menu */}
      {user ? (
        <>
          <Box sx={{ mx: "auto" }}>
            <Notification />
          </Box>
          {user.role === "ADMIN" &&
            settings.find((setting) => setting.navBarName === "BRANCH")?.enabled && (
              <BranchesDropdown isNonMobileScreens={isNonMobileScreens} />
            )}
          <UserProfileDropdown
            user={user}
            navigate={navigate}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        // Auth buttons
        <Box display="flex" gap={2} width={isNonMobileScreens ? "auto" : "100%"} mt={isNonMobileScreens ? 0 : 2}>
          <Button
            variant="outlined"
            sx={{
              textWrap: "nowrap",
            }}
            color="primary"
            fullWidth={!isNonMobileScreens}
            onClick={() => dispatch(openDialog("loginDialog"))}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            color="primary" sx={{
              textWrap: "nowrap",
            }}
            fullWidth={!isNonMobileScreens}
            onClick={() => dispatch(openDialog("signupDialog"))}
          >
            Get Started
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MenuItems;
