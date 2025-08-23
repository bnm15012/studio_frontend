import { Box, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { EventNote, QuestionAnswer, TypeSpecimen } from "@mui/icons-material";
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
import { useUI } from "../../context/UIContext";
import { BookTemplate, Upload } from "lucide-react";

const Sidebar = ({ sidebarOn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isMobile, isMembershipTableEnabled, settings, isAdmin } = useUI();

  const routes = [
    {
      path: "/dashboard",
      label: "Dashboard",
      show: true,
      icon: (
        <DashboardIcon />
      ),
    },
    {
      path: "/management/bulk_upload",
      label: "Upload Data",
      show: settings.find((setting) => setting.navBarName === "BULK_UPLOAD")?.enabled && isAdmin,
      icon: (
        <Upload />
      ),
    },
    {
      path: "/management/branch",
      label: "Branches",
      show: settings.find((setting) => setting.navBarName === "BRANCH")?.enabled && isAdmin,
      icon: (
        <DeviceHubIcon />
      ),
    },
    {
      path: "/management/enquiry",
      label: "Enquiries",
      show: settings.find((setting) => setting.navBarName === "ENQUIRY")?.enabled,
      icon: (
        <QuestionAnswer />
      ),
    },
    {
      path: "/management/clients",
      label: "Clients",
      show: settings.find((setting) => setting.navBarName === "CLIENT")?.enabled,
      icon: (
        <Contacts />
      ),
    },
    {
      path: "/management/bookings",
      label: "Bookings",
      show: settings.find((setting) => setting.navBarName === "BOOKINGS")?.enabled,
      icon: (
        <EventNote />
      ),
    },
    {
      path: "/management/instructor",
      label: "Instructors",
      show: settings.find((setting) => setting.navBarName === "INSTRUCTOR")?.enabled,
      icon: (
        <SchoolIcon />
      ),
    },
    {
      path: "/management/student",
      label: "Students",
      show: settings.find((setting) => setting.navBarName === "STUDENT")?.enabled,
      icon: (
        <GroupIcon />
      ),
    },
    {
      path: "/management/activity",
      label: "Activities",
      show: settings.find((setting) => setting.navBarName === "ACTIVITY")?.enabled && isAdmin,
      icon: (
        <EventIcon />
      ),
    },
    {
      path: "/management/type",
      label: "MembershipType",
      show: isMembershipTableEnabled && isAdmin,
      icon: (
        <TypeSpecimen />
      ),
    },
    {
      path: "/management/communication",
      label: "Communication",
      show: settings.find((setting) => setting.navBarName === "COMMUNICATION")?.enabled,
      icon: (
        <EmailIcon />
      ),
    },
    {
      path: "/management/payments",
      label: "Payments",
      show: settings.find((setting) => setting.navBarName === "PAYMENTS")?.enabled,
      icon: (
        <PaymentIcon />
      ),
    },
    {
      path: "/management/expenses",
      label: "Expense",
      show: settings.find((setting) => setting.navBarName === "EXPENSE")?.enabled,
      icon: (
        <CurrencyRupeeIcon />
      ),
    },
    {
      path: "/analysis",
      label: "Analysis",
      show: settings.find((setting) => setting.navBarName === "ANALYSIS")?.enabled && isAdmin,
      icon: (
        <BarChartIcon />
      ),
    },
    {
      path: "/management/reports",
      label: "Reports",
      show: settings.find((setting) => setting.navBarName === "REPORTS")?.enabled && isAdmin,
      icon: (
        <Assessment />
      ),
    },
    {
      path: "/management/template",
      label: "Templates",
      show: settings.find((setting) => setting.navBarName === "TEMPLATES")?.enabled && isAdmin,
      icon: (
        <BookTemplate />
      ),
    },
  ];

  return (
    <>
      <Box
        width={"14rem"}
        display={sidebarOn ? isMobile ? "flex" : "" : "none"}
        height={"100%"}
        flexDirection={"column"}
        bgcolor={"#283650ff"}
        boxShadow={theme.shadows[10]}
        sx={{
          zIndex: 999,
          overflowY: "auto",
          padding: !isMobile ? "1rem 0.5rem" : "0.5rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {routes.filter(r => r.show).map((route) => (
          <SidebarItem
            key={route.path}
            route={route}
            isSelected={location.pathname === route.path}
            onClick={() => navigate(route.path)}
            isNonMobileScreens={!isMobile}
          />
        ))}
      </Box>
    </>
  );
};

Sidebar.propTypes = {
  sidebarOn: PropTypes.bool.isRequired,
};
export default Sidebar;
