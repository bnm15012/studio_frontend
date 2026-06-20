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

// Status is derived from finalPaymentDate (matches web logic)
function getBookingStatus(booking) {
  if (booking.finalPaymentDate) {
    return { color: COLORS.success, bg: '#d1fae5', label: 'Fully Paid' };
  }
  return { color: COLORS.warning, bg: '#fef3c7', label: 'Pending Payment' };
}

const PAGE_SIZE = 10;

// ─── Helper ───────────────────────────────────────────────────────────────────

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
  clientId: '',
  clientSearchTerm: '',
  purpose: '',
  startDate: '',
  endDate: '',
  totalAmount: '',
  notes: '',
});

// ─── Client Search Sub-component ─────────────────────────────────────────────

function ClientSearchInput({ branchId, value, displayValue, onSelect }) {
  const [query, setQuery] = useState(displayValue || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceTimer = useRef(null);

  const search = useCallback(
    (term) => {
      clearTimeout(debounceTimer.current);
      if (!term.trim()) {
        setResults([]);
        return;
      }
      debounceTimer.current = setTimeout(async () => {
        try {
          setSearching(true);
          const res = await api.get(
            `/clients/search/${branchId}?searchTerm=${encodeURIComponent(term)}`
          );
          setResults(res.data?.data || []);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 400);
    },
    [branchId]
  );

  const handleChangeText = (text) => {
    setQuery(text);
    search(text);
  };

  const handleSelect = (client) => {
    setQuery(client.pocName || '');
    setResults([]);
    onSelect(client);
  };

  return (
    <View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search client by name…"
          placeholderTextColor={COLORS.secondaryText}
          value={query}
          onChangeText={handleChangeText}
        />
        {searching && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ position: 'absolute', right: 12, top: 12 }}
          />
        )}
      </View>
      {results.length > 0 && (
        <View style={styles.dropdownContainer}>
          {results.slice(0, 6).map((client) => (
            <TouchableOpacity
              key={client.clientId}
              style={styles.dropdownItem}
              onPress={() => handleSelect(client)}
            >
              <Text style={styles.dropdownItemText}>
                {client.pocName}
                {client.companyName ? ` — ${client.companyName}` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, onLongPress }) {
  const statusCfg = getBookingStatus(booking);
  const clientName = booking.clientEntry?.pocName || booking.pocName || 'Unknown Client';
  const title = booking.purpose || clientName;
  const paidAmount = Array.isArray(booking.paymentEntries)
    ? booking.paymentEntries.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + (Number(p.amount) || 0), 0)
    : null;
  const dueAmount = booking.totalAmount != null && paidAmount != null
    ? booking.totalAmount - paidAmount
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => onLongPress(booking)}
      activeOpacity={0.85}
    >
      {/* Title + status */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>

      {/* Client name (if purpose shown as title) */}
      {booking.purpose ? (
        <View style={styles.cardRow}>
          <Ionicons name="person-outline" size={13} color={COLORS.secondaryText} />
          <Text style={styles.cardMeta}>{clientName}</Text>
        </View>
      ) : null}

      {/* Meeting time */}
      {(booking.startTime || booking.startDate) ? (
        <View style={styles.cardRow}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.secondaryText} />
          <Text style={styles.cardMeta}>
            {booking.startTime
              ? `${booking.startTime}${booking.endTime ? ' – ' + booking.endTime : ''}`
              : `${formatDate(booking.startDate)} → ${formatDate(booking.endDate)}`}
          </Text>
        </View>
      ) : null}

      {/* Amount row */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardAmount}>{formatCurrency(booking.totalAmount ?? booking.amount)}</Text>
          {dueAmount != null && dueAmount > 0 ? (
            <Text style={styles.cardDue}>Due: {formatCurrency(dueAmount)}</Text>
          ) : null}
        </View>
        <Text style={styles.cardHint}>Hold to edit / delete</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function BookingFormModal({ visible, onClose, onSubmit, initialData, branchId, saving }) {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState(emptyForm());
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (visible) {
      if (isEdit && initialData) {
        setForm({
          clientId: String(initialData.clientEntry?.clientId || initialData.clientId || ''),
          clientSearchTerm: initialData.clientEntry?.pocName || initialData.pocName || '',
          purpose: initialData.purpose || '',
          startDate: initialData.startTime || initialData.startDate || '',
          endDate: initialData.endTime || initialData.endDate || '',
          totalAmount: String(initialData.totalAmount ?? initialData.amount ?? ''),
          notes: initialData.notes || '',
        });
        setSelectedClient({
          clientId: initialData.clientEntry?.clientId || initialData.clientId,
          pocName: initialData.clientEntry?.pocName || initialData.pocName,
        });
      } else {
        setForm(emptyForm());
        setSelectedClient(null);
      }
    }
  }, [visible, initialData]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setForm((f) => ({ ...f, clientId: String(client.clientId) }));
  };

  const handleSubmit = () => {
    if (!form.clientId && !isEdit) {
      Alert.alert('Validation', 'Please select a client.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      Alert.alert('Validation', 'Start and end date are required.');
      return;
    }
    if (!form.totalAmount) {
      Alert.alert('Validation', 'Total amount is required.');
      return;
    }
    onSubmit({
      purpose: form.purpose,
      clientEntry: { clientId: Number(form.clientId) },
      startTime: form.startDate,
      endTime: form.endDate,
      totalAmount: parseFloat(form.totalAmount),
      notes: form.notes,
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
            <Text style={styles.sheetTitle}>{isEdit ? 'Edit Booking' : 'Add Booking'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Purpose</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Studio shoot, Event booking…"
                placeholderTextColor={COLORS.secondaryText}
                value={form.purpose}
                onChangeText={set('purpose')}
              />

              {!isEdit && (
                <>
                  <Text style={styles.label}>Client *</Text>
                  <ClientSearchInput
                    branchId={branchId}
                    value={form.clientId}
                    displayValue={form.clientSearchTerm}
                    onSelect={handleClientSelect}
                  />
                  {selectedClient && (
                    <Text style={styles.selectedClientText}>
                      ✓ {selectedClient.pocName}
                    </Text>
                  )}
                </>
              )}

              <Text style={styles.label}>Start Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2025-07-01"
                placeholderTextColor={COLORS.secondaryText}
                value={form.startDate}
                onChangeText={set('startDate')}
              />

              <Text style={styles.label}>End Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2025-07-31"
                placeholderTextColor={COLORS.secondaryText}
                value={form.endDate}
                onChangeText={set('endDate')}
              />

              <Text style={styles.label}>Total Amount *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter total amount"
                placeholderTextColor={COLORS.secondaryText}
                value={form.totalAmount}
                onChangeText={set('totalAmount')}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Optional notes…"
                placeholderTextColor={COLORS.secondaryText}
                value={form.notes}
                onChangeText={set('notes')}
                multiline
                numberOfLines={3}
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

// ─── Action Bottom Sheet ──────────────────────────────────────────────────────

function ActionSheet({ visible, booking, onClose, onEdit, onDelete }) {
  if (!booking) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.actionSheetTitle} numberOfLines={1}>
            {booking.clientEntry?.pocName || booking.pocName || 'Booking'}
          </Text>
          <TouchableOpacity style={styles.actionItem} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.actionItemText, { color: COLORS.primary }]}>Edit Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionItemText, { color: COLORS.danger }]}>Delete Booking</Text>
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

export default function BookingsScreen() {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [bookings, setBookings] = useState([]);
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
  const hasMore = bookings.length < totalCount;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(
    async ({ pageNum = 1, search = searchTerm, replace = false } = {}) => {
      if (!branchId) return;
      try {
        if (replace) setLoading(true);
        else if (pageNum > 1) setLoadingMore(true);

        const res = await api.get(
          `/booking/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data || [];
        const total = res.data?.status?.totalCount || 0;

        setTotalCount(total);
        setBookings((prev) => (replace || pageNum === 1 ? items : [...prev, ...items]));
        setPage(pageNum);
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load bookings.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [branchId, searchTerm]
  );

  useEffect(() => {
    fetchBookings({ pageNum: 1, replace: true });
  }, [branchId]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearchChange = (text) => {
    setSearchInput(text);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchTerm(text);
      fetchBookings({ pageNum: 1, search: text, replace: true });
    }, 500);
  };

  // ── Refresh ───────────────────────────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings({ pageNum: 1, search: searchTerm, replace: true });
  };

  // ── Pagination ────────────────────────────────────────────────────────────

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBookings({ pageNum: page + 1, search: searchTerm });
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      await api.post('/booking/add', { ...payload, branchId });
      setFormVisible(false);
      fetchBookings({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to add booking.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (payload) => {
    try {
      setSaving(true);
      await api.put(`/booking/update/${editTarget.id}`, payload);
      setFormVisible(false);
      setEditTarget(null);
      fetchBookings({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update booking.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (booking) => {
    setActionVisible(false);
    Alert.alert(
      'Delete Booking',
      `Delete booking for "${booking.clientEntry?.pocName || booking.pocName || 'this client'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/booking/delete/${booking.id}`);
              fetchBookings({ pageNum: 1, replace: true });
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
    <BookingCard
      booking={item}
      onLongPress={(b) => {
        setActionTarget(b);
        setActionVisible(true);
      }}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={56} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Bookings Found</Text>
        <Text style={styles.emptySubtitle}>
          {searchTerm ? 'Try a different search term.' : 'Tap + to create your first booking.'}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <Text style={styles.headerCount}>{totalCount} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bookings…"
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
          data={bookings}
          keyExtractor={(item) => String(item.id)}
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

      {/* Add / Edit Modal */}
      <BookingFormModal
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditTarget(null);
        }}
        onSubmit={editTarget ? handleEdit : handleAdd}
        initialData={editTarget}
        branchId={branchId}
        saving={saving}
      />

      {/* Action Sheet */}
      <ActionSheet
        visible={actionVisible}
        booking={actionTarget}
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
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cardDue: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '600',
    marginTop: 2,
  },
  cardHint: {
    fontSize: 11,
    color: COLORS.border,
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
  // Modal / Bottom Sheet
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
  inputWrapper: {
    position: 'relative',
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
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 999,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedClientText: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 4,
    marginBottom: 2,
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
  // Action sheet
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
