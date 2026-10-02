import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    TableBody,
    TableHead,
    Chip,
    IconButton,
    Tooltip,
    FormControl,
    Select,
    MenuItem,
    keyframes,
} from "@mui/material";
import {
    Refresh as RefreshIcon,
    CurrencyRupee as RupeeIcon,
    Receipt as ReceiptIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useAlert } from "@/core/components/feedback/Alert";
import { fetchRevenue, type RevenueData } from "@/Pages/SuperAdmin/superadmin.api";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "@/core/components/tables/StyledTableComponents";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const Revenue: React.FC = () => {
    const showAlert = useAlert();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RevenueData | null>(null);

    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const loadRevenue = useCallback(async () => {
        setLoading(true);
        const result = await fetchRevenue(selectedMonth, selectedYear);
        if (result.success && result.data) {
            setData(result.data);
        } else {
            showAlert("Failed to fetch revenue data", "error");
        }
        setLoading(false);
    }, [selectedMonth, selectedYear, showAlert]);

    useEffect(() => {
        loadRevenue();
    }, [loadRevenue]);

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear((y) => y - 1);
        } else {
            setSelectedMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        const isCurrentMonth =
            selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
        if (isCurrentMonth) return;
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear((y) => y + 1);
        } else {
            setSelectedMonth((m) => m + 1);
        }
    };

    const isCurrentMonth =
        selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();

    const years: number[] = [];
    for (let y = 2023; y <= now.getFullYear(); y++) years.push(y);

    const statusColor = (status: string): "success" | "error" | "warning" | "default" => {
        switch (status?.toUpperCase()) {
            case "ACTIVE":
                return "success";
            case "EXPIRED":
                return "error";
            case "CREATED":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <WidgetsOnPage isSidebarShouldBeOn={true}>
            <Box
                sx={{
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                    height: "100%",
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
                        <ReceiptIcon sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} />
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
                                Revenue
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.7,
                                    mt: 0.25,
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                }}
                            >
                                Subscription payments & earnings
                            </Typography>
                        </Box>
                    </Box>

                    {data && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                zIndex: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 2.5,
                                background: "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.18)",
                            }}
                        >
                            <RupeeIcon sx={{ fontSize: "1.5rem" }} />
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        opacity: 0.8,
                                        fontWeight: 600,
                                        fontSize: "0.65rem",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
                                >
                                    {"\u20B9"}
                                    {(data.totalAmount ?? 0).toLocaleString()}
                                </Typography>
                            </Box>
                            <Chip
                                label={`${data.totalPayments ?? 0} payments`}
                                size="small"
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    color: "white",
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                    )}
                </Box>

                <FlexBetween gap={1} sx={{ height: "3rem", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title="Previous Month">
                            <IconButton onClick={handlePrevMonth} sx={iconBtnFilledSx} size="small">
                                <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
                            </IconButton>
                        </Tooltip>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value as number)}
                                sx={{ borderRadius: "0.75rem", fontSize: "0.85rem" }}
                            >
                                {MONTH_NAMES.map((name, i) => (
                                    <MenuItem key={i} value={i + 1}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value as number)}
                                sx={{ borderRadius: "0.75rem", fontSize: "0.85rem" }}
                            >
                                {years.map((y) => (
                                    <MenuItem key={y} value={y}>
                                        {y}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title={isCurrentMonth ? "Already on current month" : "Next Month"}>
                            <span>
                                <IconButton
                                    onClick={handleNextMonth}
                                    disabled={isCurrentMonth}
                                    sx={iconBtnFilledSx}
                                    size="small"
                                >
                                    <ArrowForwardIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    <Tooltip title="Refresh">
                        <IconButton onClick={loadRevenue} sx={iconBtnFilledSx}>
                            <RefreshIcon sx={{ fontSize: "1.25rem" }} />
                        </IconButton>
                    </Tooltip>
                </FlexBetween>

                <StyledTableContainer>
                    <StyledTable>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>#</StyledTableCell>
                                <StyledTableCell>Studio</StyledTableCell>
                                <StyledTableCell>Plan</StyledTableCell>
                                <StyledTableCell>Amount</StyledTableCell>
                                <StyledTableCell>Start Date</StyledTableCell>
                                <StyledTableCell>End Date</StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell>Order ID</StyledTableCell>
                                <StyledTableCell>Payment ID</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {data?.payments?.map((payment, index) => (
                                <StyledTableRow key={payment.subscriptionId}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 600 }}>
                                        {payment.studioName}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={payment.plan?.replace(/_/g, " ")}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography sx={{ fontWeight: 700, color: "success.main" }}>
                                            {"\u20B9"}
                                            {(payment.amount ?? 0).toLocaleString()}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {payment.startDate
                                            ? new Date(payment.startDate).toLocaleDateString(
                                                  "en-GB",
                                              )
                                            : "-"}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {payment.endDate
                                            ? new Date(payment.endDate).toLocaleDateString("en-GB")
                                            : "-"}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={payment.status}
                                            size="small"
                                            color={statusColor(payment.status)}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography
                                            variant="caption"
                                            sx={{ fontFamily: "monospace" }}
                                        >
                                            {payment.orderId || "-"}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography
                                            variant="caption"
                                            sx={{ fontFamily: "monospace" }}
                                        >
                                            {payment.paymentId || "-"}
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {(!data?.payments || data.payments.length === 0) && !loading && (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No payments found for {MONTH_NAMES[selectedMonth - 1]}{" "}
                                            {selectedYear}
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </StyledTable>
                </StyledTableContainer>
            </Box>
        </WidgetsOnPage>
    );
};

export default Revenue;
