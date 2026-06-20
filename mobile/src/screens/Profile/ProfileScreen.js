import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentBranch, clearAuthState } from '../../state/authSlice';
import api from '../../utils/api';

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

// ─── Edit Profile Modal ──────────────────────────────────────────────────────
function EditProfileModal({ visible, user, onClose, onSaved }) {
  const [userName, setUserName] = useState(user?.userName ?? '');
  const [saving, setSaving] = useState(false);

  const showAlert = (title, msg) => Platform.OS === 'web' ? window.alert(`${title}\n${msg}`) : Alert.alert(title, msg);

  const handleSave = async () => {
    if (!userName.trim()) { showAlert('Validation', 'Name cannot be empty.'); return; }
    setSaving(true);
    try {
      await api.put(`/users/update/${user.userId}`, { userName: userName.trim() });
      showAlert('Success', 'Profile updated successfully.');
      onSaved?.({ ...user, userName: userName.trim() });
      onClose();
    } catch (err) {
      showAlert('Error', err?.response?.data?.status?.statusMessage || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formSheet}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.secondaryText}
            value={userName}
            onChangeText={setUserName}
            autoFocus
          />

          <View style={styles.formActions}>
            <TouchableOpacity onPress={onClose} style={[styles.formBtn, styles.cancelBtn]}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.formBtn, styles.saveBtn]} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Change Password Modal (OTP flow) ────────────────────────────────────────
