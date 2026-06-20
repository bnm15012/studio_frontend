import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../utils/api';
import { ENDPOINTS } from '../../constants/api';
import { setCurrentBranch } from '../../state/authSlice';

const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#eef2ff',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  secondaryText: '#6b7280',
  success: '#10b981',
  successLight: '#ecfdf5',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  border: '#e5e7eb',
  amber: '#f59e0b',
  amberLight: '#fffbeb',
  sky: '#0ea5e9',
  skyLight: '#f0f9ff',
  violet: '#8b5cf6',
  violetLight: '#f5f3ff',
  rose: '#f43f5e',
  roseLight: '#fff1f2',
  teal: '#14b8a6',
  tealLight: '#f0fdfa',
};

function formatCurrency(value) {
  if (value == null || isNaN(Number(value))) return '—';
  const num = Number(value);
  if (num >= 1_00_000) {
    return '₹' + (num / 1_00_000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return '₹' + (num / 1000).toFixed(1) + 'K';
  }
  return '₹' + num.toFixed(0);
}

function formatNumber(value) {
  if (value == null || isNaN(Number(value))) return '—';
  return String(Number(value));
}

// Individual stat card
function StatCard({ icon, iconColor, iconBg, title, value, subtitle, subtitleColor, onPress }) {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={[styles.statIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statTitle} numberOfLines={2}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.statSubtitle, subtitleColor && { color: subtitleColor }]}>
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

// Revenue comparison card (full width)
function RevenueCard({ thisMonth, lastMonth }) {
  const diff =
    thisMonth != null && lastMonth != null && lastMonth !== 0
      ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)
      : null;
  const isPositive = diff !== null && parseFloat(diff) >= 0;

  return (
    <View style={styles.revenueCard}>
      <View style={styles.revenueCardHeader}>
        <Ionicons name="stats-chart-outline" size={18} color={COLORS.primary} />
        <Text style={styles.revenueCardTitle}>Revenue Overview</Text>
        {diff !== null && (
          <View
            style={[
              styles.revenueBadge,
              { backgroundColor: isPositive ? COLORS.successLight : COLORS.dangerLight },
            ]}
          >
            <Ionicons
              name={isPositive ? 'trending-up-outline' : 'trending-down-outline'}
              size={14}
              color={isPositive ? COLORS.success : COLORS.danger}
            />
            <Text
              style={[
                styles.revenueBadgeText,
                { color: isPositive ? COLORS.success : COLORS.danger },
              ]}
            >
              {isPositive ? '+' : ''}
              {diff}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.revenueRow}>
        <View style={styles.revenueItem}>
          <Text style={styles.revenueLabel}>This Month</Text>
          <Text style={[styles.revenueAmount, { color: COLORS.primary }]}>
            {formatCurrency(thisMonth)}
          </Text>
        </View>
        <View style={styles.revenueDivider} />
        <View style={styles.revenueItem}>
          <Text style={styles.revenueLabel}>Last Month</Text>
          <Text style={[styles.revenueAmount, { color: COLORS.secondaryText }]}>
            {formatCurrency(lastMonth)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Branch picker modal
function BranchPickerModal({ visible, branches, currentBranch, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Branch</Text>
          <FlatList
            data={branches}
            keyExtractor={(item) => String(item.branchId ?? item.id ?? item.name ?? item.branchName)}
            renderItem={({ item }) => {
              const isSelected =
                currentBranch?.branchId === item.branchId ||
                (currentBranch?.name ?? currentBranch?.branchName) === (item.name ?? item.branchName);
              return (
                <TouchableOpacity
                  style={[styles.branchItem, isSelected && styles.branchItemSelected]}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="business-outline"
                    size={16}
                    color={isSelected ? COLORS.primary : COLORS.secondaryText}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.branchItemText,
                      isSelected && styles.branchItemTextSelected,
                    ]}
                  >
                    {item.name ?? item.branchName}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.branchSeparator} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const studio = useSelector((state) => state.auth?.studio);
  const currentBranch = useSelector((state) => state.auth?.currentBranch);
  const branches = useSelector((state) => state.auth?.branches ?? []);

  const [dashboardData, setDashboardData] = useState(null);
  const [activityCount, setActivityCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [branchModalVisible, setBranchModalVisible] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-based
  const currentYear = now.getFullYear();

  const fetchDashboard = useCallback(
    async (silent = false) => {
      if (!currentBranch?.branchId) {
        setLoading(false);
        return;
      }
      if (!silent) setLoading(true);
      setError(null);
      try {
        const [dashRes, actRes] = await Promise.all([
          api.get(
            `${ENDPOINTS.DASHBOARD}/${currentBranch.branchId}?currentMonth=${currentMonth}&currentYear=${currentYear}`
          ),
          api.get(`/activities/getAll/${currentBranch.branchId}`, {
            params: { page: 1, limit: 1 },
          }),
        ]);
        const dataArr = dashRes?.data?.data;
        if (dataArr && dataArr.length > 0) {
          setDashboardData(dataArr[0]);
        } else {
          setDashboardData(null);
        }
        // totalCount from status, or fallback to data array length
        const count = actRes?.data?.status?.totalCount ?? actRes?.data?.data?.length ?? null;
        setActivityCount(count);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Failed to load dashboard data. Please try again.';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentBranch?.branchId, currentMonth, currentYear]
  );

  useEffect(() => {
    fetchDashboard(false);
  }, [fetchDashboard]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard(true);
  }, [fetchDashboard]);

  const handleSelectBranch = useCallback(
    (branch) => {
      dispatch(setCurrentBranch(branch));
      setBranchModalVisible(false);
    },
    [dispatch]
  );

  const greeting = useCallback(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, [])();

  const monthName = now.toLocaleString('default', { month: 'long' });

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>
            {greeting}, {user?.userName ?? 'there'} 👋
          </Text>
          <Text style={styles.headerStudio} numberOfLines={1}>
            {studio?.studioName ?? 'Studio Dashboard'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={() => navigation.navigate('ProfileRoot')}
          activeOpacity={0.8}
        >
          {studio?.logo ? (
            <Image
              source={{ uri: studio.logo }}
              style={styles.headerAvatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.headerAvatarText}>
              {(user?.userName ?? 'U').charAt(0).toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Branch Selector ── */}
      <TouchableOpacity
        style={styles.branchSelector}
        onPress={() => setBranchModalVisible(true)}
        activeOpacity={0.75}
      >
        <Ionicons name="business-outline" size={16} color={COLORS.primary} />
        <Text style={styles.branchSelectorText} numberOfLines={1}>
          {currentBranch?.name ?? currentBranch?.branchName ?? 'Select Branch'}
        </Text>
        <Ionicons name="chevron-down-outline" size={16} color={COLORS.primary} />
      </TouchableOpacity>

      {/* ── Content ── */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dashboard…</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchDashboard(false)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Period label */}
          <Text style={styles.periodLabel}>
            {monthName} {currentYear} Overview
          </Text>

          {/* Revenue card (full width) */}
          <RevenueCard
            thisMonth={dashboardData?.currentMonthRevenue}
            lastMonth={dashboardData?.lastMonthRevenue}
          />

          {/* Stat grid */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="people-outline"
              iconColor={COLORS.primary}
              iconBg={COLORS.primaryLight}
              title="Total Students"
              value={formatNumber(dashboardData?.totalStudents)}
              onPress={() => navigation.navigate('Students')}
            />
            <StatCard
              icon="person-outline"
              iconColor={COLORS.violet}
              iconBg={COLORS.violetLight}
              title="Total Instructors"
              value={formatNumber(dashboardData?.totalInstructors)}
              onPress={() => navigation.navigate('InstructorsRoot')}
            />
            <StatCard
              icon="medal-outline"
              iconColor={COLORS.success}
              iconBg={COLORS.successLight}
              title="Active Memberships"
              value={formatNumber(dashboardData?.totalActiveMemberships)}
              onPress={() => navigation.navigate('Students')}
            />
            <StatCard
              icon="fitness-outline"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberLight}
              title="Activities"
              value={formatNumber(activityCount)}
              onPress={() => navigation.navigate('ActivitiesRoot')}
            />
          </View>

          {/* Payments & Expenses row */}
          <View style={styles.wideCardsRow}>
            {/* Payments */}
            <TouchableOpacity
              style={[styles.wideCard, styles.wideCardPayments]}
              onPress={() => navigation.navigate('Payments')}
              activeOpacity={0.7}
            >
              <View style={styles.wideCardHeader}>
                <View style={[styles.wideCardIcon, { backgroundColor: COLORS.skyLight }]}>
                  <Ionicons name="cash-outline" size={18} color={COLORS.sky} />
                </View>
                <Text style={styles.wideCardTitle}>Payments</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.secondaryText} style={{ marginLeft: 'auto' }} />
              </View>
              <Text style={styles.wideCardAmount}>
                {formatCurrency(dashboardData?.totalCurrentMonthPaymentAmount)}
              </Text>
              <Text style={styles.wideCardSubtitle}>
                {formatNumber(dashboardData?.totalCurrentMonthPaymentCount)} transactions
              </Text>
            </TouchableOpacity>

            {/* Expenses */}
            <TouchableOpacity
              style={[styles.wideCard, styles.wideCardExpenses]}
              onPress={() => navigation.navigate('ExpensesRoot')}
              activeOpacity={0.7}
            >
              <View style={styles.wideCardHeader}>
                <View style={[styles.wideCardIcon, { backgroundColor: COLORS.roseLight }]}>
                  <Ionicons name="receipt-outline" size={18} color={COLORS.rose} />
                </View>
                <Text style={styles.wideCardTitle}>Expenses</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.secondaryText} style={{ marginLeft: 'auto' }} />
              </View>
              <Text style={[styles.wideCardAmount, { color: COLORS.rose }]}>
                {formatCurrency(dashboardData?.totalCurrentMonthExpenseAmount)}
              </Text>
              <Text style={styles.wideCardSubtitle}>
                {formatNumber(dashboardData?.totalCurrentMonthExpenseCount)} entries
              </Text>
            </TouchableOpacity>
          </View>

          {/* No data state */}
          {!dashboardData && !loading && (
            <View style={styles.noDataContainer}>
              <Ionicons name="bar-chart-outline" size={48} color={COLORS.border} />
              <Text style={styles.noDataText}>No data available for this branch</Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {/* Branch Picker Modal */}
      <BranchPickerModal
        visible={branchModalVisible}
        branches={branches}
        currentBranch={currentBranch}
        onSelect={handleSelectBranch}
        onClose={() => setBranchModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  headerStudio: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  headerAvatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.card,
  },
  headerAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  // Branch Selector
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  branchSelectorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  periodLabel: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Revenue card
  revenueCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  revenueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  revenueCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  revenueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  revenueBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  revenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revenueItem: {
    flex: 1,
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 4,
    fontWeight: '500',
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: '800',
  },
  revenueDivider: {
    width: 1,
    height: 48,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },

  // Stats grid (2 × 2)
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    width: '47.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
    lineHeight: 18,
  },
  statSubtitle: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 3,
  },

  // Wide cards (Payments + Expenses side by side)
  wideCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  wideCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  wideCardPayments: {},
  wideCardExpenses: {},
  wideCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  wideCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  wideCardAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.sky,
    marginBottom: 4,
  },
  wideCardSubtitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },

  // States
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '700',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  branchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  branchItemSelected: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: -6,
  },
  branchItemText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  branchItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  branchSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
