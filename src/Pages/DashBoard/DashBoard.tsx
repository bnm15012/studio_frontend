import { useAppSelector } from "@/state";
import React, { useCallback, useEffect, useState } from "react";
import { Typography, Box, Paper, keyframes, alpha } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MoneyIcon from "@mui/icons-material/Money";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/core/components/feedback/Alert";
import { useSelector } from "react-redux";
import { fetchDashBoardData } from "./Dashboard.api";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import Loading from "@/core/components/loading/Loading";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Group from "@mui/icons-material/Group";
import CardMembershipRounded from "@mui/icons-material/CardMembershipRounded";
import LocalActivityRounded from "@mui/icons-material/LocalActivityRounded";
import Payment from "@mui/icons-material/Payment";
import TrendingUp from "@mui/icons-material/TrendingUp";
import SummaryCard from "./SummaryCard";
import ImageComponent from "@/core/components/fields/ImageComponent";
import { useUI } from "../../context/UIContext";

// Entrance animation (fade + up + subtle scale)
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// Gentle float for logo/hero visual
const floatAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;

const DashBoard: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin, isMobile } = useUI();
    const showAlert = useAlert();

    const user = useAppSelector((state) => state.auth.user);
    const studio = useAppSelector((state) => state.auth.studio);
    const currentBranch = useAppSelector((state) => state.branch.currentBranch);
    const subscriptionPlan = useAppSelector((state) => state.auth.subscriptionPlan);
    const token = useAppSelector((state) => state.auth.token);
    const endDate = subscriptionPlan?.endDate ? new Date(subscriptionPlan.endDate) : new Date();
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const allActivities = useAppSelector((state) => state.activities.items);
    const [loading, setLoading] = useState(false);
    const [data, setDashboardData] = useState<any[] | null>(null);

    const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
    const [lastMonthIncome, setLastMonthIncome] = useState(0);

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchDashBoardData({
                token,
                branchId: currentBranch.branchId,
            });

            if (response.success) {
                const tmp = response.data.data[0];
                setLastMonthIncome(tmp.lastMonthRevenue);
                setCurrentMonthIncome(tmp.currentMonthRevenue);
                setDashboardData([
                    {
                        color: "#2196F3",
                        value: tmp.totalStudents,
                        label: "Total Students",
                        navigateTo: "/management/students",
                        icon: <Group sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#4CAF50",
                        value: tmp.totalInstructors,
                        label: "Total Instructors",
                        navigateTo: "/management/instructors",
                        icon: <SchoolIcon sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#FF9800",
                        value: tmp.totalActiveMemberships,
                        label: "Active Memberships",
                        icon: <CardMembershipRounded sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#E91E63",
                        value: allActivities?.length || 0,
                        label: "Total Activities",
                        navigateTo: "/management/activity",
                        icon: <LocalActivityRounded sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#9C27B0",
                        value: tmp.totalCurrentMonthPaymentAmount,
                        label: "Total Payment",
                        navigateTo: "/management/payments",
                        icon: <CurrencyRupeeIcon sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#795548",
                        value: tmp.totalCurrentMonthPaymentCount,
                        label: "Payment Count",
                        navigateTo: "/management/payments",
                        icon: <Payment sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#607D8B",
                        value: tmp.totalCurrentMonthExpenseAmount,
                        label: "Monthly Expenses",
                        navigateTo: "/management/expenses",
                        icon: <MoneyIcon sx={{ fontSize: 45 }} />,
                    },
                    {
                        color: "#009688",
                        value: tmp.totalCurrentMonthExpenseCount,
                        label: "Expense Count",
                        navigateTo: "/management/expenses",
                        icon: <TrendingUp sx={{ fontSize: 45 }} />,
                    },
                ]);
            } else {
                showAlert(response.message, "error");
            }
        } catch (e) {
            console.error(e);
            showAlert("Failed to fetch dashboard data.", "error");
        } finally {
            setLoading(false);
        }
    }, [token, currentBranch?.branchId, allActivities?.length, showAlert]);

    useEffect(() => {
        if (user) loadDashboardData();
    }, [user, allActivities, loadDashboardData]);

    return (
        <WidgetsOnPage
            isSidebarShouldBeOn={true}
            components={
                <>
                    {loading && <Loading />}
                    <Paper
                        elevation={3}
                        sx={{
                            borderRadius: 4,
                            p: { xs: 2, md: 3 },
                            background: "linear-gradient(135deg,#2196F3 0%,#0D47A1 100%)",
                            color: "white",
                            animation: `${fadeInUp} .5s ease-out`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <FlexBetween gap={2}>
                            <Box
                                sx={{
                                    animation: `${floatAnim} 3.2s ease-in-out infinite`,
                                }}
                            >
                                <ImageComponent
                                    size="9rem"
                                    value={studio?.logo || "/assets/default_logo.png"}
                                    isCircular
                                />
                            </Box>

                            <Typography
                                variant="h1"
                                sx={{
                                    my: "auto",
                                    fontSize: { xs: "1.85rem", sm: "2.4rem", md: "3rem" },
                                    fontWeight: 800,
                                    textShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                }}
                            >
                                {studio?.studioName}
                            </Typography>
                        </FlexBetween>

                        {isAdmin && (
                            <FlexBetween
                                flexDirection={!isMobile ? "column" : "row"}
                                width={isMobile ? "100%" : "auto"}
                                flexWrap="wrap"
                                sx={{
                                    borderRadius: 3,
                                    p: 2,
                                    background: alpha("#fff", 0.08),
                                    backdropFilter: "blur(6px)",
                                }}
                            >
                                <FlexBetween gap={2} flexDirection={isMobile ? "column" : "row"}>
                                    <Typography variant="h4" sx={{ opacity: 0.9, my: "auto" }}>
                                        Current Month Income
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, my: "auto" }}>
                                        ₹{currentMonthIncome}
                                    </Typography>
                                </FlexBetween>
                                <FlexBetween gap={2} flexDirection={isMobile ? "column" : "row"}>
                                    <Typography variant="h4" sx={{ opacity: 0.9, my: "auto" }}>
                                        Last Month Income
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, my: "auto" }}>
                                        ₹{lastMonthIncome}
                                    </Typography>
                                </FlexBetween>
                            </FlexBetween>
                        )}
                    </Paper>

                    {daysRemaining < 8 && (
                        <Box
                            sx={{
                                background: "#fff8e1",
                                p: 2,
                                mt: 2,
                                mb: 3,
                                borderRadius: 3,
                                border: "1px solid #ffe0b2",
                                animation: `${fadeInUp} .55s ease-out`,
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, color: "#bf360c" }}>
                                Note: Your {studio?.amcEnabled ? "AMC Service" : "Subscription"}{" "}
                                {daysRemaining === 0
                                    ? "has ended"
                                    : `will expire in ${daysRemaining} days`}
                                . Please renew soon.
                            </Typography>
                        </Box>
                    )}

                    <Box
                        mt={2}
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                                xs: "repeat(1, 1fr)",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(4, 1fr)",
                            },
                        }}
                    >
                        {data?.map((item: any, index: number) => {
                            const delay = 0.06 * index; // stagger
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        animation: `${fadeInUp} .6s cubic-bezier(.2,.9,.2,1) ${delay}s both`,
                                        transformOrigin: "center",
                                        transition: "transform .18s ease, box-shadow .18s ease",
                                        borderRadius: 2,
                                        "&:hover": {
                                            transform: "translateY(-6px) scale(1.02)",
                                            boxShadow:
                                                "0 10px 30px rgba(16,24,40,0.12), 0 2px 8px rgba(16,24,40,0.06)",
                                        },
                                        "&:active": { transform: "translateY(-2px) scale(1.01)" },
                                    }}
                                >
                                    <SummaryCard
                                        onShowMore={() =>
                                            item.navigateTo && navigate(item.navigateTo)
                                        }
                                        color={item.color}
                                        value={item.value}
                                        label={item.label}
                                        icon={item.icon}
                                        delay={delay}
                                        blurValue={item.blur}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </>
            }
        />
    );
};

export default DashBoard;