function ChangePasswordModal({ visible, userEmail, onClose }) {
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [otp, setOtp] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setStep('request');
    setOtp('');
    setOtpToken('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const showAlert = (title, msg) => Platform.OS === 'web' ? window.alert(`${title}\n${msg}`) : Alert.alert(title, msg);

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/password/reset?email=${userEmail}`);
      const token = res.data?.data?.[0]?.otpToken;
      setOtpToken(token ?? '');
      showAlert('OTP Sent', `A one-time code has been sent to ${userEmail}.`);
      setStep('verify');
    } catch (err) {
      showAlert('Error', err?.response?.data?.status?.statusMessage || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndChange = async () => {
    if (!otp.trim()) { showAlert('Validation', 'Please enter the OTP.'); return; }
    if (!newPassword.trim()) { showAlert('Validation', 'Please enter a new password.'); return; }
    if (newPassword !== confirmPassword) { showAlert('Validation', 'Passwords do not match.'); return; }
    if (newPassword.length < 6) { showAlert('Validation', 'Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      await api.post('/password/verify', {
        otpToken,
        otp: otp.trim(),
        userEntry: { email: userEmail, password: newPassword },
      });
      showAlert('Success', 'Password changed successfully.');
      handleClose();
    } catch (err) {
      showAlert('Error', err?.response?.data?.status?.statusMessage || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formSheet}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {step === 'request' ? 'Change Password' : 'Enter OTP'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          {step === 'request' ? (
            <>
              <View style={styles.otpInfoBox}>
                <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
                <Text style={styles.otpInfoText}>
                  An OTP will be sent to{' '}
                  <Text style={styles.otpEmail}>{userEmail}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleRequestOtp}
                style={[styles.formBtn, styles.saveBtn, { marginTop: 20 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.fieldLabel}>OTP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor={COLORS.secondaryText}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={8}
                autoFocus
              />

              <Text style={styles.fieldLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.secondaryText}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.secondaryText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity onPress={() => { setStep('request'); setOtp(''); }} style={styles.resendRow}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>

              <View style={styles.formActions}>
                <TouchableOpacity onPress={handleClose} style={[styles.formBtn, styles.cancelBtn]}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVerifyAndChange} style={[styles.formBtn, styles.saveBtn]} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveBtnText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const studio = useSelector((state) => state.auth.studio);
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const branches = useSelector((state) => state.auth.branches);
  const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSetBranch = useCallback((branch) => {
    dispatch(setCurrentBranch(branch));
    showAlert('Branch Changed', `Now using "${branch.name ?? branch.branchName}".`);
  }, [dispatch]);

  const handleLogout = () => {
    const doLogout = async () => {
      setLoggingOut(true);
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userEmail');
      } catch (_) {
        // Ignore storage errors
      } finally {
        dispatch(clearAuthState());
        setLoggingOut(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: doLogout },
        ]
      );
    }
  };

  const displayUser = localUser ?? user;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          {studio?.logo ? (
            <Image source={{ uri: studio.logo }} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {(displayUser?.userName ?? displayUser?.email ?? 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.avatarName}>{displayUser?.userName || displayUser?.email || 'User'}</Text>
          <Text style={styles.avatarRole}>{displayUser?.role || 'Studio Member'}</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <SectionHeader title="Account" />
          <InfoRow icon="person-outline" label="Name" value={displayUser?.userName} />
          <View style={styles.divider} />
          <InfoRow icon="mail-outline" label="Email" value={displayUser?.email} />
          <View style={styles.divider} />
          <InfoRow icon="shield-checkmark-outline" label="Role" value={displayUser?.role} />
        </View>

        {/* Studio Info Card */}
        <View style={styles.card}>
          <SectionHeader title="Studio" />
          <InfoRow icon="business-outline" label="Studio Name" value={studio?.studioName} />
          <View style={styles.divider} />
          <InfoRow icon="location-outline" label="Location" value={studio?.location} />
          {subscriptionPlan && (
            <>
              <View style={styles.divider} />
              <InfoRow icon="star-outline" label="Subscription" value={subscriptionPlan?.planName ?? String(subscriptionPlan)} />
            </>
          )}
        </View>

        {/* Branch Selector */}
        <View style={styles.card}>
          <SectionHeader title="Switch Branch" />
          {branches.length === 0 ? (
            <Text style={styles.noBranchText}>No branches available.</Text>
          ) : (
            branches.map((branch, idx) => {
              const isActive = branch.branchId === currentBranch?.branchId;
              return (
                <React.Fragment key={branch.branchId}>
                  {idx > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.branchRow}
                    onPress={() => handleSetBranch(branch)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.branchIconWrap, isActive && styles.branchIconWrapActive]}>
                      <Ionicons
                        name="business-outline"
                        size={18}
                        color={isActive ? '#fff' : COLORS.primary}
                      />
                    </View>
                    <View style={styles.branchInfo}>
                      <Text style={[styles.branchName, isActive && styles.branchNameActive]}>
                        {branch.name}
                      </Text>
                      {branch.city ? (
                        <Text style={styles.branchLocation}>{branch.city}</Text>
                      ) : null}
                    </View>
                    {isActive ? (
                      <View style={styles.activeBadge}>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              );
            })
          )}
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <SectionHeader title="Account Actions" />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowEditProfile(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#eef2ff' }]}>
              <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.actionLabel}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowChangePassword(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="lock-closed-outline" size={18} color="#d97706" />
            </View>
            <Text style={styles.actionLabel}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
              {loggingOut ? (
                <ActivityIndicator size="small" color={COLORS.danger} />
              ) : (
                <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
              )}
            </View>
            <Text style={[styles.actionLabel, { color: COLORS.danger }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <EditProfileModal
        visible={showEditProfile}
        user={displayUser}
        onClose={() => setShowEditProfile(false)}
        onSaved={(updated) => setLocalUser(updated)}
      />

      <ChangePasswordModal
        visible={showChangePassword}
        userEmail={displayUser?.email}
        onClose={() => setShowChangePassword(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 },
  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInitial: { fontSize: 34, fontWeight: '800', color: '#fff' },
  avatarName: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  avatarRole: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 4,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 8,
    overflow: 'hidden',
  },
  // Cards
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  // Section Header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeaderText: { fontSize: 12, fontWeight: '700', color: COLORS.secondaryText, textTransform: 'uppercase', letterSpacing: 0.5 },
  // Info Row
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '500' },
  infoValue: { fontSize: 15, color: COLORS.text, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 66 },
  // Branch Rows
  noBranchText: { padding: 16, color: COLORS.secondaryText, fontSize: 14, textAlign: 'center' },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  branchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  branchIconWrapActive: { backgroundColor: COLORS.primary },
  branchInfo: { flex: 1 },
  branchName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  branchNameActive: { color: COLORS.primary },
  branchLocation: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeBadgeText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  // Action Rows
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  bottomSpacer: { height: 24 },
  // Modal / Form
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  formSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  closeBtn: { padding: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 14 },
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
  formActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  formBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#f3f4f6' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  saveBtn: { backgroundColor: COLORS.primary },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  // OTP Info
  otpInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#eef2ff',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  otpInfoText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  otpEmail: { fontWeight: '700', color: COLORS.primary },
  resendRow: { alignSelf: 'flex-end', marginTop: 10 },
  resendText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
});
