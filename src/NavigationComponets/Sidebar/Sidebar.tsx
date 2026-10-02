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
import SidebarItem, { SidebarRoute } from "@/NavigationComponets/Sidebar/SidebarItem";
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
    // const dispatch = useAppDispatch();
    const { isMobile, permissions, isAdmin, user } = useAppUI();
    const isSuperAdmin = user.role === "SUPER_ADMIN";
    // const isImpersonating = !!sessionStorage.getItem("superAdminAuth");
    const isDark = theme.palette.mode === "dark";

    const [open, setOpen] = useState<boolean>(sidebarOpen && !isMobile);
    const [iconOnly, setIconOnly] = usePref(KEYS.SIDEBAR_COLLAPSED, false);

    // const handleBackToSuperAdmin = useCallback(() => {
    //     const savedAuth = sessionStorage.getItem("superAdminAuth");
    //     const savedBranch = sessionStorage.getItem("superAdminBranch");
    //     if (!savedAuth) return;

    //     dispatch(setAuthLoading({ loading: true }));
    //     const authState = JSON.parse(savedAuth);
    //     const branchState = savedBranch ? JSON.parse(savedBranch) : null;

    //     dispatch(
    //         setLogin({
    //             user: authState.user,
    //             token: authState.token?.replace("Bearer ", "") || null,
    //             studio: authState.studio,
    //             settings: authState.settings,
    //         }),
    //     );
    //     dispatch(setSubscriptionPlan({ subscriptionPlan: authState.subscriptionPlan }));

    //     if (branchState) {
    //         dispatch(
    //             branchCruds.actions.setItems({
    //                 data: branchState.items || [],
    //                 rootId: branchState.rootId,
    //             }),
    //         );
    //         if (branchState.currentBranch) {
    //             dispatch(branchCruds.actions.setCurrentBranch(branchState.currentBranch));
    //         }
    //     }

    //     sessionStorage.removeItem("superAdminAuth");
    //     sessionStorage.removeItem("superAdminBranch");
    //     setTimeout(() => {
    //         dispatch(setAuthLoading({ loading: false }));
    //         navigate("/super-admin/studios");
    //     }, 300);
    // }, [dispatch, navigate]);

    const studioRoutes: SidebarRoute[] = [
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
            show: Boolean(permissions.BULK_UPLOAD && isAdmin),
            showOnBottomBar: false,
            icon: <CloudUploadIcon />,
        },
        {
            path: "/management/branch",
            label: "Branches",
            show: Boolean(permissions.BRANCH && isAdmin),
            showOnBottomBar: false,
            icon: <StorefrontIcon />,
        },
        {
            path: "/management/enquiry",
            label: "Enquiries",
            show: Boolean(permissions.ENQUIRY),
            showOnBottomBar: Boolean(permissions.ENQUIRY),
            icon: <HelpIcon />,
        },
        {
            path: "/management/clients",
            label: "Clients",
            show: Boolean(permissions.CLIENT),
            showOnBottomBar: Boolean(permissions.CLIENT),
            icon: <BusinessCenterIcon />,
        },
        {
            path: "/management/booking",
            label: "Bookings",
            show: Boolean(permissions.BOOKINGS),
            showOnBottomBar: Boolean(permissions.BOOKINGS),
            icon: <CalendarMonthIcon />,
        },
        {
            path: "/management/instructors",
            label: "Instructors",
            show: Boolean(permissions.INSTRUCTOR),
            showOnBottomBar: Boolean(permissions.INSTRUCTOR),
            icon: <BadgeIcon />,
        },
        {
            path: "/management/attendance",
            label: "Attendance",
            show: Boolean(permissions.ATTENDANCE),
            showOnBottomBar: false,
            icon: <HowToRegIcon />,
        },
        {
            path: "/management/students",
            label: "Students",
            show: Boolean(permissions.STUDENT),
            showOnBottomBar: Boolean(permissions.STUDENT),
            icon: <SchoolIcon />,
        },
        {
            path: "/management/activity",
            label: "Activities",
            show: Boolean(permissions.ACTIVITY),
            showOnBottomBar: Boolean(permissions.ACTIVITY),
            icon: <FitnessCenterIcon />,
        },
        {
            path: "/management/type",
            label: "Packages",
            show: Boolean(permissions.PACKAGE),
            showOnBottomBar: false,
            icon: <CardGiftcardIcon />,
        },
        {
            path: "/management/communication",
            label: "Communication",
            show: Boolean(permissions.COMMUNICATION),
            showOnBottomBar: Boolean(permissions.COMMUNICATION),
            icon: <ForumIcon />,
        },
        {
            path: "/management/payments",
            label: "Payments",
            show: Boolean(permissions.PAYMENTS),
            showOnBottomBar: Boolean(permissions.PAYMENTS),
            icon: <CreditCardIcon />,
        },
        {
            path: "/management/expenses",
            label: "Expense",
            show: Boolean(permissions.EXPENSE),
            showOnBottomBar: Boolean(permissions.EXPENSE),
            icon: <AccountBalanceWalletIcon />,
        },
        {
            path: "/analysis",
            label: "Analysis",
            show: Boolean(permissions.ANALYSIS),
            showOnBottomBar: Boolean(permissions.ANALYSIS),
            icon: <BarChartIcon />,
        },
        {
            path: "/management/reports",
            label: "Reports",
            show: Boolean(permissions.REPORTS),
            showOnBottomBar: Boolean(permissions.REPORTS),
            icon: <AnalyticsIcon />,
        },
        {
            path: "/management/template",
            label: "Templates",
            show: Boolean(permissions.TEMPLATES),
            showOnBottomBar: Boolean(permissions.TEMPLATES),
            icon: <DescriptionIcon />,
        },
    ];

    const superAdminRoutes: SidebarRoute[] = [
        {
            path: "/super-admin",
            label: "Dashboard",
            show: true,
            showOnBottomBar: true,
            icon: <DashboardIcon />,
        },
        {
            path: "/super-admin/studios",
            label: "All Studios",
            show: true,
            showOnBottomBar: true,
            icon: <StorefrontIcon />,
        },
        {
            path: "/super-admin/revenue",
            label: "Revenue",
            show: true,
            showOnBottomBar: true,
            icon: <CreditCardIcon />,
        },
        {
            path: "/super-admin/plans",
            label: "Plans",
            show: true,
            showOnBottomBar: true,
            icon: <CardGiftcardIcon />,
        },
    ];

    const routes: SidebarRoute[] = isSuperAdmin ? superAdminRoutes : studioRoutes;

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
                            {/* {isImpersonating && (
                                <motion.div
                                    custom={visibleRoutes.length}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<ArrowBack />}
                                        onClick={() => {
                                            setOpen(false);
                                            handleBackToSuperAdmin();
                                        }}
                                        fullWidth
                                        sx={{
                                            bgcolor: "#4c1d95",
                                            color: "#fff",
                                            fontWeight: 700,
                                            borderRadius: "0.75rem",
                                            textTransform: "none",
                                            py: 1.5,
                                            "&:hover": { bgcolor: "#6d28d9" },
                                        }}
                                    >
                                        Back to Super Admin
                                    </Button>
                                </motion.div>
                            )} */}
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

            {/* {isImpersonating && (
                <Box
                    sx={{
                        flexShrink: 0,
                        px: "0.4rem",
                        pb: 0.5,
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={!iconOnly ? <ArrowBack /> : undefined}
                        onClick={handleBackToSuperAdmin}
                        fullWidth
                        sx={{
                            bgcolor: "#4c1d95",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: iconOnly ? "0.6rem" : "0.7rem",
                            borderRadius: "0.75rem",
                            textTransform: "none",
                            minWidth: 0,
                            py: iconOnly ? 1 : 0.75,
                            "&:hover": { bgcolor: "#6d28d9" },
                        }}
                    >
                        {iconOnly ? (
                            <ArrowBack sx={{ fontSize: "1.1rem" }} />
                        ) : (
                            "Back to Super Admin"
                        )}
                    </Button>
                </Box>
            )} */}
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
