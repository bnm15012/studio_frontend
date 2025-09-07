import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  useTheme
} from '@mui/material';

import { useEffect, useRef, useState } from 'react';
import FlexBetween from '../../../Components/FlexBetween';
import {
  DatePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSelector } from 'react-redux';
import {
  formatDate,
  getCurrentDateTimeUTC,
  getLocalDateTime
} from '../../../utils/DateUtil';
import { useAlert } from '../../../utils/Alert';
import Loading from '../../../Components/Loading/Loading';
import { reportsAPi } from './reports.api';
import HtmlToPdfViewer from '../../../Components/Html2PDF';

const Reports = () => {
  const pdfViewerRef = useRef();
  const theme = useTheme();
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const studio = useSelector((state) => state.auth.studio);

  const today = new Date();

  const [startDateValue, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [endDateValue, setEndDate] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  const [loading, setLoading] = useState(false);
  const [eiData, setEiData] = useState(null);
  const [reportType, setReportType] = useState("incomeExpense");
  const [paymentStatus, setPaymentStatus] = useState("COMPLETED");

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
      studioId: studio.studioId,
      branchId: currentBranch.branchId,
    }
    try {
      if (reportType === "incomeExpense") {
        const { data, success, message } = await reportsAPi({
          token,
          ...commonPayload,
        });

        if (success && data.length > 0) {
          const report = data[0].ieMonthlyReportEntry;
          const totalIncome = report.income;
          const totalExpense = report.expense;

          const incomeFormatted = report.incomeEntries.map((entry, index) => [
            index + 1,
            entry.studentName,
            entry.paymentMode,
            `${entry.activityName} (${entry.membershipType})`,
            getLocalDateTime(entry.paymenDate),
            `₹${entry.amount}`
          ]);

          const expenseFormatted = report.expenseEntries.map((entry, index) => [
            index + 1,
            entry.description || entry.expenseCategory,
            entry.expenseCategory,
            getLocalDateTime(entry.expenseDate),
            `₹${entry.amount}`
          ]);

          // const bookingFormatted = report.bookingEntries.map((entry, index) => [
          //   index + 1,
          //   entry.purpose,
          //   entry.notes,
          //   entry.paymentMode,
          //   getLocalDateTime(entry.finalPaymentDate),
          //   `₹${entry.totalAmount}`
          // ]);

          setEiData({
            income: incomeFormatted,
            expenses: expenseFormatted,
            // bookings: bookingFormatted,
            totalIncome,
            totalExpense
          });
        } else {
          setEiData({
            income: [],
            expenses: [],
            // bookings: [],
            totalIncome: 0,
            totalExpense: 0
          });
          showAlert(message || "No data available.", "warning");
        }
      } else if (reportType === "payment") {
        const { data, success } = await reportsAPi({
          token,
          status: paymentStatus,
          ...commonPayload,
          type: "payment"
        });

        if (success && data.length > 0) {
          let totalAmount = 0;

          const formatted = data.map((entry, index) => {
            totalAmount += entry.amount;

            return [
              index + 1,
              entry.payeeType,
              entry.clientEntry?.groupName || entry.studentEntry?.name,
              `₹${entry.amount}`,
              entry.paymentType,
              entry.status,
              getLocalDateTime(entry.paymentDate),
            ];
          });
          paymentStatus === "PENDING" ?
            setEiData({ pendingPaymentEntries: formatted, totalPendingPayment: totalAmount }) :
            setEiData({ completedPaymentEntries: formatted, totalCompletedPayment: totalAmount });
        } else {
          paymentStatus === "PENDING" ?
            setEiData({ pendingPaymentEntries: [], totalPendingPayment: 0 }) :
            setEiData({ completedPaymentEntries: [], totalCompletedPayment: 0 });
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("Failed to fetch report data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title, data, headers) => (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
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
                  textAlign: headers.length - 1 === i ? "right" : "left",
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
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    ...styles.td,
                    textAlign: j === row.length - 1 ? "right" : "left",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={headers.length} style={styles.td}>
                No data available!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  );

  const formattedDateRange = () => {
    return `${startDateValue ? formatDate(startDateValue, "DD-MM-YYYY") : 'N/A'} – ${endDateValue ? formatDate(endDateValue, "DD-MM-YYYY") : 'N/A'}`;
  };

  useEffect(() => {

  }, [paymentStatus, reportType])

  return (
    <FlexBetween flexWrap="wrap" gap={2}>
      {/* Left Controls */}
      <Box
        p={2}
        sx={{
          minWidth: '30rem',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '8px',
          boxShadow: theme.shadows[7],
        }}
      >
        <Typography variant='h3' m={2} mb={6} textAlign={"center"}>
          Report
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <FlexBetween flexDirection="column" gap={2}>
            <DatePicker
              format='dd/MM/yyyy'
              label="Start Date"
              value={startDateValue}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DatePicker
              label="End Date"
              format='dd/MM/yyyy'
              value={endDateValue}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />

            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="incomeExpense">Income & Expense Report</MenuItem>
                <MenuItem value="payment">Payment Report</MenuItem>
              </Select>
            </FormControl>

            {reportType === "payment" && (
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentStatus}
                  label="Payment Status"
                  onChange={(e) => { setPaymentStatus(e.target.value); }}
                >
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button variant="contained" onClick={getData} fullWidth disabled={loading}>
              Generate Report
            </Button>
            <FlexBetween gap={2}>
              <Button
                variant="outlined"
                onClick={() => pdfViewerRef.current.downloadPDF()}
                fullWidth
                disabled={!eiData}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                onClick={() => pdfViewerRef.current.printPDF()}
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
        flexGrow={1}
        height="85vh"
        sx={{
          backgroundColor: theme.palette.background.paper,
          overflowY: 'auto',
          padding: 2,
          borderRadius: '8px',
          boxShadow: theme.shadows[7],
        }}
      >
        {loading && <Loading />}
        <HtmlToPdfViewer ref={pdfViewerRef} fileName="Report.pdf"
          header={
            <>
              {/* <Typography variant="h6">{eiData?.income && eiData?.expenses ? <>INCOME & EXPENSE </> : <>PAYMENT</>} REPORT</Typography> */}
              <Typography variant="body2">{formattedDateRange()}</Typography>
              <Typography variant="body2">
                Generated on: {getLocalDateTime(getCurrentDateTimeUTC())}
              </Typography>
            </>
          }
          content={
            <div>
              {eiData?.income && renderTable("Income", eiData.income, [
                "No.", "Name", "Payment Mode", "Activity (Type)", "Date", "Amount"
              ])}

              {eiData?.expenses && renderTable("Expenses", eiData.expenses, [
                "No.", "Description", "Category", "Date", "Amount"
              ])}

              {/* {eiData?.bookings && renderTable("Expenses", eiData.bookings,
                ["No.", "Purpose", "Note", "Payment Mode", "Final Payment Date", "Total Amount"]
              )} */}

              {eiData?.pendingPaymentEntries && renderTable("Payment Report", eiData.pendingPaymentEntries, [
                "No.", "PayeeType", "PayeeName", "Amount", "MODE", "Status", "Date"
              ])}

              {eiData?.completedPaymentEntries && renderTable("Payment Report", eiData.completedPaymentEntries, [
                "No.", "PayeeType", "PayeeName", "Amount", "MODE", "Status", "Date"
              ])}


              {/* Summary Section */}
              {eiData && (
                <>
                  <Box mt={4}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Summary</Typography>
                    <table style={{ width: '100%', fontSize: 16 }}>
                      <tbody>
                        {eiData?.totalIncome != null &&
                          <tr>
                            <td><strong>Total Income</strong></td>
                            <td style={{ textAlign: 'right' }}>₹{eiData?.totalIncome?.toLocaleString("en-IN")}</td>
                          </tr>}
                        {eiData?.totalExpense != null &&
                          <tr>
                            <td><strong>Total Expense</strong></td>
                            <td style={{ textAlign: 'right' }}>₹{eiData?.totalExpense?.toLocaleString("en-IN")}</td>
                          </tr>}
                        {eiData?.totalExpense != null && eiData?.totalIncome != null &&
                          <tr>
                            <td><strong>Net Balance</strong></td>
                            <td style={{ textAlign: 'right' }}>
                              ₹{(eiData?.totalIncome - eiData?.totalExpense)?.toLocaleString("en-IN")}
                            </td>
                          </tr>}
                        {(eiData?.totalCompletedPayment != null || eiData?.totalPendingPayment != null) &&
                          <tr>
                            <td><strong>Total {eiData?.totalPendingPayment != null ? "pending" : "completd"} amount</strong></td>
                            <td style={{ textAlign: 'right' }}>₹{eiData?.totalPendingPayment?.toLocaleString("en-IN") || eiData?.totalCompletedPayment?.toLocaleString("en-IN")}</td>
                          </tr>}
                      </tbody>
                    </table>
                  </Box>
                </>
              )}
            </div>
          }
        />
      </Box>
    </FlexBetween>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px'
  },
  th: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  td: {
    padding: '10px',
  }
};

export default Reports;
