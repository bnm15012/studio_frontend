import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { formatDate, getCurrentDateTimeLocal, getLocalDateTime } from "@/core/utils/DateUtil";
import { useAlert } from "@/core/components/feedback/Alert";
import Loading from "@/core/components/loading/Loading";
import { reportsAPi } from "./reports.api";
import { useAppUI } from "@/context/UIContext";
import HtmlToPdfViewer, { HtmlToPdfViewerRef } from "@/core/components/Html2PDF/HtmlToPdfViewer";

interface ReportData {
    income?: unknown[][];
    expenses?: unknown[][];
    totalIncome?: number;
    totalExpense?: number;
    pendingPaymentEntries?: unknown[][];
    totalPendingPayment?: number;
    completedPaymentEntries?: unknown[][];
    totalCompletedPayment?: number;
}

const Reports: React.FC = () => {
    const pdfViewerRef = useRef<HtmlToPdfViewerRef>(null);
    const theme = useTheme();
    const { isMobile, token, studio, currentBranch } = useAppUI();
    const showAlert = useAlert();

    const today = new Date();

    const [startDateValue, setStartDate] = useState<Date | null>(
        new Date(today.getFullYear(), today.getMonth(), 1),
    );
    const [endDateValue, setEndDate] = useState<Date | null>(
        new Date(today.getFullYear(), today.getMonth() + 1, 0),
    );
    const [loading, setLoading] = useState(false);
    const [eiData, setEiData] = useState<ReportData | null>(null);
    const [reportType, setReportType] = useState("incomeExpense");
    const [paymentStatus, setPaymentStatus] = useState("COMPLETED");
    const [paymentMethod, setPaymentMethod] = useState("All");

    const getData = async () => {
        if (!startDateValue || !endDateValue) {
            showAlert("Please select both start and end dates.", "warning");
            return;
        }

        if (startDateValue > endDateValue) {
            showAlert("Start date cannot be after end date.", "warning");
            return;
        }
        setLoading(true);
        const commonPayload = {
            endDate: endDateValue.getDate(),
            startDate: startDateValue.getDate(),
            endMonth: endDateValue.getMonth() + 1,
            endYear: endDateValue.getFullYear(),
            startMonth: startDateValue.getMonth() + 1,
            startYear: startDateValue.getFullYear(),
            studioId: studio.studioId!,
            paymentMethod,
            branchId: currentBranch.branchId,
        };
        try {
            if (reportType === "incomeExpense") {
                const resultIE = await reportsAPi({
                    token,
                    status: "",
                    type: "incomeExpense",
                    ...commonPayload,
                });
                const { data, success, message } = resultIE as {
                    data: Record<string, unknown>[];
                    success: boolean;
                    message: string;
                };

                if (success && data.length > 0) {
                    const report = data[0]?.ieMonthlyReportEntry as
                        | Record<string, unknown>
                        | undefined;
                    if (!report) {
                        setEiData({ income: [], expenses: [], totalIncome: 0, totalExpense: 0 });
                        showAlert("No data available.", "warning");
                        return;
                    }
                    const totalIncome = Number(report.income ?? 0);
                    const totalExpense = Number(report.expense ?? 0);

                    const incomeFormatted =
                        (report.incomeEntries as Record<string, unknown>[] | undefined)?.map(
                            (entry: Record<string, unknown>, index: number) => [
                                index + 1,
                                String(entry.studentName ?? ""),
                                String(entry.paymentMode ?? ""),
                                `${String(entry.activityName ?? "")} ${entry.membershipType ? "(" + String(entry.membershipType) + ")" : ""}`,
                                getLocalDateTime(String(entry.paymenDate ?? null)),
                                `₹${String(entry.amount ?? "")}`,
                            ],
                        ) ?? [];

                    const expenseFormatted =
                        (report.expenseEntries as Record<string, unknown>[] | undefined)?.map(
                            (entry: Record<string, unknown>, index: number) => [
                                index + 1,
                                String(entry.description || entry.expenseCategory || ""),
                                String(entry.paymentType ?? ""),
                                String(entry.expenseCategory ?? ""),
                                getLocalDateTime(String(entry.expenseDate ?? null)),
                                `₹${String(entry.amount ?? "")}`,
                            ],
                        ) ?? [];

                    setEiData({
                        income: incomeFormatted,
                        expenses: expenseFormatted,
                        totalIncome,
                        totalExpense,
                    });
                } else {
                    setEiData({
                        income: [],
                        expenses: [],
                        totalIncome: 0,
                        totalExpense: 0,
                    });
                    showAlert(message || "No data available.", "warning");
                }
            } else if (reportType === "payment") {
                const result = await reportsAPi({
                    token,
                    status: paymentStatus,
                    ...commonPayload,
                    type: "payment",
                });
                const { data, success } = result as {
                    data: Record<string, unknown>[];
                    success: boolean;
                    message: string;
                };

                if (success && data.length > 0) {
                    let totalAmount = 0;

                    const formatted = data.map((entry: Record<string, unknown>, index: number) => {
                        totalAmount += Number(entry.amount ?? 0);

                        return [
                            index + 1,
                            String(entry.payeeType ?? ""),
                            String(entry?.payeeName ?? ""),
                            `₹${String(entry.amount ?? "")}`,
                            String(entry.paymentType ?? ""),
                            String(entry.status ?? ""),
                            getLocalDateTime(String(entry.paymentDate ?? null)),
                        ];
                    });
                    if (paymentStatus === "PENDING") {
                        setEiData({
                            pendingPaymentEntries: formatted,
                            totalPendingPayment: totalAmount,
                        });
                    } else {
                        setEiData({
                            completedPaymentEntries: formatted,
                            totalCompletedPayment: totalAmount,
                        });
                    }
                } else {
                    if (paymentStatus === "PENDING") {
                        setEiData({ pendingPaymentEntries: [], totalPendingPayment: 0 });
                    } else {
                        setEiData({ completedPaymentEntries: [], totalCompletedPayment: 0 });
                    }
                }
            }
        } catch (error: unknown) {
            console.error(error);
            showAlert("Failed to fetch report data.", "error");
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (title: string, data: unknown[][], headers: string[]) => (
        <>
            <p style={{ fontSize: 18, marginBottom: 10 }}> {title}</p>
            <div>
                <table
                    style={{
                        ...styles.table,
                        pageBreakInside: "auto",
                        borderCollapse: "collapse",
                        width: "100%",
                    }}
                >
                    <thead style={{ display: "table-header-group" }}>
                        <tr>
                            {headers.map((h, i) => (
                                <th
                                    key={i}
                                    style={{
                                        ...styles.th,
                                        textAlign:
                                            i === 0
                                                ? "center"
                                                : headers.length - 1 === i
                                                  ? "right"
                                                  : "left",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr
                                key={i}
                                style={{
                                    backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff",
                                    pageBreakInside: "avoid",
                                }}
                            >
                                {row.map((cell: unknown, j: number) => (
                                    <td
                                        key={j}
                                        style={{
                                            ...styles.td,
                                            textAlign:
                                                j === 0
                                                    ? "center"
                                                    : j === row.length - 1
                                                      ? "right"
                                                      : "left",
                                        }}
                                    >
                                        {cell as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && <p style={styles.td}>No data available!</p>}{" "}
            </div>
        </>
    );

    const formattedDateRange = () =>
        `${startDateValue ? formatDate(startDateValue, "DD-MM-YYYY") : "N/A"} – ${endDateValue ? formatDate(endDateValue, "DD-MM-YYYY") : "N/A"}`;

    useEffect(() => {}, [paymentStatus, reportType]);

    return (
        <FlexBetween
            gap={2}
            flexDirection={isMobile ? "column" : "row"}
            sx={{ alignItems: "flex-start", width: "100%" }}
        >
            {/* Left Controls */}
            <Box
                p={2}
                sx={{
                    height: "fit-content",
                    width: isMobile ? "100%" : "25rem",
                    flexShrink: 0,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "8px",
                    boxShadow: theme.shadows[7],
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h3"}
                    m={isMobile ? 1 : 2}
                    mb={isMobile ? 3 : 6}
                    textAlign={"center"}
                >
                    Report
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FlexBetween flexDirection="column" gap={2}>
                        <DatePicker
                            format="dd/MM/yyyy"
                            label="Start Date"
                            value={startDateValue}
                            onChange={(newValue) => setStartDate(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                        <DatePicker
                            label="End Date"
                            format="dd/MM/yyyy"
                            value={endDateValue}
                            onChange={(newValue) => setEndDate(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                value={reportType}
                                label="Report Type"
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <MenuItem value="incomeExpense">
                                    Income &amp; Expense Report
                                </MenuItem>
                                <MenuItem value="payment">Payment Report</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={paymentMethod}
                                label="Payment Method"
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="CASH">CASH</MenuItem>
                                <MenuItem value="UPI">UPI</MenuItem>
                            </Select>
                        </FormControl>
                        {reportType === "payment" && (
                            <FormControl fullWidth>
                                <InputLabel>Payment Status</InputLabel>
                                <Select
                                    value={paymentStatus}
                                    label="Payment Status"
                                    onChange={(e) => {
                                        setPaymentStatus(e.target.value);
                                    }}
                                >
                                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Button variant="contained" onClick={getData} fullWidth disabled={loading}>
                            Generate Report
                        </Button>
                        <FlexBetween gap={2} sx={{ width: "100%" }}>
                            <Button
                                variant="outlined"
                                onClick={() => pdfViewerRef.current?.downloadPDF()}
                                fullWidth
                                disabled={!eiData}
                            >
                                Download PDF
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => pdfViewerRef.current?.printPDF()}
                                fullWidth
                                disabled={!eiData}
                            >
                                Print PDF
                            </Button>
                        </FlexBetween>
                    </FlexBetween>
                </LocalizationProvider>
            </Box>

            {/* Report Display */}
            <Box
                sx={{
                    overflow: "auto",
                    minHeight: isMobile ? "50vh" : "89vh",
                    height: isMobile ? "auto" : "89vh",
                    boxShadow: theme.shadows[7],
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "8px",
                    flex: 1,
                    minWidth: 0,
                    p: 1,
                    px: isMobile ? 1 : 4,
                    width: isMobile ? "100%" : "auto",
                }}
            >
                {loading && <Loading />}
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    studio={studio as { logo: string; studioName: string }}
                    fileName="Report.pdf"
                    header={
                        <>
                            <Typography variant="body2">{formattedDateRange()}</Typography>
                            <Typography variant="body2">
                                Generated on: {getLocalDateTime(getCurrentDateTimeLocal())}
                            </Typography>
                        </>
                    }
                    content={
                        <>
                            {eiData?.income &&
                                renderTable("Income", eiData.income, [
                                    "No.",
                                    "Name",
                                    "Payment Mode",
                                    "Activity (Type)",
                                    "Date",
                                    "Amount",
                                ])}

                            {eiData?.expenses &&
                                renderTable("Expenses", eiData.expenses, [
                                    "No.",
                                    "Description",
                                    "Payment Mode",
                                    "Category",
                                    "Date",
                                    "Amount",
                                ])}

                            {eiData?.pendingPaymentEntries &&
                                renderTable("Payment Report", eiData.pendingPaymentEntries, [
                                    "No.",
                                    "PayeeType",
                                    "PayeeName",
                                    "Amount",
                                    "MODE",
                                    "Status",
                                    "Date",
                                ])}

                            {eiData?.completedPaymentEntries &&
                                renderTable("Payment Report", eiData.completedPaymentEntries, [
                                    "No.",
                                    "PayeeType",
                                    "PayeeName",
                                    "Amount",
                                    "MODE",
                                    "Status",
                                    "Date",
                                ])}

                            {/* Summary Section */}
                            {eiData && (
                                <>
                                    <p style={{ fontSize: 18, marginBottom: 10 }}>Summary</p>
                                    <table style={{ width: "100%", fontSize: 16 }}>
                                        <tbody>
                                            {eiData?.totalIncome != null && (
                                                <tr>
                                                    <td style={{ textAlign: "left" }}>
                                                        <strong>Total Income</strong>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        ₹
                                                        {eiData?.totalIncome?.toLocaleString(
                                                            "en-IN",
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                            {eiData?.totalExpense != null && (
                                                <tr>
                                                    <td style={{ textAlign: "left" }}>
                                                        <strong>Total Expense</strong>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        ₹
                                                        {eiData?.totalExpense?.toLocaleString(
                                                            "en-IN",
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                            {eiData?.totalExpense != null &&
                                                eiData?.totalIncome != null && (
                                                    <tr>
                                                        <td style={{ textAlign: "left" }}>
                                                            <strong>Net Balance</strong>
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            ₹
                                                            {(
                                                                Number(eiData?.totalIncome ?? 0) -
                                                                Number(eiData?.totalExpense ?? 0)
                                                            ).toLocaleString("en-IN")}
                                                        </td>
                                                    </tr>
                                                )}
                                            {(eiData?.totalCompletedPayment != null ||
                                                eiData?.totalPendingPayment != null) && (
                                                <tr>
                                                    <td>
                                                        <strong>
                                                            Total{" "}
                                                            {eiData?.totalPendingPayment != null
                                                                ? "pending"
                                                                : "completed"}{" "}
                                                            amount
                                                        </strong>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        ₹
                                                        {eiData?.totalPendingPayment?.toLocaleString(
                                                            "en-IN",
                                                        ) ||
                                                            eiData?.totalCompletedPayment?.toLocaleString(
                                                                "en-IN",
                                                            )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </>
                    }
                />
            </Box>
        </FlexBetween>
    );
};

const styles: Record<string, React.CSSProperties> = {
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "8px",
    },
    th: {
        backgroundColor: "#f1f1f1",
        padding: "10px",
        fontWeight: "bold",
    },
    td: {
        textAlign: "center",
        padding: "2px",
    },
};

export default Reports;
