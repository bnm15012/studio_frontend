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

// Map activityType → accent color (matches web theme)
const TYPE_COLORS = {
  YOGA:           '#6366f1',
  ZUMBA:          '#a855f7',
  GYM:            '#6b7280',
  DANCE:          '#ef4444',
  BACHATA:        '#10b981',
  SAMBA:          '#f59e0b',
  SOCA:           '#3b82f6',
  HIP_HOP:        '#ef4444',
  BHANGRA:        '#6366f1',
  MARTIAL_ARTS:   '#10b981',
  BOLLYHOP:       '#a855f7',
  GYMNASTICS:     '#3b82f6',
  KATHAK:         '#f59e0b',
  BHARATNATYAM:   '#ef4444',
  FREESTYLE:      '#6366f1',
  SEMI_CLASSICAL: '#10b981',
  DEFAULT:        COLORS.primary,
};

// Map activityType → Ionicon name (mirrors web MUI icons)
const TYPE_ICONS = {
  YOGA:           'body-outline',
  ZUMBA:          'walk-outline',
  GYM:            'barbell-outline',
  DANCE:          'musical-notes-outline',
  BACHATA:        'footsteps-outline',
  SAMBA:          'people-outline',
  SOCA:           'musical-note-outline',
  HIP_HOP:        'headset-outline',
  BHANGRA:        'people-circle-outline',
  MARTIAL_ARTS:   'hand-right-outline',
  BOLLYHOP:       'videocam-outline',
  GYMNASTICS:     'walk-outline',
  KATHAK:         'hand-left-outline',
  BHARATNATYAM:   'star-outline',
  FREESTYLE:      'happy-outline',
  SEMI_CLASSICAL: 'sparkles-outline',
  DEFAULT:        'fitness-outline',
};

function typeColor(type) {
  return TYPE_COLORS[type] ?? TYPE_COLORS.DEFAULT;
}

