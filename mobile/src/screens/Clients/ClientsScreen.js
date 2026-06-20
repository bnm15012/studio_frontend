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

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9',
  '#10b981', '#f59e0b', '#ef4444', '#14b8a6',
];

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const emptyForm = () => ({
  pocName: '',
  pocEmail: '',
  pocPhone: '',
  groupName: '',
  clientType: 'INDIVIDUAL',
});

const CLIENT_TYPES = ['INDIVIDUAL', 'GROUP', 'COMPANY'];

// ─── Client Avatar ────────────────────────────────────────────────────────────

function ClientAvatar({ name, size = 44 }) {
  const color = getAvatarColor(name);
  const initials = getInitials(name);
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '20' },
      ]}
    >
      <Text style={[styles.avatarText, { color, fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ client, onLongPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => onLongPress(client)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <ClientAvatar name={client.pocName} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {client.pocName || 'Unknown'}
          </Text>
          {client.groupName ? (
            <Text style={styles.cardCompany} numberOfLines={1}>
              {client.groupName}
            </Text>
          ) : null}
        </View>
        {client.clientType ? (
          <View style={styles.clientTypeBadge}>
            <Text style={styles.clientTypeBadgeText}>{client.clientType}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardContacts}>
        {client.pocEmail ? (
          <View style={styles.cardContactRow}>
            <Ionicons name="mail-outline" size={13} color={COLORS.secondaryText} />
            <Text style={styles.cardContactText} numberOfLines={1}>
              {client.pocEmail}
            </Text>
          </View>
        ) : null}
        {client.pocPhone ? (
          <View style={styles.cardContactRow}>
            <Ionicons name="call-outline" size={13} color={COLORS.secondaryText} />
            <Text style={styles.cardContactText}>{client.pocPhone}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.cardHint}>Hold to edit / delete</Text>
    </TouchableOpacity>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function ClientFormModal({ visible, onClose, onSubmit, initialData, saving }) {
  const isEdit = !!initialData?.clientId;
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    if (visible) {
      if (isEdit && initialData) {
        setForm({
          pocName: initialData.pocName || '',
          pocEmail: initialData.pocEmail || '',
          pocPhone: initialData.pocPhone || '',
          groupName: initialData.groupName || '',
          clientType: initialData.clientType || 'INDIVIDUAL',
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [visible, initialData]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.pocName.trim()) {
      Alert.alert('Validation', 'Contact person name is required.');
      return;
    }
    if (!form.pocEmail.trim() && !form.pocPhone.trim()) {
      Alert.alert('Validation', 'Please provide at least an email or phone number.');
      return;
    }
    onSubmit({
      pocName: form.pocName.trim(),
      pocEmail: form.pocEmail.trim(),
      pocPhone: form.pocPhone.trim(),
      groupName: form.groupName.trim(),
      clientType: form.clientType,
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
            <Text style={styles.sheetTitle}>{isEdit ? 'Edit Client' : 'Add Client'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Contact Person Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={COLORS.secondaryText}
                value={form.pocName}
                onChangeText={set('pocName')}
              />

              <Text style={styles.label}>Company/Group Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Organisation / group name"
                placeholderTextColor={COLORS.secondaryText}
                value={form.groupName}
                onChangeText={set('groupName')}
              />

              <Text style={styles.label}>Contact Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact Email"
                placeholderTextColor={COLORS.secondaryText}
                value={form.pocEmail}
                onChangeText={set('pocEmail')}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact Phone"
                placeholderTextColor={COLORS.secondaryText}
                value={form.pocPhone}
                onChangeText={set('pocPhone')}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Client Type</Text>
              <View style={styles.chipRow}>
                {CLIENT_TYPES.map((type) => {
                  const isActive = form.clientType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => set('clientType')(type)}
                      style={[styles.chip, isActive && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{type}</Text>
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

function ActionSheet({ visible, client, onClose, onEdit, onDelete }) {
  if (!client) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.actionSheet}>
          <View style={styles.sheetHandle} />

          {/* Mini profile in action sheet header */}
          <View style={styles.actionSheetProfile}>
            <ClientAvatar name={client.pocName} size={48} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.actionSheetTitle} numberOfLines={1}>
                {client.pocName || 'Client'}
              </Text>
              {client.groupName ? (
                <Text style={styles.actionSheetSub} numberOfLines={1}>
                  {client.groupName}
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity style={styles.actionItem} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.actionItemText, { color: COLORS.primary }]}>Edit Client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionItemText, { color: COLORS.danger }]}>Delete Client</Text>
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

export default function ClientsScreen() {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [clients, setClients] = useState([]);
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
  const hasMore = clients.length < totalCount;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchClients = useCallback(
    async ({ pageNum = 1, search = searchTerm, replace = false } = {}) => {
      if (!branchId) return;
      try {
        if (replace) setLoading(true);
        else if (pageNum > 1) setLoadingMore(true);

        const res = await api.get(
          `/clients/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data || [];
        const total = res.data?.status?.totalCount || 0;

        setTotalCount(total);
        setClients((prev) => (replace || pageNum === 1 ? items : [...prev, ...items]));
        setPage(pageNum);
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load clients.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [branchId, searchTerm]
  );

  useEffect(() => {
    fetchClients({ pageNum: 1, replace: true });
  }, [branchId]);

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearchChange = (text) => {
    setSearchInput(text);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchTerm(text);
      fetchClients({ pageNum: 1, search: text, replace: true });
    }, 500);
  };

  // ── Refresh / Load More ───────────────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients({ pageNum: 1, search: searchTerm, replace: true });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchClients({ pageNum: page + 1, search: searchTerm });
    }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      await api.post('/clients/add', { ...payload, branchId });
      setFormVisible(false);
      fetchClients({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to add client.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (payload) => {
    try {
      setSaving(true);
      await api.put(`/clients/update/${editTarget.clientId}`, payload);
      setFormVisible(false);
      setEditTarget(null);
      fetchClients({ pageNum: 1, replace: true });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update client.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (client) => {
    setActionVisible(false);
    Alert.alert(
      'Delete Client',
      `Delete "${client.pocName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/clients/delete/${client.clientId}`);
              fetchClients({ pageNum: 1, replace: true });
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
    <ClientCard
      client={item}
      onLongPress={(c) => {
        setActionTarget(c);
        setActionVisible(true);
      }}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="business-outline" size={56} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Clients Found</Text>
        <Text style={styles.emptySubtitle}>
          {searchTerm ? 'Try a different search term.' : 'Tap + to add your first client.'}
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
        <Text style={styles.headerTitle}>Clients</Text>
        <Text style={styles.headerCount}>{totalCount} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients…"
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
          data={clients}
          keyExtractor={(item) => String(item.clientId)}
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
      <ClientFormModal
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
        client={actionTarget}
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
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
  },
  cardContacts: {
    gap: 5,
    marginBottom: 6,
  },
  cardContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardContactText: {
    fontSize: 13,
    color: COLORS.secondaryText,
    flex: 1,
  },
  cardHint: {
    fontSize: 11,
    color: COLORS.border,
    marginTop: 4,
  },
  clientTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignSelf: 'flex-start',
  },
  clientTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  chipTextActive: {
    color: '#fff',
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
  // Action Sheet
  actionSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  actionSheetProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  actionSheetSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
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
