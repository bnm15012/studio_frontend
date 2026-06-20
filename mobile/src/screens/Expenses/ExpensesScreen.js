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

const EXPENSE_CATEGORIES = [
  'ELECTRICITY',
  'SALARY',
  'MAINTENANCE',
  'RENT',
  'SUPPLIES',
  'MARKETING',
  'OTHER',
];

const CATEGORY_ICONS = {
  ELECTRICITY: 'flash-outline',
  SALARY: 'people-outline',
  MAINTENANCE: 'construct-outline',
  RENT: 'home-outline',
  SUPPLIES: 'bag-outline',
  MARKETING: 'megaphone-outline',
  OTHER: 'ellipsis-horizontal-circle-outline',
};

const CATEGORY_COLORS = {
  ELECTRICITY: '#f59e0b',
  SALARY: '#6366f1',
  MAINTENANCE: '#8b5cf6',
  RENT: '#0ea5e9',
  SUPPLIES: '#10b981',
  MARKETING: '#ef4444',
  OTHER: '#6b7280',
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
  description: '',
  expenseDate: '',
  expenseCategory: 'OTHER',
  amount: '',
});

// ─── Category Picker ──────────────────────────────────────────────────────────

function CategoryPicker({ value, onChange }) {
  return (
    <View>
      <Text style={styles.label}>Category *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
        <View style={styles.categoryRow}>
          {EXPENSE_CATEGORIES.map((cat) => {
            const active = value === cat;
            const color = CATEGORY_COLORS[cat] || COLORS.secondaryText;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  active && { backgroundColor: color, borderColor: color },
                ]}
                onPress={() => onChange(cat)}
              >
                <Ionicons
                  name={CATEGORY_ICONS[cat] || 'ellipse-outline'}
                  size={13}
                  color={active ? '#fff' : color}
                />
                <Text style={[styles.categoryChipText, active && { color: '#fff' }]}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Expense Card ─────────────────────────────────────────────────────────────

function ExpenseCard({ expense, onLongPress }) {
  const catColor = CATEGORY_COLORS[expense.expenseCategory] || COLORS.secondaryText;
  const catIcon = CATEGORY_ICONS[expense.expenseCategory] || 'ellipse-outline';

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => onLongPress(expense)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: catColor + '20' }]}>
          <Ionicons name={catIcon} size={20} color={catColor} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {expense.description || 'No description'}
          </Text>
          <View style={styles.cardRow}>
            <Text style={[styles.categoryLabel, { color: catColor }]}>
              {expense.expenseCategory
                ? expense.expenseCategory.charAt(0) + expense.expenseCategory.slice(1).toLowerCase()
                : '—'}
            </Text>
            <Text style={styles.cardDot}> · </Text>
            <Text style={styles.cardMeta}>{formatDate(expense.expenseDate)}</Text>
          </View>
        </View>
        <Text style={styles.cardAmount}>{formatCurrency(expense.amount)}</Text>
      </View>
      <Text style={styles.cardHint}>Hold to edit / delete</Text>
    </TouchableOpacity>
  );
}

// ─── Summary Banner ───────────────────────────────────────────────────────────

