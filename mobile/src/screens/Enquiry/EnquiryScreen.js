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
  info: '#3b82f6',
  border: '#e5e7eb',
  inputBg: '#f3f4f6',
};

const STATUS_CONFIG = {
  NEW: { color: COLORS.info, bg: '#dbeafe', label: 'New' },
  CONTACTED: { color: COLORS.warning, bg: '#fef3c7', label: 'Contacted' },
  CONVERTED: { color: COLORS.success, bg: '#d1fae5', label: 'Converted' },
  LOST: { color: COLORS.danger, bg: '#fee2e2', label: 'Lost' },
};

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'];

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

const emptyForm = () => ({
  name: '',
  contact: '',
  enquiryDate: '',
  enquiryPurpose: '',
});

// ─── Enquiry Card ─────────────────────────────────────────────────────────────

function EnquiryCard({ enquiry, onLongPress }) {
  const statusCfg = STATUS_CONFIG[enquiry.status] || STATUS_CONFIG.NEW;

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => onLongPress(enquiry)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {enquiry.name || 'Unknown'}
          </Text>
          <View style={styles.cardRow}>
            <Ionicons name="call-outline" size={13} color={COLORS.secondaryText} />
            <Text style={styles.cardMeta}>{enquiry.contact || '—'}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.cardRow}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.secondaryText} />
          <Text style={styles.cardMeta}>{formatDate(enquiry.enquiryDate)}</Text>
        </View>
        {enquiry.enquiryPurpose ? (
          <View style={styles.cardRow}>
            <Ionicons name="chatbubble-outline" size={13} color={COLORS.secondaryText} />
            <Text style={styles.cardMeta} numberOfLines={1}>
              {enquiry.enquiryPurpose}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.cardHint}>Hold to manage</Text>
    </TouchableOpacity>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function EnquiryFormModal({ visible, onClose, onSubmit, initialData, saving }) {
  const isEdit = !!initialData?.enquiryId;
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (visible) {
      if (isEdit && initialData) {
        setForm({
          name: initialData.name || '',
          contact: initialData.contact || '',
          enquiryDate: initialData.enquiryDate || '',
          enquiryPurpose: initialData.enquiryPurpose || '',
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [visible, initialData]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }
    if (!form.contact.trim()) {
      Alert.alert('Validation', 'Contact is required.');
      return;
    }
    if (!form.enquiryDate) {
      Alert.alert('Validation', 'Enquiry date is required.');
      return;
    }
    onSubmit({
      name: form.name.trim(),
      contact: form.contact.trim(),
      enquiryDate: form.enquiryDate,
      enquiryPurpose: form.enquiryPurpose.trim(),
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
            <Text style={styles.sheetTitle}>{isEdit ? 'Edit Enquiry' : 'Add Enquiry'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={COLORS.secondaryText}
                value={form.name}
                onChangeText={set('name')}
              />

              <Text style={styles.label}>Contact *</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone or email"
                placeholderTextColor={COLORS.secondaryText}
                value={form.contact}
                onChangeText={set('contact')}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Enquiry Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2025-07-01"
                placeholderTextColor={COLORS.secondaryText}
                value={form.enquiryDate}
                onChangeText={set('enquiryDate')}
              />

              <Text style={styles.label}>Enquiry Purpose</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What are they interested in?"
                placeholderTextColor={COLORS.secondaryText}
                value={form.enquiryPurpose}
                onChangeText={set('enquiryPurpose')}
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

// ─── Status Update Modal ──────────────────────────────────────────────────────

function StatusUpdateModal({ visible, enquiry, onClose, onUpdate, saving }) {
  const [selectedStatus, setSelectedStatus] = useState('NEW');

  useEffect(() => {
    if (visible && enquiry) {
      setSelectedStatus(enquiry.status || 'NEW');
    }
  }, [visible, enquiry]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Update Status</Text>
          <Text style={styles.statusSubtitle} numberOfLines={1}>
            {enquiry?.name || ''}
          </Text>

          <View style={styles.statusGrid}>
            {STATUS_OPTIONS.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = selectedStatus === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusOption,
                    { borderColor: cfg.color, backgroundColor: active ? cfg.color : cfg.bg },
                  ]}
                  onPress={() => setSelectedStatus(s)}
                >
                  <Text style={[styles.statusOptionText, { color: active ? '#fff' : cfg.color }]}>
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, saving && styles.btnDisabled]}
              onPress={() => onUpdate(selectedStatus)}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Action Sheet ─────────────────────────────────────────────────────────────

function ActionSheet({ visible, enquiry, onClose, onEdit, onDelete, onStatus }) {
  if (!enquiry) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.actionSheetTitle} numberOfLines={1}>
            {enquiry.name || 'Enquiry'}
          </Text>
          <TouchableOpacity style={styles.actionItem} onPress={onStatus}>
            <Ionicons name="git-branch-outline" size={20} color={COLORS.info} />
            <Text style={[styles.actionItemText, { color: COLORS.info }]}>Update Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.actionItemText, { color: COLORS.primary }]}>Edit Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionItemText, { color: COLORS.danger }]}>Delete Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, styles.actionCancel]} onPress={onClose}>
            <Text style={styles.actionCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Status Filter Bar ────────────────────────────────────────────────────────

function StatusFilterBar({ activeFilter, onFilter }) {
  const filters = [{ key: 'ALL', label: 'All' }, ...STATUS_OPTIONS.map((s) => ({ key: s, label: STATUS_CONFIG[s].label }))];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterBar}
      contentContainerStyle={styles.filterBarContent}
    >
      {filters.map(({ key, label }) => {
        const cfg = STATUS_CONFIG[key];
        const active = activeFilter === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterChip,
              active && { backgroundColor: cfg ? cfg.color : COLORS.primary, borderColor: cfg ? cfg.color : COLORS.primary },
            ]}
            onPress={() => onFilter(key)}
          >
            <Text style={[styles.filterChipText, active && { color: '#fff' }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function EnquiryScreen() {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formVisible, setFormVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [actionVisible, setActionVisible] = useState(false);
  const [actionTarget, setActionTarget] = useState(null);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const searchDebounce = useRef(null);
  const hasMore = enquiries.length < totalCount;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchEnquiries = useCallback(
    async ({ pageNum = 1, search = searchTerm, replace = false } = {}) => {
      if (!branchId) return;
      try {
        if (replace) setLoading(true);
        else if (pageNum > 1) setLoadingMore(true);

        const res = await api.get(
          `/enquiries/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data || [];
        const total = res.data?.status?.totalCount || 0;

        setTotalCount(total);
        setEnquiries((prev) => (replace || pageNum === 1 ? items : [...prev, ...items]));
        setPage(pageNum);
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load enquiries.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [branchId, searchTerm]
  );

  useEffect(() => {
    fetchEnquiries({ pageNum: 1, replace: true });
  }, [branchId]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearchChange = (text) => {
    setSearchInput(text);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchTerm(text);
      fetchEnquiries({ pageNum: 1, search: text, replace: true });
    }, 500);
  };

  // ── Refresh / Load More ───────────────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEnquiries({ pageNum: 1, search: searchTerm, replace: true });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchEnquiries({ pageNum: page + 1, search: searchTerm });
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      await api.post('/enquiries/add', { ...payload, branchId });
      setFormVisible(false);
      fetchEnquiries({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to add enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (payload) => {
    try {
      setSaving(true);
      await api.put(`/enquiries/update/${editTarget.enquiryId}`, payload);
      setFormVisible(false);
      setEditTarget(null);
      fetchEnquiries({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (enquiry) => {
    setActionVisible(false);
    Alert.alert(
      'Delete Enquiry',
      `Delete enquiry for "${enquiry.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/enquiries/delete/${enquiry.enquiryId}`);
              fetchEnquiries({ pageNum: 1, replace: true });
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to delete.');
            }
          },
        },
      ]
    );
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusSaving(true);
      await api.put(`/enquiries/update/${actionTarget.enquiryId}`, {
        ...actionTarget,
        status: newStatus,
      });
      setStatusModalVisible(false);
      fetchEnquiries({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update status.');
    } finally {
      setStatusSaving(false);
    }
  };

  // ── Filtered Data ─────────────────────────────────────────────────────────

  const filteredEnquiries =
    statusFilter === 'ALL'
      ? enquiries
      : enquiries.filter((e) => e.status === statusFilter);

  // ── Render ────────────────────────────────────────────────────────────────

  const renderItem = ({ item }) => (
    <EnquiryCard
      enquiry={item}
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
        <Ionicons name="chatbubbles-outline" size={56} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Enquiries Found</Text>
        <Text style={styles.emptySubtitle}>
          {searchTerm ? 'Try a different search term.' : 'Tap + to add your first enquiry.'}
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
        <Text style={styles.headerTitle}>Enquiries</Text>
        <Text style={styles.headerCount}>{totalCount} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search enquiries…"
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

      {/* Status Filter */}
      <StatusFilterBar activeFilter={statusFilter} onFilter={setStatusFilter} />

      {/* List */}
      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredEnquiries}
          keyExtractor={(item) => String(item.enquiryId)}
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
      <EnquiryFormModal
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
        enquiry={actionTarget}
        onClose={() => setActionVisible(false)}
        onEdit={() => {
          setActionVisible(false);
          setEditTarget(actionTarget);
          setFormVisible(true);
        }}
        onDelete={() => handleDelete(actionTarget)}
        onStatus={() => {
          setActionVisible(false);
          setStatusModalVisible(true);
        }}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        visible={statusModalVisible}
        enquiry={actionTarget}
        onClose={() => setStatusModalVisible(false)}
        onUpdate={handleStatusUpdate}
        saving={statusSaving}
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
  filterBar: {
    marginBottom: 6,
  },
  filterBarContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondaryText,
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
    marginBottom: 8,
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
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  cardDetails: {
    gap: 4,
    marginBottom: 6,
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
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
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
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  // Status grid
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  statusOption: {
    flex: 1,
    minWidth: '40%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '700',
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
