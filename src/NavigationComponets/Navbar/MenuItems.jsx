import {
  Box,
  Button,
  Link,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropDown";
import FlexBetween from "../../Components/FlexBetween";
import BranchesDropdown from "./BranchesDropdown";
import { LoginRounded } from "@mui/icons-material";
import Notification from "./Notification";
import { openDialog } from "../../state/dialogSlice";
import { logoutUser } from "../../state/thunks";

const MenuItems = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const settings = useSelector((state) => state.auth.settings);

  const buttonStyles = {
    color: "whitesmoke",
    fontSize: "1rem",
    textTransform: "capitalize",
    "&:hover": {
      color: theme.palette.primary.light,
      backgroundColor: theme.palette.primary.dark,
    },
  };

  const handleLogout = async () => {
    dispatch(logoutUser())
    navigate("/");
  };

  const renderNavLink = (href, label) => (
    <Link
      href={href}
      underline="none"
      onClick={(e) => {
        e.preventDefault();
        if (String(href).startsWith("#")) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          navigate(href);
        }
      }}
    >
      <Button sx={buttonStyles}>{label}</Button>
    </Link>
  );

  const isHomePage = location.pathname === "/";

  return (
    <>
      {!user && (
        <>
          {!isHomePage && renderNavLink("/", "Home")}
          {renderNavLink("/aboutus", "About Us")}
          {renderNavLink("/contactus", "Contact Us")}
          {isHomePage && renderNavLink("#pricing", "Pricing")}
        </>
      )}

      {user ? (
        <>
          <Notification />
          {user.role === "ADMIN" &&
            settings.find((setting) => setting.navBarName === "BRANCH")?.enabled && (
              <BranchesDropdown />
            )}
          <UserProfileDropdown
            user={user}
            navigate={navigate}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        <Button
          onClick={() => dispatch(openDialog("loginDialog"))}
          sx={{ ...buttonStyles, marginRight: 1 }}
        >
          <FlexBetween gap={1}>
            <LoginRounded sx={{ cursor: "pointer", color: "whitesmoke" }} />
            <Box>Log In</Box>
          </FlexBetween>
        </Button>
      )}
    </>
  );
};

export default MenuItems;
