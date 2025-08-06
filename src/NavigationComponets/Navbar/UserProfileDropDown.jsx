import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import { ArrowDropDown, Logout } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import FlexBetween from "../../Components/FlexBetween";
import SubscriptionPopup from "../../Pages/Auth/SubscriptionPopup";
import { openDialog } from "../../state/dialogSlice";


const UserProfileDropdown = ({ user, handleLogout }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openplansPopUp, setOpenplansPopUp] = useState(false)
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <FlexBetween
      height={"100%"}
      alignItems={"center"}
    >
      <Button onClick={handleClick}>
        <FlexBetween alignItems={"center"}>
          <Box>WELCOME {user.userName}</Box>
          <ArrowDropDown />
        </FlexBetween>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
      >
        {user?.role === "ADMIN" &&
          <MenuItem
            onClick={() => {
              dispatch(openDialog("profileDialog"));
              handleClose();
            }}
          >
            Profile
          </MenuItem>}
        <MenuItem
          onClick={() => {
            dispatch(openDialog("changePassDialog"));
            handleClose();
          }}
        >
          Change Password
        </MenuItem>
        {
          user?.role === "ADMIN" && <>
            <MenuItem
              onClick={() => {
                dispatch(openDialog("subscriptionDialog"));
                handleClose();
              }}
            >
              Subscription
            </MenuItem>
            <MenuItem
              onClick={() => setOpenplansPopUp(!openplansPopUp)
              }
            >
              Plans
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(openDialog("settingsDialog"));
                handleClose();
              }}
            >
              Settings
            </MenuItem>
          </>
        }
        <MenuItem
          onClick={() => {
            dispatch(openDialog("configurationDialog"));
            handleClose();
          }}
        >
          Configurations
        </MenuItem>
        {/* Logout option */}
        <MenuItem
          onClick={() => {
            handleLogout();
            handleClose();
          }}
        >
          <Logout /> Logout
        </MenuItem>
      </Menu>
      {
        openplansPopUp &&
        <SubscriptionPopup popupOn={openplansPopUp} setPopup={() => setOpenplansPopUp(!openplansPopUp)} />
      }
    </FlexBetween>
  );
};

UserProfileDropdown.propTypes = {
  user: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default UserProfileDropdown;
