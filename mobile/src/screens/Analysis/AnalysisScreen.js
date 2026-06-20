import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
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
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getMonthName(monthVal) {
  if (typeof monthVal === 'number') return MONTH_NAMES[monthVal - 1] ?? `Month ${monthVal}`;
  if (typeof monthVal === 'string') {
    const upper = monthVal.toUpperCase();
    const idx = MONTH_SHORT.findIndex((m) => m.toUpperCase() === upper.slice(0, 3));
    return idx >= 0 ? MONTH_NAMES[idx] : monthVal;
  }
  return String(monthVal);
}

function YearPickerModal({ visible, currentYear, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(currentYear);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 4 + i);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.yearPickerContainer}>
          <Text style={styles.yearPickerTitle}>Select Year</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.yearScroll}>
            {years.map((y) => (
              <TouchableOpacity
                key={y}
                onPress={() => setSelected(y)}
                style={[styles.yearItem, selected === y && styles.yearItemActive]}
              >
                <Text style={[styles.yearItemText, selected === y && styles.yearItemTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.yearActions}>
            <TouchableOpacity onPress={onCancel} style={[styles.yearBtn, styles.yearCancelBtn]}>
              <Text style={styles.yearCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(selected)} style={[styles.yearBtn, styles.yearConfirmBtn]}>
              <Text style={styles.yearConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SummaryCard({ label, value, color, icon }) {
  return (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <View style={[styles.summaryIconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.summaryTextWrap}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function AnalysisScreen() {
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const branchId = currentBranch?.branchId;

  const [year, setYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalysis = useCallback(async (isRefresh = false) => {
    if (!branchId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await api.get(`/analysis/${year}/${branchId}`);
      const data = res.data?.data ?? [];
      setMonthlyData(data);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load analysis data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [year, branchId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // Compute totals
  const totalRevenue = monthlyData.reduce((sum, m) => {
    const rev = Number(m.revenue) || 0;
    return sum + rev;
  }, 0);

  const totalExpenses = monthlyData.reduce((sum, m) => {
    // expenseEntries can be array or number
    if (Array.isArray(m.expenseEntries)) {
      return sum + m.expenseEntries.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    }
    return sum + (Number(m.expenseEntries) || 0);
  }, 0);

  const netProfit = totalRevenue - totalExpenses;

  // Aggregate expense categories across all months
  const expenseCategoryTotals = React.useMemo(() => {
    const map = {};
    monthlyData.forEach((m) => {
      if (Array.isArray(m.expenseEntries)) {
        m.expenseEntries.forEach((e) => {
          const cat = e.expenseCategory || 'Other';
          map[cat] = (map[cat] || 0) + (Number(e.amount) || 0);
        });
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthlyData]);

  // Aggregate payment entries by payee type across all months
  const paymentByPayeeType = React.useMemo(() => {
    const map = {};
    monthlyData.forEach((m) => {
      if (Array.isArray(m.paymentEntries)) {
        m.paymentEntries.forEach((p) => {
          const type = p.payeeType || 'Other';
          map[type] = (map[type] || 0) + (Number(p.amount) || 0);
        });
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthlyData]);

  const getExpenseTotal = (expenseEntries) => {
    if (Array.isArray(expenseEntries)) {
      return expenseEntries.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    }
    return Number(expenseEntries) || 0;
  };

  const renderMonthRow = ({ item, index }) => {
    const revenue = Number(item.revenue) || 0;
    const expenses = getExpenseTotal(item.expenseEntries);
    const net = revenue - expenses;
    const isPositive = net >= 0;

    return (
      <View style={[styles.monthRow, index % 2 === 0 ? styles.monthRowEven : styles.monthRowOdd]}>
        <Text style={styles.monthName}>{getMonthName(item.month)}</Text>
        <Text style={styles.monthRevenue}>{formatCurrency(revenue)}</Text>
        <Text style={styles.monthExpense}>{formatCurrency(expenses)}</Text>
        <Text style={[styles.monthNet, isPositive ? styles.netPositive : styles.netNegative]}>
          {isPositive ? '+' : ''}{formatCurrency(net)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Analysis</Text>
        <TouchableOpacity style={styles.yearSelector} onPress={() => setShowYearPicker(true)}>
          <Text style={styles.yearSelectorText}>{year}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={monthlyData}
          keyExtractor={(item, idx) => String(item.month ?? idx)}
          renderItem={renderMonthRow}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAnalysis(true)} tintColor={COLORS.primary} />
          }
          ListHeaderComponent={
            <>
              {/* Summary Cards */}
              <View style={styles.summarySection}>
                <SummaryCard
                  label="Annual Revenue"
                  value={formatCurrency(totalRevenue)}
                  color={COLORS.primary}
                  icon="trending-up-outline"
                />
                <SummaryCard
                  label="Total Expenses"
                  value={formatCurrency(totalExpenses)}
                  color={COLORS.danger}
                  icon="trending-down-outline"
                />
                <SummaryCard
                  label="Net Profit"
                  value={formatCurrency(netProfit)}
                  color={netProfit >= 0 ? COLORS.success : COLORS.danger}
                  icon="wallet-outline"
                />
              </View>

              {/* Table Header */}
              {monthlyData.length > 0 && (
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.monthCol]}>Month</Text>
                  <Text style={[styles.tableHeaderCell, styles.numCol]}>Revenue</Text>
                  <Text style={[styles.tableHeaderCell, styles.numCol]}>Expenses</Text>
                  <Text style={[styles.tableHeaderCell, styles.numCol]}>Net</Text>
                </View>
              )}
            </>
          }
          ListFooterComponent={
            monthlyData.length > 0 ? (
              <View style={styles.breakdownSection}>
                {/* Expense by Category */}
                {expenseCategoryTotals.length > 0 && (
                  <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Expenses by Category</Text>
                    {expenseCategoryTotals.map(([cat, amount]) => (
                      <View key={cat} style={styles.breakdownRow}>
                        <View style={styles.breakdownDot} />
                        <Text style={styles.breakdownLabel}>{cat}</Text>
                        <Text style={[styles.breakdownAmount, { color: COLORS.danger }]}>{formatCurrency(amount)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Payment by Payee Type */}
                {paymentByPayeeType.length > 0 && (
                  <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Income by Payee Type</Text>
                    {paymentByPayeeType.map(([type, amount]) => (
                      <View key={type} style={styles.breakdownRow}>
                        <View style={[styles.breakdownDot, { backgroundColor: COLORS.primary }]} />
                        <Text style={styles.breakdownLabel}>{type}</Text>
                        <Text style={[styles.breakdownAmount, { color: COLORS.primary }]}>{formatCurrency(amount)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyState}>
                <Ionicons name="bar-chart-outline" size={48} color={COLORS.secondaryText} />
                <Text style={styles.emptyText}>No analysis data for {year}.</Text>
              </View>
            )
          }
          contentContainerStyle={monthlyData.length === 0 ? styles.emptyContainer : undefined}
        />
      )}

      <YearPickerModal
        visible={showYearPicker}
        currentYear={year}
        onConfirm={(y) => { setYear(y); setShowYearPicker(false); }}
        onCancel={() => setShowYearPicker(false)}
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
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  yearSelectorText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summarySection: { padding: 16, gap: 12 },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTextWrap: { flex: 1 },
  summaryLabel: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '500' },
  summaryValue: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeaderCell: { fontSize: 12, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' },
  monthCol: { flex: 1.4 },
  numCol: { flex: 1, textAlign: 'right' },
  monthRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  monthRowEven: { backgroundColor: COLORS.card },
  monthRowOdd: { backgroundColor: '#f9fafb' },
  monthName: { flex: 1.4, fontSize: 14, color: COLORS.text, fontWeight: '500' },
  monthRevenue: { flex: 1, fontSize: 13, color: COLORS.text, textAlign: 'right' },
  monthExpense: { flex: 1, fontSize: 13, color: COLORS.danger, textAlign: 'right' },
  monthNet: { flex: 1, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  netPositive: { color: COLORS.success },
  netNegative: { color: COLORS.danger },
  emptyContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.secondaryText, textAlign: 'center' },
  // Year Picker Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  yearPickerContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  yearPickerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 16 },
  yearScroll: { maxHeight: 240 },
  yearItem: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 4,
  },
  yearItemActive: { backgroundColor: COLORS.primary },
  yearItemText: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  yearItemTextActive: { color: '#fff', fontWeight: '700' },
  yearActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  yearBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  yearCancelBtn: { backgroundColor: '#f3f4f6' },
  yearConfirmBtn: { backgroundColor: COLORS.primary },
  yearCancelText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  yearConfirmText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  // Breakdown sections
  breakdownSection: { padding: 16, gap: 16 },
  breakdownCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  breakdownDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, marginRight: 10 },
  breakdownLabel: { flex: 1, fontSize: 13, color: COLORS.text },
  breakdownAmount: { fontSize: 13, fontWeight: '700' },
});
