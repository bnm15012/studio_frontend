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

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'NOT_TO_SAY'];

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

// ─── Add-Student Modal ────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', email: '', phone: '', dob: '', gender: '', address: '' };

function AddStudentModal({ visible, onClose, onSuccess, branchId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset when opened
  useEffect(() => {
    if (visible) {
      setForm(EMPTY_FORM);
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
      await api.post('/students/add', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dob: form.dob.trim() || null,
        gender: form.gender || null,
        address: form.address.trim() || null,
        branchId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to add student');
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
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Student</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormField
                label="Full Name *"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                placeholder="e.g. Jane Doe"
                error={errors.name}
              />
              <FormField
                label="Email *"
                value={form.email}
                onChangeText={(v) => setField('email', v)}
                placeholder="jane@example.com"
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

              {/* Gender picker */}
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderChip,
                      form.gender === g && styles.genderChipActive,
                    ]}
                    onPress={() => setField('gender', g)}
                  >
                    <Text
                      style={[
                        styles.genderChipText,
                        form.gender === g && styles.genderChipTextActive,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FormField
                label="Address"
                value={form.address}
                onChangeText={(v) => setField('address', v)}
                placeholder="Street, City"
                multiline
              />

              <TouchableOpacity
                style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Add Student</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Edit-Student Modal ───────────────────────────────────────────────────────
function EditStudentModal({ visible, student, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill whenever the student prop changes
  useEffect(() => {
    if (visible && student) {
      setForm({
        name: student.name ?? '',
        email: student.email ?? '',
        phone: student.phone ?? '',
        dob: student.dob ?? '',
        gender: student.gender ?? '',
      });
      setErrors({});
    }
  }, [visible, student]);

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
      await api.put(`/students/update/${student.studentId}`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dob: form.dob.trim() || null,
        gender: form.gender || null,
        branchId: student.branchId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to update student');
    } finally {
      setSaving(false);
    }
  }

  if (!student) return null;

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
              <Text style={styles.modalTitle}>Edit Student</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormField
                label="Full Name *"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                placeholder="e.g. Jane Doe"
                error={errors.name}
              />
              <FormField
                label="Email *"
                value={form.email}
                onChangeText={(v) => setField('email', v)}
                placeholder="jane@example.com"
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
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderChip, form.gender === g && styles.genderChipActive]}
                    onPress={() => setField('gender', g)}
                  >
                    <Text style={[styles.genderChipText, form.gender === g && styles.genderChipTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

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

// ─── Student Card ─────────────────────────────────────────────────────────────
function StudentCard({ student, onPress, onEdit, onDelete }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(student.name)}</Text>
      </View>

      {/* Info */}
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>
          {student.name}
        </Text>
        {student.phone ? (
          <Text style={styles.cardSub} numberOfLines={1}>
            <Ionicons name="call-outline" size={12} color={COLORS.secondaryText} /> {student.phone}
          </Text>
        ) : null}
        {student.email ? (
          <Text style={styles.cardSub} numberOfLines={1}>
            <Ionicons name="mail-outline" size={12} color={COLORS.secondaryText} /> {student.email}
          </Text>
        ) : null}
      </View>

      {/* Status + actions */}
      <View style={styles.cardRight}>
        <StatusBadge status={student.membershipStatus} />
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={onEdit}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={styles.cardActionBtn}
          >
            <Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={styles.cardActionBtn}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function StudentsScreen({ navigation }) {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState(null); // student object being edited

  const debounceTimer = useRef(null);
  const searchRef = useRef('');
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchStudents = useCallback(
    async ({ pageNum = 1, search = '', append = false } = {}) => {
      if (!branchId) return;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const res = await api.get(
          `/students/getAll/${branchId}?page=${pageNum}&size=${PAGE_SIZE}&searchTerm=${encodeURIComponent(search)}`
        );
        const items = res.data?.data ?? [];
        const total = res.data?.status?.totalCount ?? 0;

        setStudents((prev) => (append ? [...prev, ...items] : items));

        const fetched = append ? students.length + items.length : items.length;
        const more = fetched < total;
        setHasMore(more);
        hasMoreRef.current = more;
        setPage(pageNum);
        pageRef.current = pageNum;
      } catch (err) {
        setError(err?.response?.data?.status?.statusMessage ?? 'Failed to load students');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [branchId, students.length]
  );

  // Initial load
  useEffect(() => {
    fetchStudents({ pageNum: 1, search: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // ── Search (debounced 400ms) ──────────────────────────────────────────────
  function handleSearchChange(text) {
    setSearchTerm(text);
    searchRef.current = text;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setHasMore(true);
      hasMoreRef.current = true;
      fetchStudents({ pageNum: 1, search: text, append: false });
    }, 400);
  }

  // ── Pull to refresh ───────────────────────────────────────────────────────
  function handleRefresh() {
    setRefreshing(true);
    setHasMore(true);
    hasMoreRef.current = true;
    fetchStudents({ pageNum: 1, search: searchRef.current, append: false });
  }

  // ── Load more on scroll end ───────────────────────────────────────────────
  function handleEndReached() {
    if (loadingMore || !hasMoreRef.current) return;
    const nextPage = pageRef.current + 1;
    fetchStudents({ pageNum: nextPage, search: searchRef.current, append: true });
  }

  // ── Delete handler ────────────────────────────────────────────────────────
  function handleDelete(student) {
    const doDelete = async () => {
      try {
        await api.delete(`/students/delete/${student.studentId}`);
        fetchStudents({ pageNum: 1, search: searchRef.current });
      } catch (err) {
        Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to delete student');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete ${student.name}? This cannot be undone.`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Student',
        `Are you sure you want to delete ${student.name}? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  function renderItem({ item }) {
    return (
      <StudentCard
        student={item}
        onPress={() => navigation.navigate('StudentDetail', { studentId: item.studentId })}
        onEdit={() => setEditStudent(item)}
        onDelete={() => handleDelete(item)}
      />
    );
  }

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={styles.centered}>
        <Ionicons name="people-outline" size={48} color={COLORS.secondaryText} />
        <Text style={styles.emptyText}>
          {error ? error : 'No students found'}
        </Text>
        {error && (
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchStudents({ pageNum: 1, search: searchRef.current })}>
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

  // ── Render ────────────────────────────────────────────────────────────────
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
        <Text style={styles.headerTitle}>Students</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students…"
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
          data={students}
          keyExtractor={(item) => String(item.studentId)}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, students.length === 0 && styles.listEmpty]}
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
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Student Modal */}
      <AddStudentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => fetchStudents({ pageNum: 1, search: searchRef.current })}
        branchId={branchId}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        visible={!!editStudent}
        student={editStudent}
        onClose={() => setEditStudent(null)}
        onSuccess={() => fetchStudents({ pageNum: 1, search: searchRef.current })}
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
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
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
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  cardActionBtn: {
    padding: 4,
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
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  genderChipActive: {
    backgroundColor: '#e0e7ff',
    borderColor: COLORS.primary,
  },
  genderChipText: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  genderChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
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
