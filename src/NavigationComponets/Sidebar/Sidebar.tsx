import React, { useState } from "react";
import { Box, Fab, IconButton, Tooltip, useTheme } from "@mui/material";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SidebarItem, { SidebarRoute } from "./SidebarItem";
import { useAppUI } from "@/context/UIContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Close, GridView } from "@mui/icons-material";
import { usePref, KEYS } from "@/core/utils/localStorageHelper";

const SIDEBAR_FULL = "12rem";
const SIDEBAR_ICON = "4rem";

interface SidebarProps {
    sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { isMobile, permissions, isAdmin } = useAppUI();
    const isDark = theme.palette.mode === "dark";

    const [open, setOpen] = useState<boolean>(sidebarOpen && !isMobile);
    const [iconOnly, setIconOnly] = usePref(KEYS.SIDEBAR_COLLAPSED, false);

    const routes: SidebarRoute[] = [
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
            show: permissions.BULK_UPLOAD && isAdmin,
            showOnBottomBar: permissions.BULK_UPLOAD && isAdmin && false,
            icon: <CloudUploadIcon />,
        },
        {
            path: "/management/branch",
            label: "Branches",
            show: permissions.BRANCH && isAdmin,
            showOnBottomBar: permissions.BRANCH && isAdmin && false,
            icon: <StorefrontIcon />,
        },
        {
            path: "/management/enquiry",
            label: "Enquiries",
            show: permissions.ENQUIRY,
            showOnBottomBar: permissions.ENQUIRY,
            icon: <HelpIcon />,
        },
        {
            path: "/management/clients",
            label: "Clients",
            show: permissions.CLIENT,
            showOnBottomBar: permissions.CLIENT,
            icon: <BusinessCenterIcon />,
        },
        {
            path: "/management/booking",
            label: "Bookings",
            show: permissions.BOOKINGS,
            showOnBottomBar: permissions.BOOKINGS,
            icon: <CalendarMonthIcon />,
        },
        {
            path: "/management/instructors",
            label: "Instructors",
            show: permissions.INSTRUCTOR,
            showOnBottomBar: permissions.INSTRUCTOR,
            icon: <BadgeIcon />,
        },
        {
            path: "/management/attendance",
            label: "Attendance",
            show: permissions.ATTENDANCE,
            showOnBottomBar: permissions.ATTENDANCE && false,
            icon: <HowToRegIcon />,
        },
        {
            path: "/management/students",
            label: "Students",
            show: permissions.STUDENT,
            showOnBottomBar: permissions.STUDENT,
            icon: <SchoolIcon />,
        },
        {
            path: "/management/activity",
            label: "Activities",
            show: permissions.ACTIVITY,
            showOnBottomBar: permissions.ACTIVITY,
            icon: <FitnessCenterIcon />,
        },
        {
            path: "/management/type",
            label: "Packages",
            show: permissions.PACKAGE,
            showOnBottomBar: permissions.PACKAGE && false,
            icon: <CardGiftcardIcon />,
        },
        {
            path: "/management/communication",
            label: "Communication",
            show: permissions.COMMUNICATION,
            showOnBottomBar: permissions.COMMUNICATION,
            icon: <ForumIcon />,
        },
        {
            path: "/management/payments",
            label: "Payments",
            show: permissions.PAYMENTS,
            showOnBottomBar: permissions.PAYMENTS,
            icon: <CreditCardIcon />,
        },
        {
            path: "/management/expenses",
            label: "Expense",
            show: permissions.EXPENSE,
            showOnBottomBar: permissions.EXPENSE,
            icon: <AccountBalanceWalletIcon />,
        },
        {
            path: "/analysis",
            label: "Analysis",
            show: permissions.ANALYSIS,
            showOnBottomBar: permissions.ANALYSIS,
            icon: <BarChartIcon />,
        },
        {
            path: "/management/reports",
            label: "Reports",
            show: permissions.REPORTS,
            showOnBottomBar: permissions.REPORTS,
            icon: <AnalyticsIcon />,
        },
        {
            path: "/management/template",
            label: "Templates",
            show: permissions.TEMPLATES,
            showOnBottomBar: permissions.TEMPLATES,
            icon: <DescriptionIcon />,
        },
    ];

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40, scale: 0 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.001, type: "spring", stiffness: 300 },
        }),
        exit: { opacity: 0, y: 40, scale: 0, transition: { duration: 0.3 } },
    };

    const visibleRoutes = routes.filter((r) => r.show);

    if (isMobile) {
        return (
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
                            bgcolor={isDark ? theme.palette.background.paper : "#312850f7"}
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
                            {visibleRoutes.map((route, i) => (
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
                        "&:hover": { transform: "scale(1.1)" },
                    }}
                >
                    {open ? <Close /> : <GridView />}
                </Fab>
            </>
        );
    }

    // ── Desktop ────────────────────────────────────────────────────────────────
    if (!sidebarOpen) return null;

    const sidebarWidth = iconOnly ? SIDEBAR_ICON : SIDEBAR_FULL;

    return (
        <Box
            component={motion.div}
            animate={{ width: sidebarWidth }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            sx={{
                flexShrink: 0,
                height: "100%",
                boxSizing: "border-box",
                bgcolor: isDark ? theme.palette.background.paper : "#283650ff",
                boxShadow: theme.shadows[10],
                zIndex: 99,
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                pt: "0.5rem",
                pb: "0.25rem",
            }}
        >
            {/* ── Nav items (scrollable region) ── */}
            <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", px: "0.2rem" }}>
                {visibleRoutes.map((route) => (
                    <SidebarItem
                        key={route.path}
                        route={route}
                        isSelected={location.pathname.includes(route.path)}
                        onClick={() => navigate(route.path)}
                        isNonMobileScreens={true}
                        iconOnly={iconOnly}
                    />
                ))}
            </Box>

            {/* ── Collapse toggle pinned at bottom ── */}
            <Box
                sx={{
                    flexShrink: 0,
                    borderTop: `1px solid ${isDark ? theme.palette.divider : "rgba(255,255,255,0.08)"}`,
                    mt: 0.5,
                    pt: 0.5,
                    px: "0.2rem",
                    display: "flex",
                    justifyContent: iconOnly ? "center" : "flex-end",
                }}
            >
                <Tooltip
                    title={iconOnly ? "Expand sidebar" : "Collapse sidebar"}
                    placement="right"
                    arrow
                >
                    <IconButton
                        onClick={() => setIconOnly((v) => !v)}
                        size="small"
                        sx={{
                            color: isDark ? theme.palette.text.secondary : "rgba(255,255,255,0.6)",
                            borderRadius: "0.75rem",
                            width: "2.2rem",
                            height: "2.2rem",
                            transition: "color 0.2s",
                            "&:hover": {
                                color: isDark ? theme.palette.text.primary : "white",
                                bgcolor: isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "rgba(255,255,255,0.08)",
                            },
                        }}
                    >
                        {iconOnly ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default Sidebar;
