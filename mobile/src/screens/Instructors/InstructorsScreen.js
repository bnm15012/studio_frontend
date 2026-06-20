import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
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
  border: '#e5e7eb',
};

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function StatusBadge({ status }) {
  const active = status === 'ACTIVE';
  return (
    <View style={[styles.badge, { backgroundColor: active ? '#d1fae5' : '#fee2e2' }]}>
      <Text style={[styles.badgeText, { color: active ? COLORS.success : COLORS.danger }]}>
        {status ?? 'UNKNOWN'}
      </Text>
    </View>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function FormField({ label, error, ...inputProps }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={COLORS.secondaryText}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ─── Add Instructor Modal ─────────────────────────────────────────────────────
const EMPTY_ADD = { name: '', email: '', phone: '', specialization: '', dob: '', address: '', emergencyContactNumber: '' };

function AddInstructorModal({ visible, onClose, onSuccess, branchId }) {
  const [form, setForm] = useState(EMPTY_ADD);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible) {
      setForm(EMPTY_ADD);
      setErrors({});
    }
  }, [visible]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/instructors/add', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialization: form.specialization.trim() || null,
        dob: form.dob.trim() || null,
        address: form.address.trim() || null,
        emergencyContactNumber: form.emergencyContactNumber.trim() || null,
        branchId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to add instructor');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalSheetWrapper}
        >
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Instructor</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormField
                label="Full Name *"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                placeholder="e.g. John Smith"
                error={errors.name}
              />
              <FormField
                label="Email *"
                value={form.email}
                onChangeText={(v) => setField('email', v)}
                placeholder="john@studio.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
              <FormField
                label="Phone *"
                value={form.phone}
                onChangeText={(v) => setField('phone', v)}
                placeholder="+1 555 000 0000"
                keyboardType="phone-pad"
                error={errors.phone}
              />
              <FormField
                label="Date of Birth"
                value={form.dob}
                onChangeText={(v) => setField('dob', v)}
                placeholder="YYYY-MM-DD"
              />
              <FormField
                label="Address"
                value={form.address}
                onChangeText={(v) => setField('address', v)}
                placeholder="Street, City"
                multiline
              />
              <FormField
                label="Emergency Contact"
                value={form.emergencyContactNumber}
                onChangeText={(v) => setField('emergencyContactNumber', v)}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
              <FormField
                label="Specialization"
                value={form.specialization}
                onChangeText={(v) => setField('specialization', v)}
                placeholder="e.g. Yoga, Pilates, Dance"
              />
              <TouchableOpacity
                style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Add Instructor</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Detail / Edit / Delete Bottom Sheet ─────────────────────────────────────
const EMPTY_EDIT = { name: '', email: '', phone: '', specialization: '', dob: '', address: '', emergencyContactNumber: '' };

function InstructorDetailSheet({ visible, instructor, onClose, onDeleted, onUpdated }) {
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [form, setForm] = useState(EMPTY_EDIT);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible && instructor) {
      setMode('view');
      setForm({
        name: instructor.name ?? '',
        email: instructor.email ?? '',
        phone: instructor.phone ?? '',
        specialization: instructor.specialization ?? '',
        dob: instructor.dob ?? '',
        address: instructor.address ?? '',
        emergencyContactNumber: String(instructor.emergencyContactNumber ?? ''),
      });
      setErrors({});
    }
  }, [visible, instructor]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleUpdate() {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.put(`/instructors/update/${instructor.instructorId}`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialization: form.specialization.trim() || null,
        dob: form.dob.trim() || null,
        address: form.address.trim() || null,
        emergencyContactNumber: form.emergencyContactNumber.trim() || null,
        branchId: instructor.branchId,
      });
      onUpdated();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to update instructor');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete Instructor',
      `Are you sure you want to delete ${instructor?.name ?? 'this instructor'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/instructors/delete/${instructor.instructorId}`);
      onDeleted();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to delete instructor');
      setDeleting(false);
    }
  }

  if (!instructor) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalSheetWrapper}
        >
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            {/* Sheet Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'edit' ? 'Edit Instructor' : 'Instructor Details'}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {mode === 'view' ? (
                <>
                  {/* Avatar + Name */}
                  <View style={styles.sheetProfile}>
                    <View style={styles.sheetAvatar}>
                      <Text style={styles.sheetAvatarText}>{getInitials(instructor.name)}</Text>
                    </View>
                    <Text style={styles.sheetName}>{instructor.name}</Text>
                    <StatusBadge status={instructor.instructorStatus} />
                  </View>

                  {/* Info rows */}
                  <SheetInfoRow icon="mail-outline" label="Email" value={instructor.email} />
                  <SheetInfoRow icon="call-outline" label="Phone" value={instructor.phone} />
                  <SheetInfoRow
                    icon="ribbon-outline"
                    label="Specialization"
                    value={instructor.specialization}
                  />

                  {/* Action buttons */}
                  <View style={styles.sheetActions}>
                    <TouchableOpacity
                      style={styles.editActionBtn}
                      onPress={() => setMode('edit')}
                    >
                      <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                      <Text style={styles.editActionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteActionBtn, deleting && { opacity: 0.6 }]}
                      onPress={confirmDelete}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <ActivityIndicator size="small" color={COLORS.danger} />
                      ) : (
                        <>
                          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                          <Text style={styles.deleteActionBtnText}>Delete</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <FormField
                    label="Full Name *"
                    value={form.name}
                    onChangeText={(v) => setField('name', v)}
                    placeholder="e.g. John Smith"
                    error={errors.name}
                  />
                  <FormField
                    label="Email *"
                    value={form.email}
                    onChangeText={(v) => setField('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="john@studio.com"
                    error={errors.email}
                  />
                  <FormField
                    label="Phone *"
                    value={form.phone}
                    onChangeText={(v) => setField('phone', v)}
                    keyboardType="phone-pad"
                    placeholder="+1 555 000 0000"
                    error={errors.phone}
                  />
                  <FormField
                    label="Date of Birth"
                    value={form.dob}
                    onChangeText={(v) => setField('dob', v)}
                    placeholder="YYYY-MM-DD"
                  />
                  <FormField
                    label="Address"
                    value={form.address}
                    onChangeText={(v) => setField('address', v)}
                    placeholder="Street, City"
                    multiline
                  />
                  <FormField
                    label="Emergency Contact"
                    value={form.emergencyContactNumber}
                    onChangeText={(v) => setField('emergencyContactNumber', v)}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                  />
                  <FormField
                    label="Specialization"
                    value={form.specialization}
                    onChangeText={(v) => setField('specialization', v)}
                    placeholder="e.g. Yoga, Pilates"
                  />
                  <View style={styles.editBtnRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setMode('view')}
                      disabled={saving}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                      onPress={handleUpdate}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function SheetInfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.sheetInfoRow}>
      <Ionicons name={icon} size={16} color={COLORS.primary} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.sheetInfoLabel}>{label}</Text>
        <Text style={styles.sheetInfoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Instructor Card ──────────────────────────────────────────────────────────
function InstructorCard({ instructor, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(instructor.name)}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>
          {instructor.name}
        </Text>
        {instructor.specialization ? (
          <Text style={styles.cardSpecialization} numberOfLines={1}>
            {instructor.specialization}
          </Text>
        ) : null}
        {instructor.phone ? (
          <Text style={styles.cardSub} numberOfLines={1}>
            <Ionicons name="call-outline" size={12} color={COLORS.secondaryText} /> {instructor.phone}
          </Text>
        ) : null}
        {instructor.email ? (
          <Text style={styles.cardSub} numberOfLines={1}>
            <Ionicons name="mail-outline" size={12} color={COLORS.secondaryText} /> {instructor.email}
          </Text>
        ) : null}
      </View>
      <View style={styles.cardRight}>
        <StatusBadge status={instructor.instructorStatus} />
        <Ionicons name="chevron-forward" size={16} color={COLORS.secondaryText} style={{ marginTop: 8 }} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function InstructorsScreen({ navigation }) {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [detailSheetVisible, setDetailSheetVisible] = useState(false);

  const debounceTimer = useRef(null);
  const searchRef = useRef('');
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const instructorsLenRef = useRef(0);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchInstructors = useCallback(
    async ({ pageNum = 1, search = '', append = false } = {}) => {
      if (!branchId) return;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const res = await api.get(
          `/instructors/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data ?? [];
        const total = res.data?.status?.totalCount ?? 0;

        setInstructors((prev) => {
          const next = append ? [...prev, ...items] : items;
          instructorsLenRef.current = next.length;
          return next;
        });

        const fetched = append ? instructorsLenRef.current : items.length;
        const more = fetched < total;
        setHasMore(more);
        hasMoreRef.current = more;
        setPage(pageNum);
        pageRef.current = pageNum;
      } catch (err) {
        setError(err?.response?.data?.status?.statusMessage ?? 'Failed to load instructors');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [branchId]
  );

  useEffect(() => {
    fetchInstructors({ pageNum: 1, search: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // ── Search ────────────────────────────────────────────────────────────────
  function handleSearchChange(text) {
    setSearchTerm(text);
    searchRef.current = text;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      hasMoreRef.current = true;
      fetchInstructors({ pageNum: 1, search: text, append: false });
    }, 400);
  }

  // ── Pull to refresh ───────────────────────────────────────────────────────
  function handleRefresh() {
    setRefreshing(true);
    hasMoreRef.current = true;
    fetchInstructors({ pageNum: 1, search: searchRef.current, append: false });
  }

  // ── Load more ─────────────────────────────────────────────────────────────
  function handleEndReached() {
    if (loadingMore || !hasMoreRef.current) return;
    fetchInstructors({ pageNum: pageRef.current + 1, search: searchRef.current, append: true });
  }

  // ── Open detail sheet ────────────────────────────────────────────────────
  function openDetail(instructor) {
    setSelectedInstructor(instructor);
    setDetailSheetVisible(true);
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  function renderItem({ item }) {
    return <InstructorCard instructor={item} onPress={() => openDetail(item)} />;
  }

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={styles.centered}>
        <Ionicons name="person-outline" size={48} color={COLORS.secondaryText} />
        <Text style={styles.emptyText}>{error ? error : 'No instructors found'}</Text>
        {error && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchInstructors({ pageNum: 1, search: searchRef.current })}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderFooter() {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instructors</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search instructors…"
          placeholderTextColor={COLORS.secondaryText}
          value={searchTerm}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* List */}
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={instructors}
          keyExtractor={(item) => String(item.instructorId)}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, instructors.length === 0 && styles.listEmpty]}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal */}
      <AddInstructorModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={() => fetchInstructors({ pageNum: 1, search: searchRef.current })}
        branchId={branchId}
      />

      {/* Detail/Edit/Delete Sheet */}
      <InstructorDetailSheet
        visible={detailSheetVisible}
        instructor={selectedInstructor}
        onClose={() => {
          setDetailSheetVisible(false);
          setSelectedInstructor(null);
        }}
        onDeleted={() => fetchInstructors({ pageNum: 1, search: searchRef.current })}
        onUpdated={() => fetchInstructors({ pageNum: 1, search: searchRef.current })}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#db2777',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardSpecialization: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // States
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  // Modal / Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheetWrapper: {
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Sheet profile
  sheetProfile: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sheetAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sheetAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#db2777',
  },
  sheetName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  sheetInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetInfoLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sheetInfoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    marginTop: 2,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
  },
  editActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: '#eef2ff',
  },
  editActionBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  deleteActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    backgroundColor: '#fef2f2',
  },
  deleteActionBtnText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 15,
  },

  // Form
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  fieldError: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
  },
  editBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.65,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
