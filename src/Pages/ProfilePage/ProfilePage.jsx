import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../Components/Loading/Loading";
import UserWidgets from "./Widgets/UserWidgets";
import { Dialog, IconButton, Box, Tabs, Tab, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlexBetween from "../../Components/FlexBetween";
import ChangePassword from "./ChangePassword";
import SubscriptionTab from "./SubscriptionTab";
import SettingsTab from "./SettingsTab";
import CommunicationConfigs from "./CommunicationConfigs";
import { clearAllDialogs, dialogOnTop } from "../../state/dialogSlice";

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


  const handleClose = () => {
    dispatch(clearAllDialogs());
  };

  useEffect(() => {
    if (admin?.role === "ADMIN") {
      if ("profileDialog" === dialog) setTabValue(0);
      else if ("subscriptionDialog" === dialog) setTabValue(2);
      else if ("settingsDialog" === dialog) setTabValue(3);
      else if ("configurationDialog" === dialog) setTabValue(4);
      else setTabValue(1);
    } else {
      if ("configurationDialog" === dialog) setTabValue(4);
      else setTabValue(1);
    }
  }, [admin, dialog]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog
      open={dialogNames.includes(dialog)}
      maxWidth={"sm"}
      fullWidth
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: "50rem",
          maxHeight: tabValue === 1 ? '500px' : '90vh',
          minHeight: tabValue === 1 ? '400px' : 'auto',
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white'
        }}
      >
        <FlexBetween>
          <Typography variant="h5" fontWeight="500">
            {tabValue === 0 ? "Profile Details" :
              tabValue === 1 ? "Change Password" :
                tabValue === 2 ? "Subscription Details" :
                  tabValue === 3 ? "Settings" : "Communication Configuration"}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </FlexBetween>
      </Box>

      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: '48px',
              minWidth: '100px',
              fontSize: '0.95rem',
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
            },
            '& .MuiTabs-indicator': {
              height: 3,
            },
          }}
        >
          <Tab label="Profile" disabled={admin?.role !== "ADMIN"} />
          <Tab label="Security" />
          <Tab label="Subscription" disabled={admin?.role !== "ADMIN"} />
          <Tab label="Settings" disabled={admin?.role !== "ADMIN"} />
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
    </Dialog >
  );
};

export default ProfilePage;
