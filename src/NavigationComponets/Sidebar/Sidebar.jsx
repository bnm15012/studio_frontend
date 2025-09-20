import { Box, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNote from "@mui/icons-material/EventNote";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import TypeSpecimen from "@mui/icons-material/TypeSpecimen";
import EmailIcon from '@mui/icons-material/Email';
import Contacts from "@mui/icons-material/Contacts";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PropTypes from "prop-types";
import SidebarItem from "./SidebarItem";
import Assessment from "@mui/icons-material/Assessment";
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { useUI } from "../../context/UIContext";
import { BookTemplate, Upload } from "lucide-react";

const Sidebar = ({ sidebarOn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isMobile, isEnabled, FEATURE_KEYS, isAdmin } = useUI();

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
      show: isEnabled(FEATURE_KEYS.BULK_UPLOAD) && isAdmin,
      icon: (
        <Upload />
      ),
    },
    {
      path: "/management/branch",
      label: "Branches",
      show: isEnabled(FEATURE_KEYS.BRANCH) && isAdmin,
      icon: (
        <DeviceHubIcon />
      ),
    },
    {
      path: "/management/enquiry",
      label: "Enquiries",
      show: isEnabled(FEATURE_KEYS.ENQUIRY),
      icon: (
        <QuestionAnswer />
      ),
    },
    {
      path: "/management/clients",
      label: "Clients",
      show: isEnabled(FEATURE_KEYS.CLIENT),
      icon: (
        <Contacts />
      ),
    },
    {
      path: "/management/bookings",
      label: "Bookings",
      show: isEnabled(FEATURE_KEYS.BOOKINGS),
      icon: (
        <EventNote />
      ),
    },
    {
      path: "/management/instructor",
      label: "Instructors",
      show: isEnabled(FEATURE_KEYS.INSTRUCTOR),
      icon: (
        <SchoolIcon />
      ),
    },
    {
      path: "/management/student",
      label: "Students",
      show: isEnabled(FEATURE_KEYS.STUDENT),
      icon: (
        <GroupIcon />
      ),
    },
    {
      path: "/management/activity",
      label: "Activities",
      show: isEnabled(FEATURE_KEYS.ACTIVITY),
      icon: (
        <EventIcon />
      ),
    },
    {
      path: "/management/type",
      label: "Packages",
      show: isEnabled(FEATURE_KEYS.MEMBERSHIP_PLAN_TABLE),
      icon: (
        <TypeSpecimen />
      ),
    },
    {
      path: "/management/communication",
      label: "Communication",
      show: isEnabled(FEATURE_KEYS.COMMUNICATION),
      icon: (
        <EmailIcon />
      ),
    },
    {
      path: "/management/payments",
      label: "Payments",
      show: isEnabled(FEATURE_KEYS.PAYMENTS),
      icon: (
        <PaymentIcon />
      ),
    },
    {
      path: "/management/expenses",
      label: "Expense",
      show: isEnabled(FEATURE_KEYS.EXPENSE),
      icon: (
        <CurrencyRupeeIcon />
      ),
    },
    {
      path: "/analysis",
      label: "Analysis",
      show: isEnabled(FEATURE_KEYS.ANALYSIS),
      icon: (
        <BarChartIcon />
      ),
    },
    {
      path: "/management/reports",
      label: "Reports",
      show: isEnabled(FEATURE_KEYS.REPORTS),
      icon: (
        <Assessment />
      ),
    },
    {
      path: "/management/template",
      label: "Templates",
      show: isEnabled(FEATURE_KEYS.TEMPLATES),
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
          zIndex: 99,
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
