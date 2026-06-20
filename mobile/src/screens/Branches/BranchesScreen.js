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
  TextInput,
  Modal,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

// ─── Access Rights ────────────────────────────────────────────────────────────
const ACCESS_MODULES = {
  activity: 'Activity',
  communication: 'Communication',
  payments: 'Payments',
  expense: 'Expense',
  analysis: 'Analysis',
  reports: 'Reports',
  enquiry: 'Enquiry',
};

// ─── Manager Access Modal ─────────────────────────────────────────────────────
function ManagerAccessModal({ visible, manager, onClose, onSave }) {
  const [access, setAccess] = useState({});

  useEffect(() => {
    if (visible) {
      const init = {};
      if (manager?.userAccessEntry) {
        Object.assign(init, manager.userAccessEntry);
      } else {
        Object.keys(ACCESS_MODULES).forEach((k) => { init[k] = 'NONE'; });
      }
      setAccess(init);
    }
  }, [visible, manager]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalSheetWrapper}>
          <View style={styles.formSheet}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Access Rights</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>
            <Text style={styles.accessSubtitle}>{manager?.userName ?? ''}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.entries(ACCESS_MODULES).map(([key, label]) => (
                <View key={key} style={styles.accessRow}>
                  <Text style={styles.accessLabel}>{label}</Text>
                  <Switch
                    value={access[key] === 'FULL'}
                    onValueChange={(v) => setAccess((prev) => ({ ...prev, [key]: v ? 'FULL' : 'NONE' }))}
                    trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
                    thumbColor={access[key] === 'FULL' ? COLORS.primary : '#f4f3f4'}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.formActions}>
              <TouchableOpacity onPress={onClose} style={[styles.formBtn, styles.cancelBtn]}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onSave(access)} style={[styles.formBtn, styles.saveBtn]}>
                <Text style={styles.saveBtnText}>Save Access</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Manager Form Modal ───────────────────────────────────────────────────────
const EMPTY_MGR = { userName: '', email: '', phone: '', password: '123456' };

function ManagerFormModal({ visible, manager, branch, studioId, onClose, onSaved }) {
  const isEdit = !!manager;
  const [form, setForm] = useState(EMPTY_MGR);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(isEdit ? {
        userName: manager.userName ?? '',
        email: manager.email ?? '',
        phone: String(manager.phone ?? ''),
        password: '',
      } : EMPTY_MGR);
    }
  }, [visible, manager]);

  function setField(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSave() {
    if (!form.userName.trim()) { Alert.alert('Validation', 'Username is required.'); return; }
    if (!form.email.trim()) { Alert.alert('Validation', 'Email is required.'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/users/update/${manager.userId}`, {
          userName: form.userName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          studioEntry: { studioId, branchList: [{ branchId: branch.branchId }] },
        });
      } else {
        await api.post('/users/add', {
          userName: form.userName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          password: form.password || '123456',
          enabled: true,
          studioEntry: { studioId, branchList: [{ branchId: branch.branchId }] },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to save manager.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalSheetWrapper}>
          <View style={styles.formSheet}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{isEdit ? 'Edit Manager' : 'Add Manager'}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={COLORS.secondaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Username *</Text>
              <TextInput style={styles.input} placeholder="e.g. john_doe" placeholderTextColor={COLORS.secondaryText}
                value={form.userName} onChangeText={(v) => setField('userName', v)} autoCapitalize="none" />
              <Text style={styles.fieldLabel}>Email *</Text>
              <TextInput style={styles.input} placeholder="manager@email.com" placeholderTextColor={COLORS.secondaryText}
                value={form.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" />
              <Text style={styles.fieldLabel}>Phone</Text>
              <TextInput style={styles.input} placeholder="Phone number" placeholderTextColor={COLORS.secondaryText}
                value={form.phone} onChangeText={(v) => setField('phone', v)} keyboardType="phone-pad" />
              {!isEdit && (
                <>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TextInput style={styles.input} placeholder="Default: 123456" placeholderTextColor={COLORS.secondaryText}
                    value={form.password} onChangeText={(v) => setField('password', v)} secureTextEntry />
                </>
              )}
            </ScrollView>
            <View style={styles.formActions}>
              <TouchableOpacity onPress={onClose} style={[styles.formBtn, styles.cancelBtn]}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.formBtn, styles.saveBtn]} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>{isEdit ? 'Update' : 'Add'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Managers Screen Modal ────────────────────────────────────────────────────
function ManagersModal({ visible, branch, studioId, onClose }) {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMgr, setEditingMgr] = useState(null);
  const [accessMgr, setAccessMgr] = useState(null);
  const [savingAccess, setSavingAccess] = useState(false);

  const fetchManagers = useCallback(async (isRefresh = false) => {
    if (!branch?.branchId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await api.get(`/users/getAll/${branch.branchId}`);
      setManagers(res.data?.data ?? []);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load managers.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [branch?.branchId]);

  useEffect(() => {
    if (visible) fetchManagers();
  }, [visible, fetchManagers]);

  async function handleToggleEnabled(mgr) {
    try {
      await api.put(`/users/update/${mgr.userId}`, {
        ...mgr,
        enabled: !mgr.enabled,
        studioEntry: { studioId, branchList: [{ branchId: branch.branchId }] },
      });
      setManagers((prev) => prev.map((m) => m.userId === mgr.userId ? { ...m, enabled: !m.enabled } : m));
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update.');
    }
  }

  async function handleSaveAccess(accessState) {
    if (!accessMgr) return;
    setSavingAccess(true);
    try {
      await api.put(`/users/update/${accessMgr.userId}`, {
        ...accessMgr,
        userAccessEntry: accessState,
        studioEntry: { studioId, branchList: [{ branchId: branch.branchId }] },
      });
      setManagers((prev) => prev.map((m) => m.userId === accessMgr.userId ? { ...m, userAccessEntry: accessState } : m));
      setAccessMgr(null);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to save access rights.');
    } finally {
      setSavingAccess(false);
    }
  }

  function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.screenTitle}>Managers</Text>
            {branch?.name ? <Text style={styles.headerCount}>{branch.name}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.addMgrBtn}
            onPress={() => { setEditingMgr(null); setShowForm(true); }}
          >
            <Ionicons name="person-add-outline" size={16} color="#fff" />
            <Text style={styles.addMgrBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
        ) : (
          <FlatList
            data={managers}
            keyExtractor={(m) => String(m.userId)}
            contentContainerStyle={managers.length === 0 ? styles.emptyContainer : styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchManagers(true)} tintColor={COLORS.primary} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={COLORS.secondaryText} />
                <Text style={styles.emptyText}>No managers yet.</Text>
                <TouchableOpacity style={styles.emptyAddBtn} onPress={() => { setEditingMgr(null); setShowForm(true); }}>
                  <Text style={styles.emptyAddBtnText}>Add First Manager</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.mgrCard}>
                <View style={styles.mgrCardTop}>
                  <View style={styles.mgrAvatar}>
                    <Text style={styles.mgrAvatarText}>{getInitials(item.userName)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mgrName}>{item.userName}</Text>
                    {item.email ? <Text style={styles.mgrMeta}>{item.email}</Text> : null}
                    {item.phone ? <Text style={styles.mgrMeta}>{item.phone}</Text> : null}
                  </View>
                  <View style={[styles.activeBadge, item.enabled ? styles.activeBadgeOn : styles.activeBadgeOff]}>
                    <Text style={[styles.activeBadgeText, item.enabled ? styles.activeBadgeTextOn : styles.activeBadgeTextOff]}>
                      {item.enabled ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                {/* Access rights summary */}
                {item.userAccessEntry ? (
                  <View style={styles.accessChipsRow}>
                    {Object.entries(ACCESS_MODULES)
                      .filter(([k]) => item.userAccessEntry[k] === 'FULL')
                      .map(([k, label]) => (
                        <View key={k} style={styles.accessChip}>
                          <Text style={styles.accessChipText}>{label}</Text>
                        </View>
                      ))}
                  </View>
                ) : null}
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionChip} onPress={() => handleToggleEnabled(item)}>
                    <Ionicons name={item.enabled ? 'pause-circle-outline' : 'play-circle-outline'} size={15}
                      color={item.enabled ? COLORS.danger : COLORS.success} />
                    <Text style={[styles.actionChipText, { color: item.enabled ? COLORS.danger : COLORS.success }]}>
                      {item.enabled ? 'Disable' : 'Enable'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionChip} onPress={() => { setEditingMgr(item); setShowForm(true); }}>
                    <Ionicons name="pencil-outline" size={15} color={COLORS.primary} />
                    <Text style={[styles.actionChipText, { color: COLORS.primary }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionChip} onPress={() => setAccessMgr(item)}>
                    <Ionicons name="shield-checkmark-outline" size={15} color={COLORS.primary} />
                    <Text style={[styles.actionChipText, { color: COLORS.primary }]}>Access</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <ManagerFormModal
          visible={showForm}
          manager={editingMgr}
          branch={branch}
          studioId={studioId}
          onClose={() => setShowForm(false)}
          onSaved={() => fetchManagers()}
        />
        <ManagerAccessModal
          visible={!!accessMgr}
          manager={accessMgr}
          onClose={() => setAccessMgr(null)}
          onSave={handleSaveAccess}
        />
      </SafeAreaView>
    </Modal>
  );
}

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

function BranchFormModal({ visible, branch, studioId, onClose, onSaved }) {
  const isEdit = !!branch;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (branch) {
      setName(branch.name ?? '');
      setAddress(branch.address ?? '');
      setCity(branch.city ?? '');
      setPhone(branch.phone ?? '');
    } else {
      setName(''); setAddress(''); setCity(''); setPhone('');
    }
  }, [branch, visible]);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Validation', 'Branch name is required.'); return; }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        address: address.trim() || null,
        city: city.trim() || null,
        phone: phone.trim() || null,
        studioId,
      };
      if (isEdit) {
        await api.put(`/branch/update/${branch.branchId}`, payload);
      } else {
        await api.post('/branch/add', payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to save branch.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formSheet}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{isEdit ? 'Edit Branch' : 'Add Branch'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
            <Text style={styles.fieldLabel}>Branch Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Main Branch"
              placeholderTextColor={COLORS.secondaryText}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              placeholderTextColor={COLORS.secondaryText}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor={COLORS.secondaryText}
              value={city}
              onChangeText={setCity}
            />

            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={COLORS.secondaryText}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </ScrollView>

          <View style={styles.formActions}>
            <TouchableOpacity onPress={onClose} style={[styles.formBtn, styles.cancelBtn]}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.formBtn, styles.saveBtn]} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>{isEdit ? 'Update' : 'Add Branch'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function BranchCard({ item, onEdit, onDelete, onToggle, onManagers, toggling }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrap}>
          <Ionicons name="business-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.branchName}>{item.name ?? item.branchName ?? '—'}</Text>
          {(item.address || item.city) ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color={COLORS.secondaryText} />
              <Text style={styles.locationText}>
                {[item.address, item.city].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
          {item.phone ? (
            <View style={styles.locationRow}>
              <Ionicons name="call-outline" size={13} color={COLORS.secondaryText} />
              <Text style={styles.locationText}>{item.phone}</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.activeBadge, item.isActive ? styles.activeBadgeOn : styles.activeBadgeOff]}>
          <Text style={[styles.activeBadgeText, item.isActive ? styles.activeBadgeTextOn : styles.activeBadgeTextOff]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {toggling ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <TouchableOpacity
            style={[styles.actionChip, item.isActive ? styles.disableChip : styles.enableChip]}
            onPress={() => onToggle(item)}
          >
            <Ionicons
              name={item.isActive ? 'pause-circle-outline' : 'play-circle-outline'}
              size={15}
              color={item.isActive ? COLORS.danger : COLORS.success}
            />
            <Text style={[styles.actionChipText, { color: item.isActive ? COLORS.danger : COLORS.success }]}>
              {item.isActive ? 'Disable' : 'Enable'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionChip} onPress={() => onEdit(item)}>
          <Ionicons name="pencil-outline" size={15} color={COLORS.primary} />
          <Text style={[styles.actionChipText, { color: COLORS.primary }]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionChip, styles.deleteChip]} onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
          <Text style={[styles.actionChipText, { color: COLORS.danger }]}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionChip, styles.managersChip]} onPress={() => onManagers(item)}>
          <Ionicons name="people-outline" size={15} color={COLORS.primary} />
          <Text style={[styles.actionChipText, { color: COLORS.primary }]}>Managers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function BranchesScreen() {
  const studio = useSelector((state) => state.auth.studio);
  const studioId = studio?.studioId;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [managersBranch, setManagersBranch] = useState(null);

  const fetchBranches = useCallback(async (isRefresh = false) => {
    if (!studioId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await api.get(`/branch/getAll/${studioId}`);
      setBranches(res.data?.data ?? []);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load branches.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studioId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleToggle = async (branch) => {
    setTogglingId(branch.branchId);
    try {
      const newActive = !branch.isActive;
      await api.put(`/branch/enableDisable/${branch.branchId}/${newActive}`);
      setBranches((prev) =>
        prev.map((b) => b.branchId === branch.branchId ? { ...b, isActive: newActive } : b)
      );
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to toggle branch status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = (branch) => {
    Alert.alert(
      'Delete Branch',
      `Are you sure you want to delete "${branch.name ?? branch.branchName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/branch/delete/${branch.branchId}`);
              setBranches((prev) => prev.filter((b) => b.branchId !== branch.branchId));
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to delete branch.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingBranch(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBranch(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Branches</Text>
        <Text style={styles.headerCount}>{branches.length} total</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={branches}
          keyExtractor={(item) => String(item.branchId)}
          renderItem={({ item }) => (
            <BranchCard
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onManagers={(b) => setManagersBranch(b)}
              toggling={togglingId === item.branchId}
            />
          )}
          contentContainerStyle={branches.length === 0 ? styles.emptyContainer : styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchBranches(true)} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color={COLORS.secondaryText} />
              <Text style={styles.emptyText}>No branches found.</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={handleAdd}>
                <Text style={styles.emptyAddBtnText}>Add First Branch</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleAdd} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <BranchFormModal
        visible={showForm}
        branch={editingBranch}
        studioId={studioId}
        onClose={handleFormClose}
        onSaved={fetchBranches}
      />

      <ManagersModal
        visible={!!managersBranch}
        branch={managersBranch}
        studioId={studioId}
        onClose={() => setManagersBranch(null)}
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
  headerCount: { fontSize: 14, color: COLORS.secondaryText },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.secondaryText, textAlign: 'center' },
  emptyAddBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyAddBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  branchName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  locationText: { fontSize: 13, color: COLORS.secondaryText, flex: 1 },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadgeOn: { backgroundColor: '#d1fae5' },
  activeBadgeOff: { backgroundColor: '#fee2e2' },
  activeBadgeText: { fontSize: 12, fontWeight: '700' },
  activeBadgeTextOn: { color: '#065f46' },
  activeBadgeTextOff: { color: '#991b1b' },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexWrap: 'wrap',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  enableChip: { borderColor: COLORS.success + '40', backgroundColor: '#f0fdf4' },
  disableChip: { borderColor: COLORS.danger + '40', backgroundColor: '#fff1f2' },
  deleteChip: { borderColor: COLORS.danger + '40', backgroundColor: '#fff1f2' },
  actionChipText: { fontSize: 13, fontWeight: '600' },
  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
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
    elevation: 8,
  },
  // Managers chip on branch card
  managersChip: { borderColor: COLORS.primary + '40', backgroundColor: '#eef2ff' },
  // Add manager button in managers header
  addMgrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addMgrBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  // Manager card
  mgrCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  mgrCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mgrAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mgrAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  mgrName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  mgrMeta: { fontSize: 13, color: COLORS.secondaryText, marginTop: 1 },
  // Access chips on manager card
  accessChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  accessChip: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  accessChipText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  // Access modal
  accessSubtitle: { fontSize: 14, color: COLORS.secondaryText, marginBottom: 16 },
  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  accessLabel: { fontSize: 15, color: COLORS.text },
  // Shared modal wrapper
  modalSheetWrapper: { flex: 1, justifyContent: 'flex-end' },
  // Form Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  formSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    maxHeight: '85%',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  closeBtn: { padding: 4 },
  formScroll: { flexGrow: 0 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  formActions: { flexDirection: 'row', gap: 12, marginTop: 28 },
  formBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#f3f4f6' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  saveBtn: { backgroundColor: COLORS.primary },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
