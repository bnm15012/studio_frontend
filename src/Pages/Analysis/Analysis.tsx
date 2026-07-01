import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    FormControl,
    Select,
    MenuItem,
    useTheme,
} from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import WidgetsOnPage from "../../core/components/layout/WidgetsOnPage";
import { fetchReportData } from "./analysis.api";
import Loading from "../../core/components/loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setAnalysisData } from "../../state/analysisSlice";

// Registering required chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "right",
            align: "start",
            labels: {
                boxWidth: 15,
                padding: 15,
                font: {
                    size: 12,
                },
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
                size: 14,
            },
            bodyFont: {
                size: 13,
            },
        },
    },
    animation: {
        duration: 1500,
        easing: "easeOutQuart",
    },
};

const Analysis = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const years = useMemo(
        () => Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i),
        [],
    );
    const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const token = useSelector((state) => state.auth.token);
    const [expenseData, setExpenseData] = useState();
    const [incomeLineData, setIncomeLineData] = useState({});
    const [incomeBarData, setIncomeBarData] = useState({});
    const [paymentData, setPaymentData] = useState({});
    const [activityData, setActivityData] = useState({});
    const [loading, setLoading] = useState(false);
    const analysisData = useSelector((state) => state.analysis.data);

    const loadDashboardData = useCallback(
        async (year) => {
            try {
                setLoading(true);
                let response;
                if ("success" in analysisData && year === years[years.length - 1]) {
                    response = analysisData;
                } else {
                    response = await fetchReportData({
                        token,
                        branchId: currentBranch.branchId,
                        year,
                    });
                    if (year === years[years.length - 1]) {
                        dispatch(setAnalysisData(response));
                    }
                }
                if (response.success) {
                    setExpenseData(response.data.expenseData);
                    setPaymentData(response.data.paymentData);
                    setIncomeLineData(response.data.expenseVsPaymentBarData);
                    setIncomeBarData(response.data.expenseVsPaymentBarData);
                    setActivityData(response.data.activityData);
                }
            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                setLoading(false);
            }
        },
        [analysisData, years, token, currentBranch.branchId, dispatch],
    );

    useEffect(() => {
        loadDashboardData(selectedYear);
    }, [selectedYear]);

    return (
        <WidgetsOnPage
            isSidebarShouldBeOn={true}
            components={
                <Box p={3} sx={{ backgroundColor: theme.palette.background.paper }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 4,
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h4" sx={{ color: "#3f51b5" }}>
                            Analysis
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        Year {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {loading ? (
                        <Loading />
                    ) : (
                        expenseData &&
                        paymentData &&
                        incomeBarData &&
                        incomeLineData &&
                        activityData && (
                            <>
                                {/* Row 1 */}
                                <Grid container spacing={3} mb={3}>
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Income & Expense
                                                </Typography>
                                                <Box sx={{ height: 275 }}>
                                                    <Line
                                                        data={incomeLineData}
                                                        options={chartOptions}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Expense Categories
                                                </Typography>
                                                <Box sx={{ height: 275 }}>
                                                    <Pie
                                                        data={expenseData}
                                                        options={chartOptions}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Row 2 */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Income & Expense
                                                </Typography>
                                                <Box sx={{ height: 275 }}>
                                                    <Bar
                                                        data={incomeBarData}
                                                        options={chartOptions}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Payment By PayeeType
                                                </Typography>
                                                <Box sx={{ height: 275 }}>
                                                    <Pie
                                                        data={paymentData}
                                                        options={chartOptions}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </>
                        )
                    )}
                </Box>
            }
        />
    );
};

export default Analysis;
