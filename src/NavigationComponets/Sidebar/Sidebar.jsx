import { Box, Fab, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HelpIcon from "@mui/icons-material/Help";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ForumIcon from "@mui/icons-material/Forum";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DescriptionIcon from "@mui/icons-material/Description";
import PropTypes from "prop-types";
import SidebarItem from "./SidebarItem";
import { useUI } from "../../context/UIContext";
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
            icon: <CloudUploadIcon />,
        },
        {
            path: "/management/branch",
            label: "Branches",
            show: isEnabled(FEATURE_KEYS.BRANCH) && isAdmin,
            showOnBottomBar: isEnabled(FEATURE_KEYS.BRANCH) && isAdmin && false,
            icon: <StorefrontIcon />,
        },
        {
            path: "/management/enquiry",
            label: "Enquiries",
            show: isEnabled(FEATURE_KEYS.ENQUIRY),
            showOnBottomBar: isEnabled(FEATURE_KEYS.ENQUIRY),
            icon: <HelpIcon />,
        },
        {
            path: "/management/clients",
            label: "Clients",
            show: isEnabled(FEATURE_KEYS.CLIENT),
            showOnBottomBar: isEnabled(FEATURE_KEYS.CLIENT),
            icon: <BusinessCenterIcon />,
        },
        {
            path: "/management/booking",
            label: "Bookings",
            show: isEnabled(FEATURE_KEYS.BOOKINGS),
            showOnBottomBar: isEnabled(FEATURE_KEYS.BOOKINGS),
            icon: <CalendarMonthIcon />,
        },
        {
            path: "/management/instructors",
            label: "Instructors",
            show: isEnabled(FEATURE_KEYS.INSTRUCTOR),
            showOnBottomBar: isEnabled(FEATURE_KEYS.INSTRUCTOR),
            icon: <BadgeIcon />,
        },
        {
            path: "/management/attendance",
            label: "Attendance",
            show: isEnabled(FEATURE_KEYS.ATTENDANCE),
            showOnBottomBar: isEnabled(FEATURE_KEYS.ATTENDANCE) && false,
            icon: <HowToRegIcon />,
        },
        {
            path: "/management/students",
            label: "Students",
            show: isEnabled(FEATURE_KEYS.STUDENT),
            showOnBottomBar: isEnabled(FEATURE_KEYS.STUDENT),
            icon: <SchoolIcon />,
        },
        {
            path: "/management/activity",
            label: "Activities",
            show: isEnabled(FEATURE_KEYS.ACTIVITY),
            showOnBottomBar: isEnabled(FEATURE_KEYS.ACTIVITY),
            icon: <FitnessCenterIcon />,
        },
        {
            path: "/management/type",
            label: "Packages",
            show: isEnabled(FEATURE_KEYS.PACKAGE),
            showOnBottomBar: isEnabled(FEATURE_KEYS.PACKAGE) && false,
            icon: <CardGiftcardIcon />,
        },
        {
            path: "/management/communication",
            label: "Communication",
            show: isEnabled(FEATURE_KEYS.COMMUNICATION),
            showOnBottomBar: isEnabled(FEATURE_KEYS.COMMUNICATION),
            icon: <ForumIcon />,
        },
        {
            path: "/management/payments",
            label: "Payments",
            show: isEnabled(FEATURE_KEYS.PAYMENTS),
            showOnBottomBar: isEnabled(FEATURE_KEYS.PAYMENTS),
            icon: <CreditCardIcon />,
        },
        {
            path: "/management/expenses",
            label: "Expense",
            show: isEnabled(FEATURE_KEYS.EXPENSE),
            showOnBottomBar: isEnabled(FEATURE_KEYS.EXPENSE),
            icon: <AccountBalanceWalletIcon />,
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
            icon: <AnalyticsIcon />,
        },
        {
            path: "/management/template",
            label: "Templates",
            show: isEnabled(FEATURE_KEYS.TEMPLATES),
            showOnBottomBar: isEnabled(FEATURE_KEYS.TEMPLATES),
            icon: <DescriptionIcon />,
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
                                top={"3.2rem"}
                                width="100vw"
                                height="calc(100dvh - 3.2rem)"
                                boxSizing="border-box"
                                zIndex={1000}
                                bgcolor="#312850f7"
                                sx={{
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    padding: { xs: "1.5rem 1rem", sm: "2rem 1.5rem" },
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "repeat(auto-fill, minmax(110px, 1fr))",
                                        sm: "repeat(auto-fill, minmax(135px, 1fr))",
                                    },
                                    gap: { xs: "0.75rem", sm: "1rem" },
                                    justifyContent: "center",
                                    alignContent: "flex-start",
                                    backdropFilter: "blur(4px)",
                                    WebkitOverflowScrolling: "touch",
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
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
                            bottom: "max(24px, env(safe-area-inset-bottom, 24px))",
                            right: 24,
                            zIndex: 1200,
                            width: 52,
                            height: 52,
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
                    flexShrink={0}
                    display={sidebarOpen ? "" : "none"}
                    height={"100%"}
                    boxSizing={"border-box"}
                    bgcolor={"#283650ff"}
                    boxShadow={theme.shadows[10]}
                    sx={{
                        zIndex: 99,
                        overflowY: "auto",
                        overflowX: "hidden",
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
                                isSelected={location.pathname.includes(route.path)}
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
