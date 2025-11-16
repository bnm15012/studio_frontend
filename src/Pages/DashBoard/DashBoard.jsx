import { useCallback, useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, keyframes } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MoneyIcon from "@mui/icons-material/Money";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../utils/Alert";
import { useSelector } from "react-redux";
import { fetchDashBoardData } from "./Dashboard.api";
import WidgetsOnPage from "../../Components/WidgetsOnPage";
import Loading from "../../Components/Loading/Loading";
import FlexBetween from "../../Components/FlexBetween";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Group from "@mui/icons-material/Group";
import CardMembershipRounded from "@mui/icons-material/CardMembershipRounded";
import LocalActivityRounded from "@mui/icons-material/LocalActivityRounded";
import Payment from "@mui/icons-material/Payment";
import TrendingUp from "@mui/icons-material/TrendingUp";
import SummaryCard from "./SummaryCard";
import ImageComponent from "../../Components/ImageComponent";
import { convertUTCToLocal } from "../../utils/DateUtil";
import { useUI } from "../../context/UIContext";

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DashBoard = () => {
    const navigate = useNavigate();
    const { isAdmin } = useUI();
    const showAlert = useAlert();
    const user = useSelector((state) => state.auth.user);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);

    const endDate = subscriptionPlan?.endDate
        ? new Date(convertUTCToLocal(subscriptionPlan.endDate))
        : new Date();
    const today = new Date();
    const timeDiff = endDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const token = useSelector((state) => state.auth.token);
    const allActivities = useSelector((state) => state.activity.activities);
    const [loading, setLoading] = useState(false);
    const [data, setDashboardData] = useState(null);

    const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
    const [lastMonthIncome, setLastMonthIncome] = useState(0);

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchDashBoardData({
                token: token,
                branchId: currentBranch.branchId,
            });
            if (response.success) {
                const tmp = response.data.data[0];
                setLastMonthIncome(tmp.lastMonthRevenue);
                setCurrentMonthIncome(tmp.currentMonthRevenue);
                const summaryData = [
                    {
                        color: "#2196F3",
                        value: tmp.totalStudents,
                        label: "Total Students",
                        navigateTo: "/management/students",
                        icon: <Group sx={{ fontSize: "40px" }} />,
                    },
                    {
                        color: "#4CAF50",
                        value: tmp.totalInstructors,
                        label: "Total Instructors",
                        navigateTo: "/management/instructors",
                        icon: <SchoolIcon sx={{ fontSize: "40px" }} />,
                    },
                    {
                        color: "#FF9800",
                        value: tmp.totalActiveMemberships,
                        label: "Active Memberships",
                        icon: <CardMembershipRounded sx={{ fontSize: "40px" }} />,
                    },
                    {
                        color: "#E91E63",
                        value: allActivities?.length,
                        label: "Total Activities",
                        navigateTo: "/management/activity",
                        icon: <LocalActivityRounded sx={{ fontSize: "40px" }} />,
                    },
                    {
                        color: "#9C27B0",
                        value: tmp.totalCurrentMonthPaymentAmount,
                        label: "Total Payment",
                        navigateTo: "/management/payments",
                        icon: <CurrencyRupeeIcon sx={{ fontSize: "40px" }} />,
                        // blur: !isAdmin,
                    },
                    {
                        color: "#795548",
                        value: tmp.totalCurrentMonthPaymentCount,
                        label: "Payment Count",
                        navigateTo: "/management/payments",
                        icon: <Payment sx={{ fontSize: "40px" }} />,
                    },
                    {
                        color: "#607D8B",
                        value: tmp.totalCurrentMonthExpenseAmount,
                        label: "Monthly Expenses",
                        navigateTo: "/management/expenses",
                        icon: <MoneyIcon sx={{ fontSize: "40px" }} />,
                    },
                    {
                        color: "#009688",
                        value: tmp.totalCurrentMonthExpenseCount,
                        label: "Expense Count",
                        navigateTo: "/management/expenses",
                        icon: <TrendingUp sx={{ fontSize: "40px" }} />,
                    },
                ];
                setDashboardData(summaryData);
            } else {
                showAlert(response.message, "error");
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to fetch dashboard data.", "error");
        } finally {
            setLoading(false);
        }
    }, [token, currentBranch.branchId, allActivities?.length, showAlert]);

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
                        elevation={2}
                        sx={{
                            boxShadow: `0px 4px 4px #1976D2 `,
                            p: { xs: 1.5, md: 2 },
                            mb: 2,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                            animation: `${fadeIn} 0.6s ease-out`,
                        }}
                    >
                        <FlexBetween flexWrap="wrap" gap={1}>
                            <FlexBetween
                                gap={2}
                                flexWrap={"wrap"}
                                sx={{ justifyContent: "center" }}
                            >
                                <ImageComponent
                                    size={"10rem"}
                                    value={studio?.logo || "/assets/default_logo.png"}
                                    isCircular={true}
                                />
                                <Typography
                                    variant="h1"
                                    sx={{
                                        textAlign: "center",
                                        justifyContent: "center",
                                        fontWeight: 800,
                                        fontSize: { xs: "2rem", sm: "2rem", md: "2.5rem" },
                                        color: "white",
                                        textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                                        letterSpacing: 1,
                                        my: "auto",
                                    }}
                                >
                                    {studio?.studioName}
                                </Typography>
                            </FlexBetween>
                            {isAdmin && (
                                <Box
                                    sx={{
                                        background: "rgba(255,255,255,0.1)",
                                        borderRadius: 2,
                                        p: 2,
                                        backdropFilter: "blur(5px)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ fontWeight: 500 }}>
                                            Current Month Revenue :
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                            ₹{currentMonthIncome}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ fontWeight: 500 }}>
                                            Last Month Revenue :
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                            ₹{lastMonthIncome}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </FlexBetween>
                    </Paper>
                    <Box flexGrow={1}>
                        {daysRemaining < 8 && (
                            <Box
                                sx={{
                                    color: "red",
                                    p: 1,
                                    mb: 2,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    animation: "blink 1s infinite",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        "@keyframes blink": {
                                            "0%": { opacity: 1 },
                                            "50%": { opacity: 0 },
                                            "100%": { opacity: 1 },
                                        },
                                    }}
                                >
                                    Note: Your {studio?.amcEnabled ? "AMC Service" : "Subscription"}{" "}
                                    is{" "}
                                    {daysRemaining === 0
                                        ? "ended"
                                        : `about to expire within ${daysRemaining} days`}
                                    . Please renew to continue enjoying our services!
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <Grid container spacing={2}>
                            {data?.map((item, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <SummaryCard
                                        onShowMore={() =>
                                            item.navigateTo && navigate(item.navigateTo)
                                        }
                                        color={item.color}
                                        value={item.value}
                                        label={item.label}
                                        icon={item.icon}
                                        delay={0.1 * index}
                                        blurValue={item.blur}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            }
        />
    );
};

export default DashBoard;
