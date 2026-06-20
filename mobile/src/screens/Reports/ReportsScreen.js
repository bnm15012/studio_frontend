import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import api from '../../utils/api';

const COLORS = {
  primary: '#6366f1',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  secondaryText: '#6b7280',
  danger: '#ef4444',
  success: '#10b981',
  border: '#e5e7eb',
  income: '#10b981',
  expense: '#ef4444',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toDateParts(dateStr) {
  if (!dateStr) return { day: 1, month: 1, year: new Date().getFullYear() };
  const [y, m, d] = dateStr.split('-').map(Number);
  return { day: d, month: m, year: y };
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = dateStr.split('-');
    return `${d} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  } catch { return dateStr; }
}

function toDateString(day, month, year) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Date Picker Modal ────────────────────────────────────────────────────────
function DatePickerModal({ visible, initialDate, onConfirm, onCancel }) {
  const init = toDateParts(initialDate);
  const [day, setDay] = useState(init.day);
  const [month, setMonth] = useState(init.month);
  const [year, setYear] = useState(init.year);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerTitle}>Select Date</Text>
          <View style={styles.datePickerRow}>
            {[
              { label: 'Day', items: days, value: day, set: setDay },
              { label: 'Month', items: months, value: month, set: setMonth, display: (m) => MONTHS[m - 1] },
              { label: 'Year', items: years, value: year, set: setYear },
            ].map(({ label, items, value, set, display }) => (
              <View key={label} style={styles.datePickerCol}>
                <Text style={styles.datePickerLabel}>{label}</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {items.map((v) => (
                    <TouchableOpacity key={v} onPress={() => set(v)} style={[styles.dpItem, value === v && styles.dpItemActive]}>
                      <Text style={[styles.dpItemText, value === v && styles.dpItemTextActive]}>
                        {display ? display(v) : v}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
          </View>
          <View style={styles.dpActions}>
            <TouchableOpacity onPress={onCancel} style={[styles.dpBtn, styles.dpCancelBtn]}>
              <Text style={styles.dpCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(toDateString(day, month, year))} style={[styles.dpBtn, styles.dpConfirmBtn]}>
              <Text style={styles.dpConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, count, total, color }) {
  return (
    <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <View style={styles.sectionMeta}>
        {count != null && <Text style={styles.sectionCount}>{count} entries</Text>}
        {total != null && <Text style={[styles.sectionTotal, { color }]}>{formatCurrency(total)}</Text>}
      </View>
    </View>
  );
}

// ─── Income Entry Card ────────────────────────────────────────────────────────
function IncomeCard({ item }) {
  const displayDate = item.paymenDate ?? item.paymentDate ?? item.date;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardName}>{item.studentName || '—'}</Text>
          <Text style={styles.cardSub}>
            {[item.activityName, item.membershipType ? `(${item.membershipType})` : null].filter(Boolean).join(' ')}
          </Text>
          {item.paymentMode ? <Text style={styles.cardMeta}>Mode: {item.paymentMode}</Text> : null}
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.cardAmount, { color: COLORS.income }]}>{formatCurrency(item.amount)}</Text>
          {displayDate ? <Text style={styles.cardDate}>{formatDisplayDate(displayDate)}</Text> : null}
        </View>
      </View>
    </View>
  );
}

// ─── Expense Entry Card ───────────────────────────────────────────────────────
function ExpenseCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardName}>{item.description || item.expenseCategory || '—'}</Text>
          <Text style={styles.cardSub}>{item.expenseCategory || '—'}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.cardAmount, { color: COLORS.expense }]}>{formatCurrency(item.amount)}</Text>
          {item.expenseDate ? <Text style={styles.cardDate}>{formatDisplayDate(item.expenseDate)}</Text> : null}
        </View>
      </View>
    </View>
  );
}

// ─── Payment Entry Card ───────────────────────────────────────────────────────
function PaymentCard({ item }) {
  const isCompleted = item.status === 'COMPLETED';
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardName}>{item.payeeName || '—'}</Text>
          <Text style={styles.cardSub}>{item.payeeType || '—'}</Text>
          {item.paymentType ? <Text style={styles.cardMeta}>{item.paymentType}</Text> : null}
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.cardAmount, { color: COLORS.primary }]}>{formatCurrency(item.amount)}</Text>
          {item.paymentDate ? <Text style={styles.cardDate}>{formatDisplayDate(item.paymentDate)}</Text> : null}
          <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
            <Text style={[styles.statusText, isCompleted ? styles.statusTextCompleted : styles.statusTextPending]}>
              {item.status || 'PENDING'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────
function SummaryTable({ totalIncome, totalExpense }) {
  const net = (totalIncome || 0) - (totalExpense || 0);
  return (
    <View style={styles.summaryTable}>
      <Text style={styles.summaryTableTitle}>Summary</Text>
      {totalIncome != null && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryRowLabel}>Total Income</Text>
          <Text style={[styles.summaryRowValue, { color: COLORS.income }]}>{formatCurrency(totalIncome)}</Text>
        </View>
      )}
      {totalExpense != null && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryRowLabel}>Total Expense</Text>
          <Text style={[styles.summaryRowValue, { color: COLORS.expense }]}>{formatCurrency(totalExpense)}</Text>
        </View>
      )}
      {totalIncome != null && totalExpense != null && (
        <View style={[styles.summaryRow, styles.summaryRowNet]}>
          <Text style={[styles.summaryRowLabel, { fontWeight: '700' }]}>Net Balance</Text>
          <Text style={[styles.summaryRowValue, { color: net >= 0 ? COLORS.income : COLORS.expense, fontWeight: '700' }]}>
            {formatCurrency(net)}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ReportsScreen() {
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const studio = useSelector((state) => state.auth.studio);
  const branchId = currentBranch?.branchId;
  const studioId = studio?.studioId;

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(
    toDateString(firstOfMonth.getDate(), firstOfMonth.getMonth() + 1, firstOfMonth.getFullYear())
  );
  const [endDate, setEndDate] = useState(
    toDateString(today.getDate(), today.getMonth() + 1, today.getFullYear())
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reportType, setReportType] = useState('general'); // 'general' | 'payment'
  const [paymentStatus, setPaymentStatus] = useState('COMPLETED');
  const [reportData, setReportData] = useState(null); // parsed report structure
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Single fetch function — reads all state directly at call time, no stale closures
  const fetchReports = useCallback(async (
    overrideType,
    overrideStatus,
    overrideStart,
    overrideEnd,
  ) => {
    if (!branchId || !studioId) return;

    const type    = overrideType   ?? reportType;
    const status  = overrideStatus ?? paymentStatus;
    const sDate   = overrideStart  ?? startDate;
    const eDate   = overrideEnd    ?? endDate;

    const [sy, sm, sd] = sDate.split('-').map(Number);
    const [ey, em, ed] = eDate.split('-').map(Number);

    const url = type === 'payment'
      ? `/reports/payments/${studioId}/${branchId}/${sd}/${sm}/${sy}/${ed}/${em}/${ey}?status=${status}`
      : `/reports/${studioId}/${branchId}/${sd}/${sm}/${sy}/${ed}/${em}/${ey}`;

    setLoading(true);
    setReportData(null);
    try {
      const res = await api.get(url);
      const data = res.data?.data ?? [];

      if (type === 'general') {
        const report = data[0]?.ieMonthlyReportEntry;
        if (report) {
          setReportData({
            type: 'general',
            incomeEntries: report.incomeEntries ?? [],
            expenseEntries: report.expenseEntries ?? [],
            totalIncome: report.income ?? report.totalIncome ?? 0,
            totalExpense: report.expense ?? report.totalExpense ?? 0,
          });
        } else {
          setReportData({ type: 'general', incomeEntries: [], expenseEntries: [], totalIncome: 0, totalExpense: 0 });
        }
      } else {
        const totalAmount = data.reduce((s, e) => s + (Number(e.amount) || 0), 0);
        setReportData({ type: 'payment', entries: data, totalAmount, status });
      }
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  }, [branchId, studioId, reportType, paymentStatus, startDate, endDate]);

  // ── PDF Generation ──────────────────────────────────────────────────────────
  const buildPdfHtml = useCallback(() => {
    if (!reportData) return '';
    const studioName = studio?.studioName ?? 'Studio Report';
    const dateRange = `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
    const generatedOn = new Date().toLocaleString('en-IN');

    const tableStyle = 'width:100%;border-collapse:collapse;margin-top:10px;font-size:13px;';
    const thStyle = 'background:#6366f1;color:#fff;padding:8px 10px;text-align:left;';
    const tdStyle = 'padding:7px 10px;border-bottom:1px solid #e5e7eb;';
    const tdRStyle = `${tdStyle}text-align:right;`;
    const evenRow = 'background:#f9fafb;';

    const makeTable = (title, headers, rows, colorAccent) => {
      if (!rows.length) return `<p style="color:#6b7280;font-size:13px;">No ${title.toLowerCase()} entries.</p>`;
      const headerCells = headers.map((h, i) => `<th style="${thStyle}${i > 0 ? 'text-align:right;' : ''}">${h}</th>`).join('');
      const bodyRows = rows.map((r, i) => {
        const cells = r.map((c, j) => `<td style="${j === 0 ? tdStyle : tdRStyle}${i % 2 !== 0 ? evenRow : ''}">${c}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `
        <h3 style="margin:20px 0 6px;color:${colorAccent};font-size:15px;">${title}</h3>
        <table style="${tableStyle}"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
      `;
    };

    let body = '';
    if (reportData.type === 'general') {
      const incomeRows = (reportData.incomeEntries ?? []).map((e, i) => [
        i + 1,
        e.studentName || '—',
        e.paymentMode || '—',
        [e.activityName, e.membershipType ? `(${e.membershipType})` : ''].filter(Boolean).join(' ') || '—',
        formatDisplayDate(e.paymenDate ?? e.paymentDate ?? e.date),
        formatCurrency(e.amount),
      ]);
      const expenseRows = (reportData.expenseEntries ?? []).map((e, i) => [
        i + 1,
        e.description || e.expenseCategory || '—',
        e.expenseCategory || '—',
        formatDisplayDate(e.expenseDate),
        formatCurrency(e.amount),
      ]);
      const net = (reportData.totalIncome || 0) - (reportData.totalExpense || 0);
      body = `
        ${makeTable('Income', ['#', 'Name', 'Payment Mode', 'Activity (Type)', 'Date', 'Amount'], incomeRows, '#10b981')}
        ${makeTable('Expenses', ['#', 'Description', 'Category', 'Date', 'Amount'], expenseRows, '#ef4444')}
        <h3 style="margin:24px 0 8px;font-size:15px;color:#111827;">Summary</h3>
        <table style="${tableStyle}">
          <tr><td style="${tdStyle}"><strong>Total Income</strong></td><td style="${tdRStyle}color:#10b981;">${formatCurrency(reportData.totalIncome)}</td></tr>
          <tr style="${evenRow}"><td style="${tdStyle}"><strong>Total Expense</strong></td><td style="${tdRStyle}color:#ef4444;">${formatCurrency(reportData.totalExpense)}</td></tr>
          <tr><td style="${tdStyle}"><strong>Net Balance</strong></td><td style="${tdRStyle}font-weight:700;color:${net >= 0 ? '#10b981' : '#ef4444'};">${formatCurrency(net)}</td></tr>
        </table>
      `;
    } else if (reportData.type === 'payment') {
      const rows = (reportData.entries ?? []).map((e, i) => [
        i + 1,
        e.payeeType || '—',
        e.payeeName || '—',
        formatCurrency(e.amount),
        e.paymentType || '—',
        e.status || '—',
        formatDisplayDate(e.paymentDate),
      ]);
      body = `
        ${makeTable(`Payment Report — ${reportData.status}`, ['#', 'Payee Type', 'Payee Name', 'Amount', 'Mode', 'Status', 'Date'], rows, '#6366f1')}
        <table style="${tableStyle};margin-top:20px;">
          <tr><td style="${tdStyle}"><strong>Total ${reportData.status} Amount</strong></td><td style="${tdRStyle}font-weight:700;color:#6366f1;">${formatCurrency(reportData.totalAmount)}</td></tr>
        </table>
      `;
    }

    return `
      <!DOCTYPE html><html><head><meta charset="utf-8"/>
      <style>body{font-family:Helvetica,Arial,sans-serif;margin:32px;color:#111827;}
      h1{font-size:22px;margin:0 0 4px;}h2{font-size:13px;color:#6b7280;font-weight:400;margin:0 0 2px;}
      </style></head><body>
      <h1>${studioName}</h1>
      <h2>Period: ${dateRange}</h2>
      <h2>Generated: ${generatedOn}</h2>
      <hr style="border:none;border-top:2px solid #6366f1;margin:16px 0;"/>
      ${body}
      </body></html>
    `;
  }, [reportData, studio, startDate, endDate]);

  const handleDownloadPdf = useCallback(async () => {
    if (!reportData) return;
    setPdfLoading(true);
    try {
      const html = buildPdfHtml();
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Save / Share Report PDF' });
      } else {
        Alert.alert('Saved', `PDF saved to:\n${uri}`);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }, [reportData, buildPdfHtml]);

  // Build a flat list of sections for FlatList
  const sections = useMemo(() => {
    if (!reportData) return [];
    if (reportData.type === 'general') {
      const items = [];
      items.push({ _type: 'incomeHeader', count: reportData.incomeEntries.length, total: reportData.totalIncome });
      reportData.incomeEntries.forEach((e, i) => items.push({ _type: 'income', ...e, _key: `inc_${i}` }));
      items.push({ _type: 'expenseHeader', count: reportData.expenseEntries.length, total: reportData.totalExpense });
      reportData.expenseEntries.forEach((e, i) => items.push({ _type: 'expense', ...e, _key: `exp_${i}` }));
      items.push({ _type: 'summary', totalIncome: reportData.totalIncome, totalExpense: reportData.totalExpense });
      return items;
    }
    if (reportData.type === 'payment') {
      const items = [];
      items.push({ _type: 'paymentHeader', count: reportData.entries.length, total: reportData.totalAmount, status: reportData.status });
      reportData.entries.forEach((e, i) => items.push({ _type: 'payment', ...e, _key: `pay_${i}` }));
      if (reportData.entries.length > 0) {
        items.push({ _type: 'paymentSummary', total: reportData.totalAmount, status: reportData.status });
      }
      return items;
    }
    return [];
  }, [reportData]);

  const renderItem = ({ item }) => {
    switch (item._type) {
      case 'incomeHeader':
        return <SectionHeader title="Income" count={item.count} total={item.total} color={COLORS.income} />;
      case 'expenseHeader':
        return <SectionHeader title="Expenses" count={item.count} total={item.total} color={COLORS.expense} />;
      case 'paymentHeader':
        return <SectionHeader title={`Payment Report — ${item.status}`} count={item.count} total={item.total} color={COLORS.primary} />;
      case 'income':
        return <IncomeCard item={item} />;
      case 'expense':
        return <ExpenseCard item={item} />;
      case 'payment':
        return <PaymentCard item={item} />;
      case 'summary':
        return <SummaryTable totalIncome={item.totalIncome} totalExpense={item.totalExpense} />;
      case 'paymentSummary':
        return (
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryRowLabel, { fontWeight: '700' }]}>Total {item.status} Amount</Text>
              <Text style={[styles.summaryRowValue, { color: COLORS.primary, fontWeight: '700' }]}>{formatCurrency(item.total)}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Reports</Text>
        {reportData && (
          <TouchableOpacity
            style={[styles.pdfBtn, pdfLoading && styles.pdfBtnDisabled]}
            onPress={handleDownloadPdf}
            disabled={pdfLoading}
          >
            {pdfLoading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="download-outline" size={16} color="#fff" />}
            <Text style={styles.pdfBtnText}>{pdfLoading ? 'Generating…' : 'Download PDF'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Report Type Toggle */}
      <View style={styles.reportTypeRow}>
        {[
          { key: 'general', label: 'Income & Expense', icon: 'bar-chart-outline' },
          { key: 'payment', label: 'Payments', icon: 'card-outline' },
        ].map(({ key, label, icon }) => (
          <TouchableOpacity
            key={key}
            style={[styles.reportTypeBtn, reportType === key && styles.reportTypeBtnActive]}
            onPress={() => { setReportType(key); setReportData(null); /* don't auto-fetch on type change; user must press search */ }}
          >
            <Ionicons name={icon} size={14} color={reportType === key ? '#fff' : COLORS.secondaryText} />
            <Text style={[styles.reportTypeBtnText, reportType === key && styles.reportTypeBtnTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Range */}
      <View style={styles.dateRangeRow}>
        <View style={styles.dateRangeCol}>
          <Text style={styles.dateRangeLabel}>From</Text>
          <TouchableOpacity style={styles.dateRangeBtn} onPress={() => setShowStartPicker(true)}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.primary} />
            <Text style={styles.dateRangeBtnText}>{formatDisplayDate(startDate)}</Text>
          </TouchableOpacity>
        </View>
        <Ionicons name="arrow-forward" size={16} color={COLORS.secondaryText} style={{ marginTop: 18 }} />
        <View style={styles.dateRangeCol}>
          <Text style={styles.dateRangeLabel}>To</Text>
          <TouchableOpacity style={styles.dateRangeBtn} onPress={() => setShowEndPicker(true)}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.primary} />
            <Text style={styles.dateRangeBtnText}>{formatDisplayDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => fetchReports(reportType, paymentStatus, startDate, endDate)}>
          <Ionicons name="search" size={17} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Payment status selector (only for payment type) */}
      {reportType === 'payment' && (
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          {['COMPLETED', 'PENDING'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusChip, paymentStatus === s && styles.statusChipActive]}
              onPress={() => { setPaymentStatus(s); fetchReports('payment', s, startDate, endDate); }}
            >
              <Text style={[styles.statusChipText, paymentStatus === s && styles.statusChipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : !reportData ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color={COLORS.secondaryText} />
          <Text style={styles.emptyText}>Select a date range and tap search to generate a report.</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color={COLORS.secondaryText} />
          <Text style={styles.emptyText}>No data found for the selected range.</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item, idx) => item._key ?? item._type + idx}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <DatePickerModal
        visible={showStartPicker}
        initialDate={startDate}
        onConfirm={(d) => { setStartDate(d); setShowStartPicker(false); }}
        onCancel={() => setShowStartPicker(false)}
      />
      <DatePickerModal
        visible={showEndPicker}
        initialDate={endDate}
        onConfirm={(d) => { setEndDate(d); setShowEndPicker(false); }}
        onCancel={() => setShowEndPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  screenTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  pdfBtnDisabled: { opacity: 0.6 },
  pdfBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  reportTypeRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reportTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  reportTypeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  reportTypeBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.secondaryText },
  reportTypeBtnTextActive: { color: '#fff' },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  dateRangeCol: { flex: 1 },
  dateRangeLabel: { fontSize: 11, color: COLORS.secondaryText, marginBottom: 4, fontWeight: '500' },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateRangeBtnText: { fontSize: 12, color: COLORS.text, flex: 1 },
  searchBtn: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 8, marginBottom: 1 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusLabel: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '600' },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  statusChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  statusChipText: { fontSize: 13, fontWeight: '600', color: COLORS.secondaryText },
  statusChipTextActive: { color: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12, paddingHorizontal: 32 },
  emptyText: { fontSize: 14, color: COLORS.secondaryText, textAlign: 'center', lineHeight: 21 },
  listContent: { padding: 16, paddingBottom: 32 },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
    marginTop: 4,
    borderLeftWidth: 4,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionMeta: { alignItems: 'flex-end' },
  sectionCount: { fontSize: 11, color: COLORS.secondaryText },
  sectionTotal: { fontSize: 14, fontWeight: '700' },
  // Cards
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 13,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1, marginRight: 10 },
  cardRight: { alignItems: 'flex-end' },
  cardName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  cardSub: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  cardMeta: { fontSize: 11, color: COLORS.secondaryText, marginTop: 2 },
  cardAmount: { fontSize: 14, fontWeight: '700' },
  cardDate: { fontSize: 11, color: COLORS.secondaryText, marginTop: 2 },
  // Status badge
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  statusCompleted: { backgroundColor: '#d1fae5' },
  statusPending: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusTextCompleted: { color: '#065f46' },
  statusTextPending: { color: '#92400e' },
  // Summary table
  summaryTable: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryTableTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryRowNet: { borderBottomWidth: 0, marginTop: 4 },
  summaryRowLabel: { fontSize: 13, color: COLORS.text },
  summaryRowValue: { fontSize: 13, fontWeight: '600' },
  // Date Picker Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  datePickerContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  datePickerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 16 },
  datePickerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  datePickerCol: { flex: 1, alignItems: 'center' },
  datePickerLabel: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '600', marginBottom: 6 },
  datePickerScroll: { height: 160, width: '100%' },
  dpItem: { paddingVertical: 8, alignItems: 'center', borderRadius: 8, marginBottom: 2 },
  dpItemActive: { backgroundColor: COLORS.primary },
  dpItemText: { fontSize: 15, color: COLORS.text },
  dpItemTextActive: { color: '#fff', fontWeight: '700' },
  dpActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  dpBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  dpCancelBtn: { backgroundColor: '#f3f4f6' },
  dpConfirmBtn: { backgroundColor: COLORS.primary },
  dpCancelText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  dpConfirmText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