function typeIcon(type) {
  return TYPE_ICONS[type] ?? TYPE_ICONS.DEFAULT;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getActivityInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function FormField({ label, error, multiline, ...inputProps }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, multiline && styles.inputMulti]}
        placeholderTextColor={COLORS.secondaryText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ─── Add Activity Modal ───────────────────────────────────────────────────────
const EMPTY_ADD = { name: '', description: '', activityType: '', maxCapacity: '' };

function AddActivityModal({ visible, onClose, onSuccess, branchId }) {
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
    if (!form.name.trim()) next.name = 'Activity name is required';
    if (form.maxCapacity && isNaN(Number(form.maxCapacity)))
      next.maxCapacity = 'Must be a number';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/activities/add', {
        name: form.name.trim(),
        description: form.description.trim() || null,
        activityType: form.activityType.trim() || null,
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
        branchId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to add activity');
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
              <Text style={styles.modalTitle}>Add New Activity</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormField
                label="Activity Name *"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                placeholder="e.g. Morning Yoga"
                error={errors.name}
              />
              <FormField
                label="Description"
                value={form.description}
                onChangeText={(v) => setField('description', v)}
                placeholder="Brief description of the activity"
                multiline
              />
              <FormField
                label="Activity Type"
                value={form.activityType}
                onChangeText={(v) => setField('activityType', v.toUpperCase())}
                placeholder="e.g. YOGA, DANCE, PILATES"
                autoCapitalize="characters"
              />
              <FormField
                label="Max Capacity"
                value={form.maxCapacity}
                onChangeText={(v) => setField('maxCapacity', v)}
                placeholder="e.g. 20"
                keyboardType="number-pad"
                error={errors.maxCapacity}
              />
              <TouchableOpacity
                style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Add Activity</Text>
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
const EMPTY_EDIT = { name: '', description: '', activityType: '', maxCapacity: '' };

function ActivityDetailSheet({ visible, activity, onClose, onDeleted, onUpdated }) {
  const [mode, setMode] = useState('view');
  const [form, setForm] = useState(EMPTY_EDIT);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible && activity) {
      setMode('view');
      setForm({
        name: activity.name ?? '',
        description: activity.description ?? '',
        activityType: activity.activityType ?? '',
        maxCapacity: activity.maxCapacity != null ? String(activity.maxCapacity) : '',
      });
      setErrors({});
    }
  }, [visible, activity]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Activity name is required';
    if (form.maxCapacity && isNaN(Number(form.maxCapacity)))
      next.maxCapacity = 'Must be a number';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleUpdate() {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.put(`/activities/update/${activity.activityId}`, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        activityType: form.activityType.trim() || null,
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
      });
      onUpdated();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to update activity');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete Activity',
      `Are you sure you want to delete "${activity?.name ?? 'this activity'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/activities/delete/${activity.activityId}`);
      onDeleted();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to delete activity');
      setDeleting(false);
    }
  }

  if (!activity) return null;

  const accentColor = typeColor(activity.activityType);

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
              <Text style={styles.modalTitle}>
                {mode === 'edit' ? 'Edit Activity' : 'Activity Details'}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {mode === 'view' ? (
                <>
                  {/* Activity Hero */}
                  <View style={styles.sheetProfile}>
                    <View style={[styles.sheetActivityIcon, { backgroundColor: accentColor + '22' }]}>
                      <Ionicons name={typeIcon(activity.activityType)} size={32} color={accentColor} />
                    </View>
                    <Text style={styles.sheetName}>{activity.activityType || activity.name}</Text>
                    {activity.activityType ? (
                      <View style={[styles.typeBadge, { backgroundColor: accentColor + '22' }]}>
                        <Text style={[styles.typeBadgeText, { color: accentColor }]}>
                          {activity.activityType}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Info */}
                  {activity.description ? (
                    <View style={styles.descriptionBox}>
                      <Text style={styles.descriptionLabel}>Description</Text>
                      <Text style={styles.descriptionText}>{activity.description}</Text>
                    </View>
                  ) : null}

                  <SheetInfoRow
                    icon="people-outline"
                    label="Max Capacity"
                    value={activity.maxCapacity != null ? `${activity.maxCapacity} students` : null}
                  />

                  {/* Batch entries */}
                  {activity.batchEntries?.length > 0 ? (
                    <View style={styles.batchSection}>
                      <Text style={styles.batchSectionTitle}>Batches ({activity.batchEntries.length})</Text>
                      {activity.batchEntries.map((b, i) => (
                        <View key={i} style={styles.batchRow}>
                          <View style={styles.batchRowLeft}>
                            <Text style={styles.batchName}>{b.name || b.batchName || `Batch ${i+1}`}</Text>
                            <Text style={styles.batchMeta}>
                              {[b.planType, b.daysPerWeek ? `${b.daysPerWeek}d/wk` : null].filter(Boolean).join(' · ')}
                            </Text>
                          </View>
                          <View style={styles.batchRowRight}>
                            {b.price != null ? <Text style={styles.batchPrice}>₹{b.price}</Text> : null}
                            {(b.startTime || b.endTime) && (b.startTime !== '00:00' && b.endTime !== '00:00') ? (
                              <Text style={styles.batchTime}>{b.startTime}–{b.endTime}</Text>
                            ) : null}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {/* Actions */}
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
                    label="Activity Name *"
                    value={form.name}
                    onChangeText={(v) => setField('name', v)}
                    placeholder="e.g. Morning Yoga"
                    error={errors.name}
                  />
                  <FormField
                    label="Description"
                    value={form.description}
                    onChangeText={(v) => setField('description', v)}
                    placeholder="Brief description"
                    multiline
                  />
                  <FormField
                    label="Activity Type"
                    value={form.activityType}
                    onChangeText={(v) => setField('activityType', v.toUpperCase())}
                    placeholder="e.g. YOGA, DANCE"
                    autoCapitalize="characters"
                  />
                  <FormField
                    label="Max Capacity"
                    value={form.maxCapacity}
                    onChangeText={(v) => setField('maxCapacity', v)}
                    placeholder="e.g. 20"
                    keyboardType="number-pad"
                    error={errors.maxCapacity}
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
  if (!value && value !== 0) return null;
  return (
    <View style={styles.sheetInfoRow}>
      <Ionicons name={icon} size={16} color={COLORS.primary} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.sheetInfoLabel}>{label}</Text>
        <Text style={styles.sheetInfoValue}>{String(value)}</Text>
      </View>
    </View>
  );
}

// ─── Activity Card ────────────────────────────────────────────────────────────
function ActivityCard({ activity, onPress }) {
  const accentColor = typeColor(activity.activityType);
  // API returns activityType as the primary name
  const displayName = activity.activityType || activity.name || 'Activity';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Icon */}
      <View style={[styles.activityIconBox, { backgroundColor: accentColor + '22' }]}>
        <Ionicons name={typeIcon(activity.activityType)} size={22} color={accentColor} />
      </View>

      {/* Info */}
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>
          {displayName}
        </Text>
        {activity.description ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {activity.description}
          </Text>
        ) : null}
        <View style={styles.cardMeta}>
          {activity.maxCapacity != null ? (
            <Text style={styles.capacityText}>
              <Ionicons name="people-outline" size={11} color={COLORS.secondaryText} />{' '}
              {activity.maxCapacity} capacity
            </Text>
          ) : null}
          {activity.batchEntries?.length > 0 ? (
            <Text style={styles.capacityText}>
              <Ionicons name="layers-outline" size={11} color={COLORS.secondaryText} />{' '}
              {activity.batchEntries.length} {activity.batchEntries.length === 1 ? 'batch' : 'batches'}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={16} color={COLORS.secondaryText} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ActivitiesScreen({ navigation }) {
  const branchId = useSelector((state) => state.auth.currentBranch?.branchId);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailSheetVisible, setDetailSheetVisible] = useState(false);

  const debounceTimer = useRef(null);
  const searchRef = useRef('');
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const activitiesLenRef = useRef(0);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchActivities = useCallback(
    async ({ pageNum = 1, search = '', append = false } = {}) => {
      if (!branchId) return;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const res = await api.get(
          `/activities/getAll/${branchId}?search=${encodeURIComponent(search)}&page=${pageNum}&limit=${PAGE_SIZE}`
        );
        const items = res.data?.data ?? [];
        const total = res.data?.status?.totalCount ?? 0;

        setActivities((prev) => {
          const next = append ? [...prev, ...items] : items;
          activitiesLenRef.current = next.length;
          return next;
        });

        const fetched = append ? activitiesLenRef.current : items.length;
        const more = fetched < total;
        setHasMore(more);
        hasMoreRef.current = more;
        setPage(pageNum);
        pageRef.current = pageNum;
      } catch (err) {
        setError(err?.response?.data?.status?.statusMessage ?? 'Failed to load activities');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [branchId]
  );

  useEffect(() => {
    fetchActivities({ pageNum: 1, search: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // ── Search (debounced) ────────────────────────────────────────────────────
  function handleSearchChange(text) {
    setSearchTerm(text);
    searchRef.current = text;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      hasMoreRef.current = true;
      fetchActivities({ pageNum: 1, search: text, append: false });
    }, 400);
  }

  // ── Pull to refresh ───────────────────────────────────────────────────────
  function handleRefresh() {
    setRefreshing(true);
    hasMoreRef.current = true;
    fetchActivities({ pageNum: 1, search: searchRef.current, append: false });
  }

  // ── Load more ─────────────────────────────────────────────────────────────
  function handleEndReached() {
    if (loadingMore || !hasMoreRef.current) return;
    fetchActivities({ pageNum: pageRef.current + 1, search: searchRef.current, append: true });
  }

  // ── Open detail ───────────────────────────────────────────────────────────
  function openDetail(activity) {
    setSelectedActivity(activity);
    setDetailSheetVisible(true);
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  function renderItem({ item }) {
    return <ActivityCard activity={item} onPress={() => openDetail(item)} />;
  }

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={styles.centered}>
        <Ionicons name="fitness-outline" size={48} color={COLORS.secondaryText} />
        <Text style={styles.emptyText}>{error ? error : 'No activities found'}</Text>
        {error && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchActivities({ pageNum: 1, search: searchRef.current })}
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
        <Text style={styles.headerTitle}>Activities</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities…"
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
          data={activities}
          keyExtractor={(item) => String(item.activityId)}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, activities.length === 0 && styles.listEmpty]}
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
      <AddActivityModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={() => fetchActivities({ pageNum: 1, search: searchRef.current })}
        branchId={branchId}
      />

      {/* Detail / Edit / Delete Sheet */}
      <ActivityDetailSheet
        visible={detailSheetVisible}
        activity={selectedActivity}
        onClose={() => {
          setDetailSheetVisible(false);
          setSelectedActivity(null);
        }}
        onDeleted={() => fetchActivities({ pageNum: 1, search: searchRef.current })}
        onUpdated={() => fetchActivities({ pageNum: 1, search: searchRef.current })}
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
  activityIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  cardDescription: {
    fontSize: 12,
    color: COLORS.secondaryText,
    lineHeight: 17,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  capacityText: {
    fontSize: 12,
    color: COLORS.secondaryText,
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
    maxHeight: '92%',
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    flexShrink: 1,
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
  sheetActivityIcon: {
    width: 70,
    height: 70,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sheetName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },

  // Description box
  descriptionBox: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Sheet info row
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

  // Sheet actions
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
  inputMulti: {
    minHeight: 80,
    textAlignVertical: 'top',
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

  // Batch entries in detail sheet
  batchSection: {
    marginTop: 12,
    marginBottom: 4,
  },
  batchSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  batchRowLeft: { flex: 1 },
  batchRowRight: { alignItems: 'flex-end' },
  batchName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  batchMeta: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  batchPrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  batchTime: { fontSize: 11, color: COLORS.secondaryText, marginTop: 2 },
});
