import { Box, Fab, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNote from "@mui/icons-material/EventNote";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import TypeSpecimen from "@mui/icons-material/TypeSpecimen";
import EmailIcon from "@mui/icons-material/Email";
import Contacts from "@mui/icons-material/Contacts";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PropTypes from "prop-types";
import SidebarItem from "./SidebarItem";
import Assessment from "@mui/icons-material/Assessment";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { useUI } from "../../context/UIContext";
import { BookTemplate, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Close, GridView } from "@mui/icons-material";

const Sidebar = ({ sidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { isMobile, isEnabled, FEATURE_KEYS, isAdmin } = useUI();
    const [open, setOpen] = useState(sidebarOpen && !isMobile);

    const routes = [
        {
            path: "/dashboard",
            label: "Dashboard",
            show: true,
            showOnBottomBar: true,
            icon: <DashboardIcon />,
        },
        {
            path: "/management/bulk_upload",
            label: "Upload Data",
            show: isEnabled(FEATURE_KEYS.BULK_UPLOAD) && isAdmin,
            showOnBottomBar: isEnabled(FEATURE_KEYS.BULK_UPLOAD) && isAdmin && false,
            icon: <Upload />,
        },
        {
            path: "/management/branch",
            label: "Branches",
            show: isEnabled(FEATURE_KEYS.BRANCH) && isAdmin,
            showOnBottomBar: isEnabled(FEATURE_KEYS.BRANCH) && isAdmin && false,
            icon: <DeviceHubIcon />,
        },
        {
            path: "/management/enquiry",
            label: "Enquiries",
            show: isEnabled(FEATURE_KEYS.ENQUIRY),
            showOnBottomBar: isEnabled(FEATURE_KEYS.ENQUIRY),
            icon: <QuestionAnswer />,
        },
        {
            path: "/management/clients",
            label: "Clients",
            show: isEnabled(FEATURE_KEYS.CLIENT),
            showOnBottomBar: isEnabled(FEATURE_KEYS.CLIENT),
            icon: <Contacts />,
        },
        {
            path: "/management/booking",
            label: "Bookings",
            show: isEnabled(FEATURE_KEYS.BOOKINGS),
            showOnBottomBar: isEnabled(FEATURE_KEYS.BOOKINGS),
            icon: <EventNote />,
        },
        {
            path: "/management/instructors",
            label: "Instructors",
            show: isEnabled(FEATURE_KEYS.INSTRUCTOR),
            showOnBottomBar: isEnabled(FEATURE_KEYS.INSTRUCTOR),
            icon: <SchoolIcon />,
        },
        {
            path: "/management/students",
            label: "Students",
            show: isEnabled(FEATURE_KEYS.STUDENT),
            showOnBottomBar: isEnabled(FEATURE_KEYS.STUDENT),
            icon: <GroupIcon />,
        },
        {
            path: "/management/activity",
            label: "Activities",
            show: isEnabled(FEATURE_KEYS.ACTIVITY),
            showOnBottomBar: isEnabled(FEATURE_KEYS.ACTIVITY),
            icon: <EventIcon />,
        },
        {
            path: "/management/type",
            label: "Packages",
            show: isEnabled(FEATURE_KEYS.MEMBERSHIP_PLAN_TABLE),
            showOnBottomBar: isEnabled(FEATURE_KEYS.MEMBERSHIP_PLAN_TABLE) && false,
            icon: <TypeSpecimen />,
        },
        {
            path: "/management/communication",
            label: "Communication",
            show: isEnabled(FEATURE_KEYS.COMMUNICATION),
            showOnBottomBar: isEnabled(FEATURE_KEYS.COMMUNICATION),
            icon: <EmailIcon />,
        },
        {
            path: "/management/payments",
            label: "Payments",
            show: isEnabled(FEATURE_KEYS.PAYMENTS),
            showOnBottomBar: isEnabled(FEATURE_KEYS.PAYMENTS),
            icon: <PaymentIcon />,
        },
        {
            path: "/management/expenses",
            label: "Expense",
            show: isEnabled(FEATURE_KEYS.EXPENSE),
            showOnBottomBar: isEnabled(FEATURE_KEYS.EXPENSE),
            icon: <CurrencyRupeeIcon />,
        },
        {
            path: "/analysis",
            label: "Analysis",
            show: isEnabled(FEATURE_KEYS.ANALYSIS),
            showOnBottomBar: isEnabled(FEATURE_KEYS.ANALYSIS),
            icon: <BarChartIcon />,
        },
        {
            path: "/management/reports",
            label: "Reports",
            show: isEnabled(FEATURE_KEYS.REPORTS),
            showOnBottomBar: isEnabled(FEATURE_KEYS.REPORTS),
            icon: <Assessment />,
        },
        {
            path: "/management/template",
            label: "Templates",
            show: isEnabled(FEATURE_KEYS.TEMPLATES),
            showOnBottomBar: isEnabled(FEATURE_KEYS.TEMPLATES),
            icon: <BookTemplate />,
        },
    ];

    const itemVariants = {
        hidden: { opacity: 0, y: 40, scale: 0 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.001, type: "spring", stiffness: 300 },
        }),
        exit: { opacity: 0, y: 40, scale: 0, transition: { duration: 0.3 } },
    };

    return (
        <>
            {isMobile ? (
                <>
                    <AnimatePresence>
                        {open && (
                            <Box
                                component={motion.div}
                                position="fixed"
                                width="100vw"
                                height="calc(100vh - 3.2rem)"
                                boxSizing="border-box"
                                zIndex={1000}
                                bgcolor="#312850f7"
                                sx={{
                                    overflowY: "auto",
                                    padding: "3rem 2rem",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
                                    gap: "1rem",
                                    justifyContent: "center",
                                    alignContent: "flex-start",
                                    backdropFilter: "blur(4px)",
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                {routes
                                    .filter((r) => r.show)
                                    .map((route, i) => (
                                        <motion.div
                                            key={route.path}
                                            custom={i}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <SidebarItem
                                                route={route}
                                                isSelected={location.pathname === route.path}
                                                onClick={() => {
                                                    setOpen(false);
                                                    navigate(route.path);
                                                }}
                                                isNonMobileScreens={false}
                                            />
                                        </motion.div>
                                    ))}
                            </Box>
                        )}
                    </AnimatePresence>
                    <Fab
                        color="primary"
                        onClick={() => setOpen(!open)}
                        sx={{
                            position: "fixed",
                            bottom: 24,
                            right: 24,
                            zIndex: 1200,
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                            },
                        }}
                    >
                        {open ? <Close /> : <GridView />}
                    </Fab>
                </>
            ) : (
                <Box
                    width={"15rem"}
                    display={sidebarOpen ? "" : "none"}
                    height={"100%"}
                    boxSizing={"border-box"}
                    bgcolor={"#283650ff"}
                    boxShadow={theme.shadows[10]}
                    sx={{
                        zIndex: 99,
                        overflowY: "auto",
                        padding: "1rem 0.2rem",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    {routes
                        .filter((r) => r.show)
                        .map((route) => (
                            <SidebarItem
                                key={route.path}
                                route={route}
                                isSelected={location.pathname === route.path}
                                onClick={() => navigate(route.path)}
                                isNonMobileScreens={true}
                            />
                        ))}
                </Box>
            )}
        </>
    );
};

Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
};
export default Sidebar;
