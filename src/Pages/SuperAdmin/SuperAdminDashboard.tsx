import React, { useCallback, useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Divider, keyframes, alpha } from "@mui/material";
import {
    Business as BusinessIcon,
    CheckCircle as ActiveIcon,
    Cancel as ExpiredIcon,
    HourglassBottom as TrialIcon,
    CurrencyRupee as RupeeIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/core/components/feedback/Alert";
import { fetchDashboardStats, type DashboardStats } from "@/Pages/SuperAdmin/superadmin.api";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import SummaryCard from "@/Pages/DashBoard/SummaryCard";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { Bar, Pie } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

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
            {"\u20B9"}
            {(amount ?? 0).toLocaleString()}
        </Typography>
    </Box>
);

const PLAN_COLORS: Record<string, string> = {
    MONTHLY: "#3B82F6",
    QUARTERLY: "#10B981",
    HALF_YEARLY: "#F59E0B",
    YEARLY: "#8B5CF6",
    AMC: "#EC4899",
    OTHER: "#64748B",
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: { font: { size: 11 } },
        },
        x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
        },
    },
};

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "right" as const,
            labels: { font: { size: 12 }, padding: 12 },
        },
    },
};

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const showAlert = useAlert();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const loadStats = useCallback(async () => {
        setLoading(true);
        const result = await fetchDashboardStats();
        if (result.success && result.data) {
            setStats(result.data);
        } else {
            showAlert("Failed to fetch dashboard stats", "error");
        }
        setLoading(false);
    }, [showAlert]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const cards = stats
        ? [
              {
                  color: "#3B82F6",
                  value: stats.totalStudios,
                  label: "Total Studios",
                  icon: <BusinessIcon />,
                  navigateTo: "/super-admin/studios",
              },
              {
                  color: "#10B981",
                  value: stats.activeSubscriptions,
                  label: "Active Subscriptions",
                  icon: <ActiveIcon />,
                  navigateTo: "/super-admin/studios",
              },
              {
                  color: "#EF4444",
                  value: stats.expiredSubscriptions,
                  label: "Expired",
                  icon: <ExpiredIcon />,
                  navigateTo: "/super-admin/studios",
              },
              {
                  color: "#F59E0B",
                  value: stats.trialStudios,
                  label: "On Trial",
                  icon: <TrialIcon />,
                  navigateTo: "/super-admin/studios",
              },
              {
                  color: "#8B5CF6",
                  value: `\u20B9${(stats.totalRevenue ?? 0).toLocaleString()}`,
                  label: "Total Revenue",
                  icon: <RupeeIcon />,
                  navigateTo: "/super-admin/revenue",
              },
              {
                  color: "#06B6D4",
                  value: `\u20B9${(stats.currentMonthRevenue ?? 0).toLocaleString()}`,
                  label: "This Month Revenue",
                  icon: <TrendingUpIcon />,
                  navigateTo: "/super-admin/revenue",
              },
              {
                  color: "#64748B",
                  value: `\u20B9${(stats.lastMonthRevenue ?? 0).toLocaleString()}`,
                  label: "Last Month Revenue",
                  icon: <RupeeIcon />,
                  navigateTo: "/super-admin/revenue",
              },
          ]
        : [];

    const barChartData: ChartData<"bar"> | null = stats?.monthlyTrend
        ? {
              labels: stats.monthlyTrend.map((t) => t.month),
              datasets: [
                  {
                      label: "Revenue",
                      data: stats.monthlyTrend.map((t) => t.revenue),
                      backgroundColor: stats.monthlyTrend.map((_, i) =>
                          alpha(i === stats.monthlyTrend.length - 1 ? "#6d28d9" : "#3B82F6", 0.8),
                      ),
                      borderRadius: 6,
                      borderSkipped: false,
                  },
              ],
          }
        : null;

    const pieChartData: ChartData<"pie"> | null = stats?.revenueByPlan
        ? {
              labels: Object.keys(stats.revenueByPlan).map((k) => k.replace(/_/g, " ")),
              datasets: [
                  {
                      data: Object.values(stats.revenueByPlan),
                      backgroundColor: Object.keys(stats.revenueByPlan).map(
                          (k) => PLAN_COLORS[k] || PLAN_COLORS.OTHER,
                      ),
                      borderWidth: 2,
                      borderColor: "#fff",
                  },
              ],
          }
        : null;

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
                <TopProgressBar loading={loading} />

                <Box
                    sx={{
                        borderRadius: { xs: 3, md: 4 },
                        p: { xs: 2, sm: 2.5, md: 3 },
                        background:
                            "linear-gradient(135deg, #1e3a8a 0%, #312e81 40%, #4c1d95 80%, #6d28d9 100%)",
                        color: "white",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 8px 32px rgba(99,57,255,0.35), 0 2px 8px rgba(0,0,0,0.2)",
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
                        animation: `${fadeInUp} 0.5s ease-out`,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
                        <BusinessIcon sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} />
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
                                Super Admin Dashboard
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.7,
                                    mt: 0.25,
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                }}
                            >
                                Overview of all studios and subscriptions
                            </Typography>
                        </Box>
                    </Box>

                    {stats && stats.totalRevenue != null && (
                        <FlexBetween gap={1} sx={{ zIndex: 1 }}>
                            <IncomePill
                                label="This Month"
                                amount={stats.currentMonthRevenue ?? 0}
                            />
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ borderColor: "rgba(255,255,255,0.2)" }}
                            />
                            <IncomePill label="Last Month" amount={stats.lastMonthRevenue ?? 0} />
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ borderColor: "rgba(255,255,255,0.2)" }}
                            />
                            <IncomePill label="Total Revenue" amount={stats.totalRevenue ?? 0} />
                        </FlexBetween>
                    )}
                </Box>

                {stats && (barChartData || pieChartData) && (
                    <Box
                        sx={{
                            display: "grid",
                            gap: { xs: 1.5, md: 2 },
                            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                        }}
                    >
                        {barChartData && (
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                    animation: `${fadeInUp} 0.6s ease-out`,
                                }}
                            >
                                <CardContent>
                                    <FlexBetween mb={1.5}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <TrendingUpIcon
                                                color="primary"
                                                sx={{ fontSize: "1.3rem" }}
                                            />
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                Monthly Revenue Trend
                                            </Typography>
                                        </Box>
                                    </FlexBetween>
                                    <Box sx={{ height: { xs: 200, md: 250 } }}>
                                        <Bar data={barChartData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {pieChartData && (
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                    animation: `${fadeInUp} 0.7s ease-out`,
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1.5,
                                        }}
                                    >
                                        <RupeeIcon color="primary" sx={{ fontSize: "1.3rem" }} />
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            Subscriptions by Plan
                                        </Typography>
                                    </Box>
                                    <Box sx={{ height: { xs: 200, md: 250 } }}>
                                        <Pie data={pieChartData} options={pieOptions} />
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                )}

                <Box
                    sx={{
                        mt: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 1, md: 1.5 },
                    }}
                >
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
                        {cards.map((item, index) => (
                            <SummaryCard
                                key={index}
                                onShowMore={() => navigate(item.navigateTo)}
                                color={item.color}
                                value={item.value}
                                label={item.label}
                                icon={item.icon}
                                delay={0.05 * index}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </WidgetsOnPage>
    );
};

export default SuperAdminDashboard;
