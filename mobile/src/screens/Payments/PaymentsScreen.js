import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  primary: '#6366f1',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  secondaryText: '#6b7280',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  border: '#e5e7eb',
  inputBg: '#f3f4f6',
};

const PAYMENT_TYPE_OPTIONS = ['CASH', 'UPI'];
const STATUS_OPTIONS = ['PENDING', 'COMPLETED'];
const PAYEE_TYPE_OPTIONS = ['STUDENT', 'CLIENT'];

const STATUS_CONFIG = {
  PENDING: { color: COLORS.warning, bg: '#fef3c7', label: 'Pending' },
  COMPLETED: { color: COLORS.success, bg: '#d1fae5', label: 'Completed' },
};

const PAYMENT_TYPE_ICON = {
  CASH: 'cash-outline',
  UPI: 'phone-portrait-outline',
};

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

const emptyForm = () => ({
  payeeType: 'STUDENT',
  payeeName: '',
  amount: '',
  paymentDate: '',
  paymentType: 'CASH',
  status: 'PENDING',
});

// ─── Dropdown Component ───────────────────────────────────────────────────────

function InlineDropdown({ label, options, value, onChange }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.segmentRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.segmentOption, value === opt && styles.segmentOptionActive]}
            onPress={() => onChange(opt)}
          >
            <Text
              style={[
                styles.segmentOptionText,
                value === opt && styles.segmentOptionTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Payment Card ─────────────────────────────────────────────────────────────

function PaymentCard({ payment, onLongPress }) {
  const statusCfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => onLongPress(payment)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {payment.payeeName || 'Unknown'}
          </Text>
          <View style={styles.cardRow}>
            <Ionicons
              name={PAYMENT_TYPE_ICON[payment.paymentType] || 'wallet-outline'}
              size={13}
              color={COLORS.secondaryText}
            />
            <Text style={styles.cardMeta}>
              {payment.paymentType || '—'} · {formatDate(payment.paymentDate)}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Text style={styles.cardAmount}>{formatCurrency(payment.amount)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardHint}>Hold to edit / delete</Text>
    </TouchableOpacity>
  );
}

// ─── Summary Banner ───────────────────────────────────────────────────────────

function SummaryBanner({ payments }) {
  const total = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const completed = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pending = total - completed;

  return (
    <View style={styles.summaryBanner}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Total</Text>
        <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
          {formatCurrency(total)}
        </Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Completed</Text>
        <Text style={[styles.summaryValue, { color: COLORS.success }]}>
          {formatCurrency(completed)}
        </Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Pending</Text>
        <Text style={[styles.summaryValue, { color: COLORS.warning }]}>
          {formatCurrency(pending)}
        </Text>
      </View>
    </View>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function PaymentFormModal({ visible, onClose, onSubmit, initialData, saving }) {
  const isEdit = !!(initialData?.paymentId ?? initialData?.id);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (visible) {
      if (isEdit && initialData) {
        setForm({
          payeeType: initialData.payeeType || 'STUDENT',
          payeeName: initialData.payeeName || '',
          amount: String(initialData.amount || ''),
          paymentDate: initialData.paymentDate || '',
          paymentType: initialData.paymentType || 'CASH',
          status: initialData.status || 'PENDING',
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [visible, initialData]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.payeeName.trim()) {
      Alert.alert('Validation', 'Payee name is required.');
      return;
    }
    if (!form.amount) {
      Alert.alert('Validation', 'Amount is required.');
      return;
    }
    if (!form.paymentDate) {
      Alert.alert('Validation', 'Payment date is required.');
      return;
    }
    onSubmit({
      payeeType: form.payeeType,
      payeeName: form.payeeName.trim(),
      amount: parseFloat(form.amount),
      paymentDate: form.paymentDate,
      paymentType: form.paymentType,
      status: form.status,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{isEdit ? 'Edit Payment' : 'Add Payment'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <InlineDropdown
                label="Payee Type *"
                options={PAYEE_TYPE_OPTIONS}
                value={form.payeeType}
                onChange={set('payeeType')}
              />

              <Text style={styles.label}>Payee Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter payee name"
                placeholderTextColor={COLORS.secondaryText}
                value={form.payeeName}
                onChangeText={set('payeeName')}
              />

              <Text style={styles.label}>Amount *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                placeholderTextColor={COLORS.secondaryText}
                value={form.amount}
                onChangeText={set('amount')}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Payment Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2025-07-01"
                placeholderTextColor={COLORS.secondaryText}
                value={form.paymentDate}
                onChangeText={set('paymentDate')}
              />

              <InlineDropdown
                label="Payment Type *"
                options={PAYMENT_TYPE_OPTIONS}
                value={form.paymentType}
                onChange={set('paymentType')}
              />

              <InlineDropdown
                label="Status *"
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={set('status')}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitBtn, saving && styles.btnDisabled]}
                  onPress={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>{isEdit ? 'Update' : 'Add'}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Action Sheet ─────────────────────────────────────────────────────────────

function ActionSheet({ visible, payment, onClose, onEdit, onDelete }) {
  if (!payment) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.actionSheetTitle} numberOfLines={1}>
            {payment.payeeName || 'Payment'}
          </Text>
          <TouchableOpacity style={styles.actionItem} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.actionItemText, { color: COLORS.primary }]}>Edit Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionItemText, { color: COLORS.danger }]}>Delete Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, styles.actionCancel]} onPress={onClose}>
            <Text style={styles.actionCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PaymentsScreen() {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [actionVisible, setActionVisible] = useState(false);
  const [actionTarget, setActionTarget] = useState(null);

  const searchDebounce = useRef(null);
  const hasMore = payments.length < totalCount;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchPayments = useCallback(
    async ({ pageNum = 1, search = searchTerm, replace = false } = {}) => {
      if (!branchId) return;
      try {
        if (replace) setLoading(true);
        else if (pageNum > 1) setLoadingMore(true);

        const res = await api.get(
          `/payments/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data || [];
        const total = res.data?.status?.totalCount || 0;

        setTotalCount(total);
        setPayments((prev) => (replace || pageNum === 1 ? items : [...prev, ...items]));
        setPage(pageNum);
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load payments.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [branchId, searchTerm]
  );

  useEffect(() => {
    fetchPayments({ pageNum: 1, replace: true });
  }, [branchId]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearchChange = (text) => {
    setSearchInput(text);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchTerm(text);
      fetchPayments({ pageNum: 1, search: text, replace: true });
    }, 500);
  };

  // ── Refresh / Load More ───────────────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments({ pageNum: 1, search: searchTerm, replace: true });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPayments({ pageNum: page + 1, search: searchTerm });
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      await api.post('/payments/add', { ...payload, branchId });
      setFormVisible(false);
      fetchPayments({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to add payment.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (payload) => {
    try {
      setSaving(true);
      await api.put(`/payments/update/${editTarget.paymentId ?? editTarget.id}`, payload);
      setFormVisible(false);
      setEditTarget(null);
      fetchPayments({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update payment.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (payment) => {
    setActionVisible(false);
    Alert.alert(
      'Delete Payment',
      `Delete payment for "${payment.payeeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/payments/delete/${payment.paymentId ?? payment.id}`);
              fetchPayments({ pageNum: 1, replace: true });
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to delete.');
            }
          },
        },
      ]
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const renderItem = ({ item }) => (
    <PaymentCard
      payment={item}
      onLongPress={(p) => {
        setActionTarget(p);
        setActionVisible(true);
      }}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cash-outline" size={56} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Payments Found</Text>
        <Text style={styles.emptySubtitle}>
          {searchTerm ? 'Try a different search term.' : 'Tap + to record your first payment.'}
        </Text>
      </View>
    );
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
        <Text style={styles.headerCount}>{totalCount} total</Text>
      </View>

      {/* Summary */}
      {payments.length > 0 && <SummaryBanner payments={payments} />}

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search payments…"
          placeholderTextColor={COLORS.secondaryText}
          value={searchInput}
          onChangeText={handleSearchChange}
          returnKeyType="search"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => String(item.paymentId ?? item.id)}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditTarget(null);
          setFormVisible(true);
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Form Modal */}
      <PaymentFormModal
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditTarget(null);
        }}
        onSubmit={editTarget ? handleEdit : handleAdd}
        initialData={editTarget}
        saving={saving}
      />

      {/* Action Sheet */}
      <ActionSheet
        visible={actionVisible}
        payment={actionTarget}
        onClose={() => setActionVisible(false)}
        onEdit={() => {
          setActionVisible(false);
          setEditTarget(actionTarget);
          setFormVisible(true);
        }}
        onDelete={() => handleDelete(actionTarget)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerCount: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  summaryBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginLeft: 2,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardHint: {
    fontSize: 11,
    color: COLORS.border,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.border,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  // Segment / Dropdown
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  segmentOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  segmentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#eef2ff',
  },
  segmentOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryText,
  },
  segmentOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  actionSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  actionCancel: {
    borderBottomWidth: 0,
    justifyContent: 'center',
    marginTop: 4,
  },
  actionCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textAlign: 'center',
    width: '100%',
  },
});