function SummaryBanner({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const byCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    const catTotal = expenses
      .filter((e) => e.expenseCategory === cat)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    if (catTotal > 0) acc[cat] = catTotal;
    return acc;
  }, {});

  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <View style={styles.summaryBanner}>
      <View style={styles.summaryTotal}>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
      </View>
      {topCategories.length > 0 && (
        <View style={styles.summaryBreakdown}>
          {topCategories.map(([cat, amt]) => (
            <View key={cat} style={styles.summaryBreakdownItem}>
              <View
                style={[
                  styles.summaryDot,
                  { backgroundColor: CATEGORY_COLORS[cat] || COLORS.secondaryText },
                ]}
              />
              <Text style={styles.summaryBreakdownLabel} numberOfLines={1}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Text>
              <Text style={styles.summaryBreakdownAmt}>{formatCurrency(amt)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function ExpenseFormModal({ visible, onClose, onSubmit, initialData, saving }) {
  const isEdit = !!initialData?.expenseId;
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (visible) {
      if (isEdit && initialData) {
        setForm({
          description: initialData.description || '',
          expenseDate: initialData.expenseDate || '',
          expenseCategory: initialData.expenseCategory || 'OTHER',
          amount: String(initialData.amount || ''),
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [visible, initialData]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.description.trim()) {
      Alert.alert('Validation', 'Description is required.');
      return;
    }
    if (!form.amount) {
      Alert.alert('Validation', 'Amount is required.');
      return;
    }
    if (!form.expenseDate) {
      Alert.alert('Validation', 'Expense date is required.');
      return;
    }
    onSubmit({
      description: form.description.trim(),
      expenseDate: form.expenseDate,
      expenseCategory: form.expenseCategory,
      amount: parseFloat(form.amount),
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
            <Text style={styles.sheetTitle}>{isEdit ? 'Edit Expense' : 'Add Expense'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Monthly electricity bill"
                placeholderTextColor={COLORS.secondaryText}
                value={form.description}
                onChangeText={set('description')}
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

              <Text style={styles.label}>Expense Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2025-07-01"
                placeholderTextColor={COLORS.secondaryText}
                value={form.expenseDate}
                onChangeText={set('expenseDate')}
              />

              <CategoryPicker value={form.expenseCategory} onChange={set('expenseCategory')} />

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

function ActionSheet({ visible, expense, onClose, onEdit, onDelete }) {
  if (!expense) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.actionSheetTitle} numberOfLines={1}>
            {expense.description || 'Expense'}
          </Text>
          <TouchableOpacity style={styles.actionItem} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.actionItemText, { color: COLORS.primary }]}>Edit Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionItemText, { color: COLORS.danger }]}>Delete Expense</Text>
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

export default function ExpensesScreen() {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [expenses, setExpenses] = useState([]);
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
  const hasMore = expenses.length < totalCount;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchExpenses = useCallback(
    async ({ pageNum = 1, search = searchTerm, replace = false } = {}) => {
      if (!branchId) return;
      try {
        if (replace) setLoading(true);
        else if (pageNum > 1) setLoadingMore(true);

        const res = await api.get(
          `/expenses/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data || [];
        const total = res.data?.status?.totalCount || 0;

        setTotalCount(total);
        setExpenses((prev) => (replace || pageNum === 1 ? items : [...prev, ...items]));
        setPage(pageNum);
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load expenses.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [branchId, searchTerm]
  );

  useEffect(() => {
    fetchExpenses({ pageNum: 1, replace: true });
  }, [branchId]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearchChange = (text) => {
    setSearchInput(text);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchTerm(text);
      fetchExpenses({ pageNum: 1, search: text, replace: true });
    }, 500);
  };

  // ── Refresh / Load More ───────────────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses({ pageNum: 1, search: searchTerm, replace: true });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchExpenses({ pageNum: page + 1, search: searchTerm });
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      await api.post('/expenses/add', { ...payload, branchId });
      setFormVisible(false);
      fetchExpenses({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to add expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (payload) => {
    try {
      setSaving(true);
      await api.put(`/expenses/update/${editTarget.expenseId}`, payload);
      setFormVisible(false);
      setEditTarget(null);
      fetchExpenses({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (expense) => {
    setActionVisible(false);
    Alert.alert(
      'Delete Expense',
      `Delete "${expense.description || 'this expense'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/expenses/delete/${expense.expenseId}`);
              fetchExpenses({ pageNum: 1, replace: true });
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
    <ExpenseCard
      expense={item}
      onLongPress={(e) => {
        setActionTarget(e);
        setActionVisible(true);
      }}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={56} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Expenses Found</Text>
        <Text style={styles.emptySubtitle}>
          {searchTerm ? 'Try a different search term.' : 'Tap + to log your first expense.'}
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
        <Text style={styles.headerTitle}>Expenses</Text>
        <Text style={styles.headerCount}>{totalCount} total</Text>
      </View>

      {/* Summary */}
      {expenses.length > 0 && <SummaryBanner expenses={expenses} />}

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses…"
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
          data={expenses}
          keyExtractor={(item) => String(item.expenseId)}
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
      <ExpenseFormModal
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
        expense={actionTarget}
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
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTotal: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  summaryTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.danger,
  },
  summaryBreakdown: {
    gap: 6,
  },
  summaryBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryBreakdownLabel: {
    flex: 1,
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  summaryBreakdownAmt: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
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
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDot: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  cardMeta: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
    marginLeft: 'auto',
  },
  cardHint: {
    fontSize: 11,
    color: COLORS.border,
    marginTop: 4,
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
  // Category chips
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.secondaryText,
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
