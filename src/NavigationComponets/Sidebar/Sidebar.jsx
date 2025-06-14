import { Box, List, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { EventNote } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import { Contacts } from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PropTypes from "prop-types";
import SidebarItem from "./SidebarItem";
import { Assessment } from "@mui/icons-material";
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { useSelector } from "react-redux";
// import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

const Sidebar = ({ isNonMobileScreens, sidebarOn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const settings = useSelector((state) => state.auth.settings);
  const user = useSelector((state) => state.auth.user)

  const routes = [
    {
      path: "/dashboard",
      label: "Dashboard",
      show: true,
      icon: (
        <DashboardIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    }, {
      path: "/management/branch",
      label: "Branches",
      show: settings.find((setting) => setting.navBarName === "BRANCH")?.enabled && user?.role === "ADMIN",
      icon: (
        <DeviceHubIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/clients",
      label: "Clients",
      show: settings.find((setting) => setting.navBarName === "CLIENT")?.enabled,
      icon: (
        <Contacts
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/bookings",
      label: "Bookings",
      show: settings.find((setting) => setting.navBarName === "BOOKINGS")?.enabled,
      icon: (
        <EventNote
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/instructor",
      label: "Instructors",
      show: settings.find((setting) => setting.navBarName === "INSTRUCTOR")?.enabled,
      icon: (
        <SchoolIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/student",
      label: "Students",
      show: settings.find((setting) => setting.navBarName === "STUDENT")?.enabled,
      icon: (
        <GroupIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/activity",
      label: "Activities",
      show: settings.find((setting) => setting.navBarName === "ACTIVITY")?.enabled && user?.role === "ADMIN",
      icon: (
        <EventIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    }, {
      path: "/management/communication",
      label: "Communication",
      show: settings.find((setting) => setting.navBarName === "COMMUNICATION")?.enabled,
      icon: (
        <EmailIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/payments",
      label: "Payments",
      show: settings.find((setting) => setting.navBarName === "PAYMENTS")?.enabled,
      icon: (
        <PaymentIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/expenses",
      label: "Expense",
      show: settings.find((setting) => setting.navBarName === "EXPENSE")?.enabled,
      icon: (
        <CurrencyRupeeIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/analysis",
      label: "Analysis",
      show: settings.find((setting) => setting.navBarName === "ANALYSIS")?.enabled && user?.role === "ADMIN",
      icon: (
        <BarChartIcon
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
    {
      path: "/management/reports",
      label: "Reports",
      show: settings.find((setting) => setting.navBarName === "REPORTS")?.enabled && user?.role === "ADMIN",
      icon: (
        <Assessment
          sx={{
            color: "whitesmoke",
          }}
        />
      ),
    },
  ];

  return (
    <Box
      width={isNonMobileScreens ? "15rem" : "4rem"}
      display={sidebarOn ? "flex" : "none"}
      flexDirection="column"
      boxShadow={`4px 0px 4px -4px ${theme.palette.neutral.dark}`}
      bgcolor={"#3f4859"}
      overflow="auto"
      color={"whitesmoke"}
      sx={{ padding: "1rem 0" }}
    >
      <List>
        {routes.map((route) => (
          route.show === true &&
          <SidebarItem
            isNonMobileScreens={isNonMobileScreens}
            key={route.path}
            route={route}
            isSelected={location.pathname === route.path}
            onClick={() => navigate(route.path)}
          />
        ))}
      </List>
    </Box>
  );
};

Sidebar.propTypes = {
  isNonMobileScreens: PropTypes.bool.isRequired,
  sidebarOn: PropTypes.bool.isRequired,
};
export default Sidebar;
