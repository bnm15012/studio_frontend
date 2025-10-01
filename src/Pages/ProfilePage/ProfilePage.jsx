import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../Components/Loading/Loading";
import UserWidgets from "./Widgets/UserWidgets";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import ChangePassword from "./ChangePassword";
import SubscriptionTab from "./SubscriptionTab";
import SettingsTab from "./SettingsTab";
import CommunicationConfigs from "./CommunicationConfigs";
import { clearAllDialogs, dialogOnTop } from "../../state/dialogSlice";
import { useUI } from "../../context/UIContext";
import StyledDialog from "../../Components/New/StyledDialog";

const dialogNames = [
  "profileDialog",
  "changePassDialog",
  "subscriptionDialog",
  "settingsDialog",
  "configurationDialog",
];
const ProfilePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const admin = useSelector((state) => state.auth.user);
  const studio = useSelector((state) => state.auth.studio);
  const [tabValue, setTabValue] = useState(0);
  const dialog = useSelector(dialogOnTop());
  const { DEBUG, isMobile } = useUI();

  const handleClose = () => {
    dispatch(clearAllDialogs());
  };

  useEffect(() => {
    if (admin?.role === "ADMIN") {
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <StyledDialog
      closeIcon={true}
      title={tabValue === 0 ? "Profile Details" :
        tabValue === 1 ? "Change Password" :
          tabValue === 2 ? "Subscription Details" :
            tabValue === 3 && DEBUG ? "Settings" : "Communication Configuration"}
      open={dialogNames.includes(dialog)}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: tabValue === 1 ? '500px' : '90vh',
          minHeight: tabValue === 1 ? '400px' : 'auto',
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
            width: '100%',
            '& .MuiTab-root': { minHeight: 48, fontSize: '0.95rem' },
            '& .Mui-selected': { color: theme.palette.primary.main },
            '& .MuiTabs-indicator': { height: 3 },
          }}
        >

          <Tab label="Profile" disabled={admin?.role !== "ADMIN"} />
          <Tab label="Security" />
          <Tab label="Subscription" disabled={admin?.role !== "ADMIN"} />
          <Tab label="Settings" disabled={admin?.role !== "ADMIN"} sx={{ display: DEBUG ? "unset" : "none" }} />
          <Tab label="Configurations" />
        </Tabs>
      </Box>

      <Box
        sx={{
          p: 2.5,
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {tabValue === 0 && admin ? (
          <Box>
            <UserWidgets admin={admin} studio={studio} />
          </Box>
        ) : tabValue === 1 && admin ? (
          <ChangePassword user={admin} />
        ) : tabValue === 2 ? (
          <SubscriptionTab user={admin} />
        ) : tabValue === 3 ? (
          <SettingsTab studio={studio} user={admin} />
        ) : tabValue === 4 ? (
          <CommunicationConfigs studio={studio} user={admin} />
        ) : (
          <Loading />
        )}
      </Box>
    </StyledDialog >
  );
};

export default ProfilePage;
