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
  getCurrentDateTimeUTC,
  getLocalDateTime
} from '../../../utils/DateUtil';
import { useAlert } from '../../../utils/Alert';
import Loading from '../../../Components/Loading/Loading';
import { reportsAPi } from './reports.api';

const Reports = () => {
  const reportRef = useRef();
  const theme = useTheme();
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const studio = useSelector((state) => state.auth.studio);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [eiData, setEiData] = useState(null);
  const [reportType, setReportType] = useState("incomeExpense");
  const [paymentStatus, setPaymentStatus] = useState("COMPLETED");

  const getData = async () => {
    setLoading(true);
    try {

      if (reportType === "incomeExpense") {
        const { data, success, message } = await reportsAPi({
          token,
          endMonth: endDate.getMonth() + 1,
          endYear: endDate.getFullYear(),
          startMonth: startDate.getMonth() + 1,
          startYear: startDate.getFullYear(),
          studioId: studio.studioId,
          branchId: currentBranch.branchId,
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
            `₹${entry.amount}`
          ]);

          const expenseFormatted = report.expenseEntries.map((entry, index) => [
            index + 1,
            entry.description || entry.expenseCategory,
            entry.expenseCategory,
            getLocalDateTime(entry.expenseDate),
            `₹${entry.amount}`
          ]);

          setEiData({
            income: incomeFormatted,
            expenses: expenseFormatted,
            totalIncome,
            totalExpense
          });
        } else {
          setEiData({
            income: [],
            expenses: [],
            totalIncome: 0,
            totalExpense: 0
          });
          showAlert(message || "No data available.", "warning");
        }
      } else if (reportType === "payment") {
        const { data, success } = await reportsAPi({
          token,
          status: paymentStatus,
          endMonth: endDate.getMonth() + 1,
          endYear: endDate.getFullYear(),
          startMonth: startDate.getMonth() + 1,
          startYear: startDate.getFullYear(),
          studioId: studio.studioId,
          branchId: currentBranch.branchId,
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

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      window.html2pdf()
        .set({
          filename: reportType === "incomeExpense" ? 'IncomeExpenseReport.pdf' : "paymentreport.pdf",
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 4, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(reportRef.current)
        .save();
    }
  };

  const handlePrintPDF = () => {
    const element = reportRef.current;

    window.html2pdf()
      .set({
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 4, useCORS: true, allowTaint: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);

        const printWindow = window.open(blobUrl, '_blank');
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
      });
  };

  const renderTable = (title, data, headers) => (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ ...styles.th, textAlign: headers.length - 1 === i ? 'right' : 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ ...styles.td, textAlign: j === row.length - 1 ? 'right' : 'left' }}>{cell}</td>
              ))}
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={headers.length} style={styles.td}>No data available!</td></tr>}
        </tbody>
      </table>
    </Box>
  );

  const formattedDateRange = () => {
    const fmt = (d) => `${d.toLocaleString('default', { month: 'short' })}-${d.getFullYear()}`;
    return `${startDate ? fmt(startDate) : 'N/A'} – ${endDate ? fmt(endDate) : 'N/A'}`;
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
              views={['year', 'month']}
              label="Start Month"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DatePicker
              views={['year', 'month']}
              label="End Month"
              value={endDate}
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
                onClick={handleDownloadPDF}
                fullWidth
                disabled={!eiData}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                onClick={handlePrintPDF}
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
        <div ref={reportRef} style={styles.invoiceContainer}>
          {/* Header */}
          <FlexBetween>
            <FlexBetween gap={2} width={"50%"}>
              {studio?.logo && (
                <img
                  src={studio.logo}
                  alt="Studio Logo"
                  style={{ width: 60, height: 60 }}
                  crossOrigin="anonymous"
                />
              )}
              <Typography variant="h5" sx={{ textWrap: "wrap" }}>{studio?.studioName}</Typography>
              <Box flexGrow={1}></Box>
            </FlexBetween>
            <Box textAlign="right">
              <Typography variant="h6">{eiData?.income && eiData?.expenses ? <>INCOME & EXPENSE </> : <>PAYMENT</>} REPORT</Typography>
              <Typography variant="body2">{formattedDateRange()}</Typography>
              <Typography variant="body2">
                Generated on: {getLocalDateTime(getCurrentDateTimeUTC())}
              </Typography>
            </Box>
          </FlexBetween>

          <Divider sx={{ my: 2 }} />

          {eiData?.income && renderTable("Income", eiData.income, [
            "No.", "Name", "Payment Mode", "Activity (Type)", "Amount"
          ])}

          {eiData?.expenses && renderTable("Expenses", eiData.expenses, [
            "No.", "Description", "Category", "Date", "Amount"
          ])}

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
      </Box>
    </FlexBetween>
  );
};

const styles = {
  invoiceContainer: {
    width: '210mm',
    minHeight: '297mm',
    margin: 'auto',
    padding: '24px',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#333',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxSizing: 'border-box'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px'
  },
  th: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
    fontWeight: 'bold'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee'
  }
};

export default Reports;
