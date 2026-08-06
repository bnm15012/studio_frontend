import { useAppDispatch, useAppSelector } from "@/state";
import React, { useEffect, useState } from "react";

import UserWidgets from "@/Pages/ProfilePage/Widgets/UserWidgets";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import ChangePassword from "@/Pages/ProfilePage/ChangePassword";
import SubscriptionTab from "@/Pages/ProfilePage/SubscriptionTab";
import SettingsTab from "@/Pages/ProfilePage/SettingsTab";
import CommunicationConfigs from "@/Pages/ProfilePage/CommunicationConfigs";
import { clearAllDialogs, dialogOnTop } from "@/state/dialogSlice";
import { useAppUI } from "@/context/UIContext";
import StyledDialog from "@/core/components/dialogs/StyledDialog";

const dialogNames = [
    "profileDialog",
    "changePassDialog",
    "subscriptionDialog",
    "settingsDialog",
    "configurationDialog",
];

const ProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { DEBUG, isMobile, studio, user: admin } = useAppUI();
    const [tabValue, setTabValue] = useState(0);
    const dialog = useAppSelector(dialogOnTop());

    const handleClose = () => {
        dispatch(clearAllDialogs());
    };

    useEffect(() => {
        if (admin.role === "ADMIN") {
            if ("profileDialog" === dialog) setTabValue(0);
            else if ("subscriptionDialog" === dialog) setTabValue(2);
            else if ("settingsDialog" === dialog && DEBUG) setTabValue(3);
            else if ("configurationDialog" === dialog) setTabValue(4);
            else setTabValue(1);
        } else {
            if ("configurationDialog" === dialog) setTabValue(4);
            else setTabValue(1);
        }
    }, [admin, dialog, DEBUG]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <StyledDialog
            closeIcon={true}
            title={
                tabValue === 0
                    ? "Profile Details"
                    : tabValue === 1
                      ? "Change Password"
                      : tabValue === 2
                        ? "Subscription Details"
                        : tabValue === 3 && DEBUG
                          ? "Settings"
                          : "Configuration"
            }
            open={dialogNames.includes(dialog!)}
            onClose={handleClose}
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: tabValue === 1 ? "500px" : "90vh",
                    minHeight: tabValue === 1 ? "400px" : "auto",
                },
            }}
        >
            <Box sx={{ px: 2.5, py: 1.5 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                    sx={{
                        width: "100%",
                        "& .MuiTab-root": { minHeight: 48, fontSize: "0.95rem" },
                        "& .Mui-selected": { color: theme.palette.primary.main },
                        "& .MuiTabs-indicator": { height: 3 },
                    }}
                >
                    <Tab label="Profile" disabled={admin.role !== "ADMIN"} />
                    <Tab label="Security" />
                    <Tab label="Subscription" disabled={admin.role !== "ADMIN"} />
                    <Tab
                        label="Settings"
                        disabled={admin.role !== "ADMIN"}
                        sx={{ display: DEBUG ? "unset" : "none" }}
                    />
                    <Tab label="Configurations" />
                </Tabs>
            </Box>

            <Box
                sx={{
                    p: 2.5,
                    height: "100%",
                    overflowY: "auto",
                }}
            >
                {tabValue === 0 && admin && studio ? (
                    <Box>
                        <UserWidgets admin={admin} studio={studio} />
                    </Box>
                ) : tabValue === 1 && admin ? (
                    <ChangePassword user={admin} />
                ) : tabValue === 2 ? (
                    <SubscriptionTab />
                ) : tabValue === 3 ? (
                    <SettingsTab />
                ) : tabValue === 4 ? (
                    <CommunicationConfigs studio={studio} />
                ) : null}
            </Box>
        </StyledDialog>
    );
};

export default ProfilePage;
