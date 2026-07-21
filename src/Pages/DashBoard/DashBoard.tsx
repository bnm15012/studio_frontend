import { useAppSelector } from "@/state";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Typography, Box, keyframes, Chip, Divider } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MoneyIcon from "@mui/icons-material/Money";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/core/components/feedback/Alert";
import { fetchDashBoardData } from "./Dashboard.api";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import Loading from "@/core/components/loading/Loading";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Group from "@mui/icons-material/Group";
import CardMembershipRounded from "@mui/icons-material/CardMembershipRounded";
import LocalActivityRounded from "@mui/icons-material/LocalActivityRounded";
import Payment from "@mui/icons-material/Payment";
import TrendingUp from "@mui/icons-material/TrendingUp";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import SummaryCard from "./SummaryCard";
import ImageComponent from "@/core/components/fields/ImageComponent";
import { useAppUI } from "@/context/UIContext";
import { FlexBetween } from "@/core/components/layout/FlexBox";

interface DashboardCardItem {
    color: string;
    value: number;
    label: string;
    navigateTo?: string;
    icon: ReactNode;
    blur?: unknown;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const floatAnim = keyframes`
  0%,100% { transform: translateY(0px);  }
  50%      { transform: translateY(-7px); }
`;

const shimmerBg = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
`;

// ── Income pill ────────────────────────────────────────────────────────────────
const IncomePill: React.FC<{ label: string; amount: number }> = ({ label, amount }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.25,
            px: { xs: 1.5, sm: 2 },
            py: 1,
            borderRadius: 2.5,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
        }}
    >
        <Typography
            variant="caption"
            sx={{
                opacity: 0.8,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.65rem",
            }}
        >
            {label}
        </Typography>
        <Typography
            variant="h6"
            sx={{
                fontWeight: 800,
                fontSize: { xs: "1rem", sm: "1.2rem" },
                letterSpacing: "-0.5px",
            }}
        >
            ₹{amount.toLocaleString()}
        </Typography>
    </Box>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const DashBoard: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin, isMobile, studio, currentBranch, token } = useAppUI();
    const showAlert = useAlert();

    const subscriptionPlan = useAppSelector((state) => state.auth.subscriptionPlan);
    const endDate = subscriptionPlan?.endDate ? new Date(subscriptionPlan.endDate) : new Date();
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const allActivities = useAppSelector((state) => state.activities.items);

    const [loading, setLoading] = useState(false);
    const [data, setDashboardData] = useState<DashboardCardItem[]>([]);
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
                        color: "#3B82F6",
                        value: tmp.totalStudents,
                        label: "Total Students",
                        navigateTo: "/management/students",
                        icon: <Group />,
                    },
                    {
                        color: "#10B981",
                        value: tmp.totalInstructors,
                        label: "Instructors",
                        navigateTo: "/management/instructors",
                        icon: <SchoolIcon />,
                    },
                    {
                        color: "#F59E0B",
                        value: tmp.totalActiveMemberships,
                        label: "Active Memberships",
                        icon: <CardMembershipRounded />,
                    },
                    {
                        color: "#EF4444",
                        value: allActivities.length || 0,
                        label: "Activities",
                        navigateTo: "/management/activity",
                        icon: <LocalActivityRounded />,
                    },
                    {
                        color: "#8B5CF6",
                        value: tmp.totalCurrentMonthPaymentAmount,
                        label: "Monthly Revenue",
                        navigateTo: "/management/payments",
                        icon: <CurrencyRupeeIcon />,
                    },
                    {
                        color: "#EC4899",
                        value: tmp.totalCurrentMonthPaymentCount,
                        label: "Payment Count",
                        navigateTo: "/management/payments",
                        icon: <Payment />,
                    },
                    {
                        color: "#06B6D4",
                        value: tmp.totalCurrentMonthExpenseAmount,
                        label: "Monthly Expenses",
                        navigateTo: "/management/expenses",
                        icon: <MoneyIcon />,
                    },
                    {
                        color: "#64748B",
                        value: tmp.totalCurrentMonthExpenseCount,
                        label: "Expense Count",
                        navigateTo: "/management/expenses",
                        icon: <TrendingUp />,
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
    }, [token, currentBranch.branchId, allActivities.length, showAlert]);

    useEffect(() => {
        if (user) loadDashboardData();
    }, [user, allActivities, loadDashboardData]);

    return (
        <WidgetsOnPage isSidebarShouldBeOn={true}>
            <Box
                sx={{
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                    height: "100vh",
                }}
            >
                {loading && <Loading />}

                {/* ── Hero banner ──────────────────────────────────── */}
                <Box
                    sx={{
                        borderRadius: { xs: 3, md: 4 },
                        p: { xs: 2, sm: 2.5, md: 3 },
                        background:
                            "linear-gradient(135deg, #1e3a8a 0%, #312e81 40%, #4c1d95 80%, #6d28d9 100%)",
                        backgroundSize: "300% 300%",
                        animation: `${shimmerBg} 8s linear infinite, ${fadeInUp} 0.5s ease-out`,
                        color: "white",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 8px 32px rgba(99,57,255,0.35), 0 2px 8px rgba(0,0,0,0.2)",
                        // Glass highlight
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                            pointerEvents: "none",
                        },
                    }}
                >
                    {/* Studio identity */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
                        <Box
                            sx={{
                                animation: `${floatAnim} 3.5s ease-in-out infinite`,
                                flexShrink: 0,
                            }}
                        >
                            <ImageComponent
                                size={isMobile ? "3.5rem" : "5rem"}
                                value={studio.logo || "/assets/default_logo.png"}
                                isCircular
                            />
                        </Box>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2rem" },
                                    letterSpacing: "-0.5px",
                                    textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                                    lineHeight: 1.2,
                                }}
                            >
                                {studio.studioName}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.7,
                                    mt: 0.25,
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                }}
                            >
                                {currentBranch.name} Branch
                            </Typography>
                        </Box>
                    </Box>

                    {isAdmin && (
                        <FlexBetween
                            gap={1}
                            flexDirection={isMobile ? "row" : "column"}
                            width={isMobile ? "100%" : "fit-content"}
                        >
                            <IncomePill label="This Month" amount={currentMonthIncome} />
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    borderColor: "rgba(255,255,255,0.2)",
                                    display: { xs: "none", sm: "block" },
                                }}
                            />
                            <IncomePill label="Last Month" amount={lastMonthIncome} />
                        </FlexBetween>
                    )}
                </Box>

                {daysRemaining < 8 && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2.5,
                            background: "linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)",
                            border: "1px solid #ffc107",
                            animation: `${fadeInUp} 0.55s ease-out`,
                            boxShadow: "0 2px 12px rgba(255,193,7,0.2)",
                        }}
                    >
                        <WarningAmberRounded
                            sx={{
                                color: "#f57c00",
                                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                                flexShrink: 0,
                            }}
                        />
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: "#bf360c",
                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            }}
                        >
                            Your {studio.amcEnabled ? "AMC Service" : "Subscription"}{" "}
                            {daysRemaining <= 0
                                ? "has expired"
                                : `expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`}
                            . Please renew soon.
                        </Typography>
                        {daysRemaining <= 0 && (
                            <Chip
                                label="Expired"
                                size="small"
                                sx={{
                                    ml: "auto",
                                    background: "#bf360c",
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                }}
                            />
                        )}
                    </Box>
                )}

                {/* ── Overview (pinned to bottom) ───────────────────── */}
                <Box
                    sx={{
                        mt: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 1, md: 1.5 },
                    }}
                >
                    {/* Stats grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            gridTemplateColumns: {
                                xs: "repeat(2, 1fr)",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(4, 1fr)",
                            },
                        }}
                    >
                        {data.map((item: DashboardCardItem, index: number) => {
                            const delay = 0.05 * index;
                            return (
                                <SummaryCard
                                    key={index}
                                    onShowMore={() => item.navigateTo && navigate(item.navigateTo)}
                                    color={item.color}
                                    value={item.value}
                                    label={item.label}
                                    icon={item.icon}
                                    delay={delay}
                                    blurValue={item.blur as boolean | undefined}
                                />
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </WidgetsOnPage>
    );
};

export default DashBoard;
