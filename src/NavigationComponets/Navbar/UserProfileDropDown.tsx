import React, { useState } from "react";
import { Menu, MenuItem, Button, Typography } from "@mui/material";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Logout from "@mui/icons-material/Logout";
import { useAppDispatch } from "@/state";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import SubscriptionPopup from "@/Pages/Auth/SubscriptionPopup";
import { openDialog } from "@/state/dialogSlice";
import { useAppUI } from "@/context/UIContext";
import { User } from "@/api/types";
import { logoutUser } from "@/state/thunks";

export interface UserProfileDropdownProps {
    user: User;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ user }) => {
    const dispatch = useAppDispatch();
    const { isAdmin, DEBUG, isMobile } = useAppUI();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openplansPopUp, setOpenplansPopUp] = useState(false);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = async () => {
        dispatch(logoutUser());
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <FlexBetween height={"100%"} alignItems={"center"}>
            <Button onClick={handleClick} sx={{ p: 1 }}>
                <FlexBetween color={"whitesmoke"} alignItems={"center"}>
                    <Typography fontWeight={"bolder"} sx={{ textWrap: "nowrap" }}>
                        {isMobile ? "" : "WELCOME"} {user.userName}
                    </Typography>
                    <ArrowDropDown />
                </FlexBetween>
            </Button>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose}>
                {isAdmin && (
                    <MenuItem
                        onClick={() => {
                            dispatch(openDialog("profileDialog"));
                            handleClose();
                        }}
                    >
                        Profile
                    </MenuItem>
                )}
                <MenuItem
                    onClick={() => {
                        dispatch(openDialog("changePassDialog"));
                        handleClose();
                    }}
                >
                    Change Password
                </MenuItem>
                {isAdmin && (
                    <>
                        <MenuItem
                            onClick={() => {
                                dispatch(openDialog("subscriptionDialog"));
                                handleClose();
                            }}
                        >
                            Subscription
                        </MenuItem>
                        <MenuItem onClick={() => setOpenplansPopUp(!openplansPopUp)}>
                            Plans
                        </MenuItem>
                        {DEBUG && (
                            <MenuItem
                                onClick={() => {
                                    dispatch(openDialog("settingsDialog"));
                                    handleClose();
                                }}
                            >
                                Settings
                            </MenuItem>
                        )}
                    </>
                )}
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
            {openplansPopUp && (
                <SubscriptionPopup
                    popupOn={openplansPopUp}
                    setPopup={() => setOpenplansPopUp(!openplansPopUp)}
                />
            )}
        </FlexBetween>
    );
};

export default UserProfileDropdown;
