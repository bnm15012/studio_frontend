import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSelector } from 'react-redux';
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

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'NOT_TO_SAY'];
const MEMBERSHIP_TYPES = ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'SESSION'];
const PAYMENT_STATUSES = ['COMPLETED', 'PENDING'];
const PAYMENT_TYPES = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function fmtDate(d) {
  if (!d) return null;
  const iso = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${iso[3]} ${months[parseInt(iso[2], 10) - 1]} ${iso[1]}`;
  }
  const dt = new Date(d);
  if (!isNaN(dt)) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
  }
  return String(d);
}

function toIsoDate(d) {
  if (!d) return '';
  const iso = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dt = new Date(d);
  if (!isNaN(dt)) return dt.toISOString().split('T')[0];
  return String(d);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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

function InfoRow({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{String(value)}</Text>
      </View>
    </View>
  );
}

function EditField({ label, error, ...inputProps }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, inputProps.multiline && styles.inputMulti]}
        placeholderTextColor={COLORS.secondaryText}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

function ChipSelector({ label, options, value, onChange }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {options.map((o) => (
            <TouchableOpacity
              key={o}
              style={[styles.chip, value === o && styles.chipActive]}
              onPress={() => onChange(o)}
            >
              <Text style={[styles.chipText, value === o && styles.chipTextActive]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Student Edit Form ────────────────────────────────────────────────────────
function EditForm({ student, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: student.name ?? '',
    email: student.email ?? '',
    phone: student.phone ?? '',
    dob: student.dob ?? '',
    gender: student.gender ?? '',
    address: student.address ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

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

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.put(`/students/update/${student.studentId}`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dob: form.dob.trim() || null,
        gender: form.gender || null,
        address: form.address.trim() || null,
        branchId: student.branchId,
      });
      onSaved();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to update student');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.editCard}>
      <Text style={styles.sectionTitle}>Edit Student</Text>
      <EditField label="Full Name *" value={form.name} onChangeText={(v) => setField('name', v)} placeholder="e.g. Jane Doe" error={errors.name} />
      <EditField label="Email *" value={form.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="jane@example.com" error={errors.email} />
      <EditField label="Phone *" value={form.phone} onChangeText={(v) => setField('phone', v)} keyboardType="phone-pad" placeholder="+91 99999 00000" error={errors.phone} />
      <EditField label="Date of Birth" value={form.dob} onChangeText={(v) => setField('dob', v)} placeholder="YYYY-MM-DD" />
      <EditField label="Address" value={form.address} onChangeText={(v) => setField('address', v)} placeholder="Street, City" multiline />
      <Text style={styles.fieldLabel}>Gender</Text>
      <View style={styles.chipRow}>
        {GENDER_OPTIONS.map((g) => (
          <TouchableOpacity key={g} style={[styles.chip, form.gender === g && styles.chipActive]} onPress={() => setField('gender', g)}>
            <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.editBtnRow, { marginTop: 16 }]}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={saving}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Activity Edit Modal ──────────────────────────────────────────────────────
function ActivityEditModal({ visible, item, availableActivities, student, onClose, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset form whenever the item changes
  useEffect(() => {
    if (!item) return;
    setForm({
      activityName: item.activityName ?? '',
      membershipType: item.membershipType ?? '',
      membershipStartDate: toIsoDate(item.membershipStartDate),
      membershipEndDate: toIsoDate(item.membershipEndDate),
      daysPerWeek: item.daysPerWeek != null ? String(item.daysPerWeek) : '',
      batchName: item.batchName ?? '',
      batchTime: item.batchTime ?? '',
      paymentAmount: item.paymentEntry?.amount != null ? String(item.paymentEntry.amount) : '',
      paymentStatus: item.paymentEntry?.status ?? 'COMPLETED',
      paymentType: item.paymentEntry?.paymentType ?? 'CASH',
    });
  }, [item]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!item) return;
    setSaving(true);
    try {
      const assignmentId = item.assignmentId ?? item.studentActivityId;
      const payload = {
        studentId: student.studentId,
        branchId: student.branchId,
        activityName: form.activityName,
        membershipType: form.membershipType || null,
        membershipStartDate: form.membershipStartDate || null,
        membershipEndDate: form.membershipEndDate || null,
        daysPerWeek: form.daysPerWeek ? Number(form.daysPerWeek) : null,
        batchName: form.batchName || null,
        batchTime: form.batchTime || null,
        paymentEntry: {
          ...(item.paymentEntry ?? {}),
          amount: form.paymentAmount ? Number(form.paymentAmount) : null,
          actualAmount: item.paymentEntry?.actualAmount ?? (form.paymentAmount ? Number(form.paymentAmount) : null),
          status: form.paymentStatus,
          paymentType: form.paymentType,
        },
      };
      await api.put(`/studentActivities/update/${assignmentId}`, payload);
      onSaved();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to update assignment');
    } finally {
      setSaving(false);
    }
  }

  const activityNames = availableActivities.map((a) => a.activityType ?? a.activityName ?? a.name).filter(Boolean);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Activity Assignment</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Activity Name */}
            {activityNames.length > 0 ? (
              <ChipSelector
                label="Activity"
                options={activityNames}
                value={form.activityName}
                onChange={(v) => setField('activityName', v)}
              />
            ) : (
              <EditField
                label="Activity Name"
                value={form.activityName}
                onChangeText={(v) => setField('activityName', v)}
                placeholder="Activity name"
              />
            )}

            {/* Membership Type */}
            <ChipSelector
              label="Membership Type"
              options={MEMBERSHIP_TYPES}
              value={form.membershipType}
              onChange={(v) => setField('membershipType', v)}
            />

            {/* Start / End dates */}
            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <EditField
                  label="Start Date"
                  value={form.membershipStartDate}
                  onChangeText={(v) => setField('membershipStartDate', v)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <EditField
                  label="End Date"
                  value={form.membershipEndDate}
                  onChangeText={(v) => setField('membershipEndDate', v)}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Days per week */}
            <EditField
              label="Days per Week"
              value={form.daysPerWeek}
              onChangeText={(v) => setField('daysPerWeek', v)}
              placeholder="e.g. 3"
              keyboardType="number-pad"
            />

            {/* Batch */}
            <EditField label="Batch Name" value={form.batchName} onChangeText={(v) => setField('batchName', v)} placeholder="e.g. Morning Batch" />
            <EditField label="Batch Time" value={form.batchTime} onChangeText={(v) => setField('batchTime', v)} placeholder="e.g. 08:00-09:00" />

            {/* Payment */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Payment</Text>
            <EditField
              label="Amount (₹)"
              value={form.paymentAmount}
              onChangeText={(v) => setField('paymentAmount', v)}
              placeholder="e.g. 2000"
              keyboardType="numeric"
            />
            <ChipSelector label="Payment Status" options={PAYMENT_STATUSES} value={form.paymentStatus} onChange={(v) => setField('paymentStatus', v)} />
            <ChipSelector label="Payment Type" options={PAYMENT_TYPES} value={form.paymentType} onChange={(v) => setField('paymentType', v)} />

            {/* Buttons */}
            <View style={[styles.editBtnRow, { marginTop: 12, marginBottom: 8 }]}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Invoice PDF Builder ──────────────────────────────────────────────────────
function buildInvoiceHtml({ item, student, studio, currentBranch }) {
  const studioName = studio?.studioName ?? 'Studio';
  const invoiceNo = item.paymentEntry?.id ?? item.assignmentId ?? '—';
  const regDate = fmtDate(item.registrationDate ?? item.membershipStartDate);
  const gstNumber = studio?.gstNumber;

  const total = Number(item.paymentEntry?.amount ?? 0);
  const actual = Number(item.paymentEntry?.actualAmount ?? total);
  const discount = Math.abs(actual - total);
  const gstRate = 0.18;
  const base = total / (1 + gstRate);
  const gst = total - base;

  const th = 'padding:8px 10px;text-align:left;background:#6366f1;color:#fff;font-size:13px;';
  const td = 'padding:8px 10px;font-size:13px;border-bottom:1px solid #e5e7eb;';
  const tdR = td + 'text-align:right;';

  const batchRow = (item.batchName || item.batchTime)
    ? `<tr><td style="${td}">Batch</td><td style="${td}">${item.batchName ?? '—'} ${item.batchTime ?? ''}</td></tr>`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    body{font-family:Helvetica,Arial,sans-serif;margin:32px;color:#111827;font-size:14px;}
    h1{font-size:22px;margin:0 0 4px;}
    .sub{font-size:13px;color:#6b7280;margin:0 0 2px;}
    hr{border:none;border-top:2px solid #6366f1;margin:16px 0;}
    table{width:100%;border-collapse:collapse;margin-top:10px;}
  </style></head><body>
  <h1>${studioName}</h1>
  <p class="sub">${currentBranch?.address ?? ''}</p>
  ${gstNumber ? `<p class="sub">GSTIN: ${gstNumber}</p>` : ''}
  <hr/>
  <table style="margin-bottom:16px;">
    <tr>
      <td style="width:50%;vertical-align:top;">
        <strong>INVOICE</strong><br/>
        Invoice #: INV-${invoiceNo}<br/>
        Date: ${regDate ?? '—'}
      </td>
      <td style="text-align:right;vertical-align:top;">
        <strong>Bill To</strong><br/>
        ${student?.name ?? '—'}<br/>
        ${student?.phone ?? ''}<br/>
        ${student?.email ?? ''}
      </td>
    </tr>
  </table>
  <table>
    <thead><tr>
      <th style="${th}">Activity</th>
      <th style="${th}">Plan</th>
      <th style="${th}">Start Date</th>
      <th style="${th}">End Date</th>
      <th style="${th}">Days/Wk</th>
      <th style="${th}">Amount</th>
    </tr></thead>
    <tbody>
      <tr>
        <td style="${td}">${item.activityName ?? '—'}</td>
        <td style="${td}">${item.membershipType ?? '—'}</td>
        <td style="${td}">${fmtDate(item.membershipStartDate) ?? '—'}</td>
        <td style="${td}">${fmtDate(item.membershipEndDate) ?? '—'}</td>
        <td style="${td}">${item.daysPerWeek ?? '—'}</td>
        <td style="${tdR}">₹${actual.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
  ${batchRow ? `<table style="margin-top:12px;"><thead><tr><th style="${th}">Batch Name</th><th style="${th}">Batch Time</th></tr></thead><tbody><tr><td style="${td}">${item.batchName ?? '—'}</td><td style="${td}">${item.batchTime ?? '—'}</td></tr></tbody></table>` : ''}
  <div style="display:flex;justify-content:flex-end;margin-top:20px;">
    <table style="width:40%;border:1px solid #e5e7eb;">
      <tbody>
        ${gstNumber ? `
        <tr><td style="${td}">Base Amount</td><td style="${tdR}">₹${base.toFixed(2)}</td></tr>
        <tr><td style="${td}">GST (18%)</td><td style="${tdR}">₹${gst.toFixed(2)}</td></tr>` : ''}
        ${discount > 0 ? `<tr><td style="${td}">Discount</td><td style="${tdR}">-₹${discount.toFixed(2)}</td></tr>` : ''}
        <tr style="background:#f9fafb;">
          <td style="${td}font-weight:700;">Total</td>
          <td style="${tdR}font-weight:700;">₹${total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p style="margin-top:32px;font-size:12px;color:#6b7280;text-align:center;">Thank you for choosing ${studioName}!</p>
  </body></html>`;
}

// ─── Activity Assignment Card ─────────────────────────────────────────────────
function ActivityCard({ item, student, studio, currentBranch, onEdit, onDelete }) {
  const isActive = item.membershipStatus === 'ACTIVE';
  const payment = item.paymentEntry;
  const [pdfLoading, setPdfLoading] = useState(false);

  const dateRange = (item.membershipStartDate && item.membershipEndDate)
    ? `${fmtDate(item.membershipStartDate)} → ${fmtDate(item.membershipEndDate)}`
    : null;

  const chips = [
    item.membershipType,
    item.daysPerWeek ? `${item.daysPerWeek}d/wk` : null,
    item.batchName,
    item.batchTime && item.batchTime !== '00:00-00:00' && item.batchTime !== '00:00 - 00:00' ? item.batchTime : null,
  ].filter(Boolean);

  async function handleInvoice() {
    setPdfLoading(true);
    try {
      const html = buildInvoiceHtml({ item, student, studio, currentBranch });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Save / Share Invoice' });
      } else {
        Alert.alert('Saved', `Invoice saved to:\n${uri}`);
      }
    } catch {
      Alert.alert('Error', 'Could not generate invoice PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <View style={styles.activityCard}>
      {/* Header: name + status + action buttons */}
      <View style={styles.activityCardHeader}>
        <Text style={styles.activityName}>{item.activityName ?? 'Activity'}</Text>
        <View style={styles.activityHeaderRight}>
          <View style={[styles.activityStatusPill, { backgroundColor: isActive ? '#d1fae5' : '#fee2e2' }]}>
            <Text style={[styles.activityStatusText, { color: isActive ? COLORS.success : COLORS.danger }]}>
              {item.membershipStatus ?? 'UNKNOWN'}
            </Text>
          </View>
          {/* Edit button */}
          <TouchableOpacity
            style={styles.activityActionBtn}
            onPress={() => onEdit(item)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="create-outline" size={17} color={COLORS.primary} />
          </TouchableOpacity>
          {/* Delete button */}
          <TouchableOpacity
            style={styles.activityActionBtn}
            onPress={() => onDelete(item)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="trash-outline" size={17} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chips row */}
      {chips.length > 0 && (
        <View style={styles.activityChipsRow}>
          {chips.map((c, i) => (
            <View key={i} style={styles.activityChip}>
              <Text style={styles.activityChipText}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Date range */}
      {dateRange ? (
        <View style={styles.activityDateRow}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.secondaryText} />
          <Text style={styles.activityDateText}>{dateRange}</Text>
        </View>
      ) : null}

      {/* Payment row */}
      {payment ? (
        <View style={styles.activityPaymentRow}>
          <Text style={styles.activityPaymentAmount}>₹{payment.amount}</Text>
          {payment.actualAmount && payment.actualAmount !== payment.amount ? (
            <Text style={styles.activityPaymentStrike}>₹{payment.actualAmount}</Text>
          ) : null}
          <View style={[styles.activityStatusPill, {
            backgroundColor: payment.status === 'COMPLETED' ? '#d1fae5' : '#fef3c7',
          }]}>
            <Text style={[styles.activityStatusText, {
              color: payment.status === 'COMPLETED' ? COLORS.success : '#92400e',
            }]}>{payment.status}</Text>
          </View>

          {/* Invoice button — only when COMPLETED */}
          {payment.status === 'COMPLETED' && (
            <TouchableOpacity
              style={styles.invoiceBtn}
              onPress={handleInvoice}
              disabled={pdfLoading}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              {pdfLoading
                ? <ActivityIndicator size="small" color={COLORS.primary} />
                : <Ionicons name="document-text-outline" size={17} color={COLORS.primary} />}
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function StudentDetailScreen({ route, navigation }) {
  const { studentId } = route.params;
  const studio = useSelector((state) => state.auth?.studio);
  const currentBranch = useSelector((state) => state.auth?.currentBranch);

  const [student, setStudent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Activity edit modal state
  const [editingActivity, setEditingActivity] = useState(null); // the assignment being edited

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchStudent = useCallback(async () => {
    setError(null);
    try {
      const branchId = currentBranch?.branchId;
      const calls = [
        api.get(`/students/get/${studentId}`),
        api.get(`/studentActivities/getAll/${studentId}`, { params: { rootType: 'STUDENT' } }),
      ];
      if (branchId) {
        calls.push(api.get(`/activities/getAll/${branchId}`, { params: { page: 1, limit: 100 } }));
      }
      const [studentRes, actRes, activitiesRes] = await Promise.all(calls);
      const data = studentRes.data?.data;
      setStudent(Array.isArray(data) ? data[0] : data ?? null);
      setActivities(actRes.data?.data ?? []);
      if (activitiesRes) setAvailableActivities(activitiesRes.data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.status?.statusMessage ?? 'Failed to load student');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId, currentBranch?.branchId]);

  useEffect(() => { fetchStudent(); }, [fetchStudent]);

  function handleRefresh() {
    setRefreshing(true);
    setIsEditing(false);
    fetchStudent();
  }

  // ── Delete student ─────────────────────────────────────────────────────────
  function confirmDelete() {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student?.name ?? 'this student'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/students/delete/${studentId}`);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to delete student');
      setDeleting(false);
    }
  }

  function handleSaved() {
    setIsEditing(false);
    setLoading(true);
    fetchStudent();
  }

  // ── Activity actions ───────────────────────────────────────────────────────
  function handleEditActivity(item) {
    setEditingActivity(item);
  }

  function confirmDeleteActivity(item) {
    const assignmentId = item.assignmentId ?? item.studentActivityId;
    Alert.alert(
      'Delete Assignment',
      `Remove "${item.activityName ?? 'this activity'}" assignment? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/studentActivities/delete/${assignmentId}`);
              setActivities((prev) => prev.filter((a) => (a.assignmentId ?? a.studentActivityId) !== assignmentId));
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.status?.statusMessage ?? 'Failed to delete assignment');
            }
          },
        },
      ]
    );
  }

  function handleActivitySaved() {
    setEditingActivity(null);
    fetchStudent();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header navigation={navigation} title="Student Detail" />
        <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      </SafeAreaView>
    );
  }

  if (error || !student) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header navigation={navigation} title="Student Detail" />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
          <Text style={styles.emptyText}>{error ?? 'Student not found'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchStudent}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const age = calculateAge(student.dob);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Detail</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsEditing((v) => !v)} style={styles.headerActionBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={isEditing ? 'close-circle-outline' : 'create-outline'} size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} style={styles.headerActionBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} disabled={deleting}>
            {deleting ? <ActivityIndicator size="small" color={COLORS.danger} /> : <Ionicons name="trash-outline" size={22} color={COLORS.danger} />}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        >
          {/* Profile Hero */}
          <View style={styles.profileHero}>
            {student.imageUrl ? (
              <Image source={{ uri: student.imageUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{getInitials(student.name)}</Text>
              </View>
            )}
            <Text style={styles.profileName}>{student.name}</Text>
            <StatusBadge status={student.membershipStatus} />
          </View>

          {/* Details Card */}
          {!isEditing && (
            <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <InfoRow icon="mail-outline" label="Email" value={student.email} />
              <InfoRow icon="call-outline" label="Phone" value={student.phone} />
              <InfoRow icon="calendar-outline" label="Date of Birth" value={student.dob ? `${student.dob}${age !== null ? ` (Age ${age})` : ''}` : null} />
              <InfoRow icon="person-outline" label="Gender" value={student.gender} />
              <InfoRow icon="location-outline" label="Address" value={student.address} />
            </View>
          )}

          {/* Edit Form */}
          {isEditing && <EditForm student={student} onCancel={() => setIsEditing(false)} onSaved={handleSaved} />}

          {/* Activity Assignments */}
          {!isEditing && (
            <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>
                Activity Assignments{activities.length > 0 ? ` (${activities.length})` : ''}
              </Text>
              {activities.length === 0 ? (
                <View style={styles.activityEmpty}>
                  <Ionicons name="fitness-outline" size={32} color={COLORS.secondaryText} />
                  <Text style={styles.activityEmptyText}>No activities assigned</Text>
                </View>
              ) : (
                activities.map((item, idx) => (
                  <ActivityCard
                    key={item.assignmentId ?? item.studentActivityId ?? idx}
                    item={item}
                    student={student}
                    studio={studio}
                    currentBranch={currentBranch}
                    onEdit={handleEditActivity}
                    onDelete={confirmDeleteActivity}
                  />
                ))
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Activity Edit Modal */}
      <ActivityEditModal
        visible={!!editingActivity}
        item={editingActivity}
        availableActivities={availableActivities}
        student={student}
        onClose={() => setEditingActivity(null)}
        onSaved={handleActivitySaved}
      />
    </SafeAreaView>
  );
}

// ─── Shared Header ────────────────────────────────────────────────────────────
function Header({ navigation, title }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 80 }} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerActionBtn: { padding: 6 },

  scrollContent: { paddingBottom: 40 },

  // Profile Hero
  profileHero: { alignItems: 'center', paddingVertical: 28, backgroundColor: COLORS.card, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  profileAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarText: { fontSize: 32, fontWeight: '800', color: COLORS.primary },
  profileName: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 8 },

  // Badge
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  // Detail / Edit Card
  detailCard: { backgroundColor: COLORS.card, marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  editCard: { backgroundColor: COLORS.card, marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 14 },

  // Info Row
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.secondaryText, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, color: COLORS.text, fontWeight: '500', marginTop: 2 },

  // Form fields
  fieldWrapper: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 10, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.background },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  inputError: { borderColor: COLORS.danger },
  fieldError: { fontSize: 12, color: COLORS.danger, marginTop: 4 },

  dateRow: { flexDirection: 'row', alignItems: 'flex-start' },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background },
  chipActive: { backgroundColor: '#e0e7ff', borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '500' },
  chipTextActive: { color: COLORS.primary, fontWeight: '700' },

  // Buttons
  editBtnRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.background },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  saveBtn: { flex: 2, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Activity card
  activityCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 6 },
  activityCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activityHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activityName: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 6 },
  activityStatusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  activityStatusText: { fontSize: 11, fontWeight: '700' },
  activityActionBtn: { padding: 4 },
  activityChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  activityChip: { backgroundColor: '#f3f4f6', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  activityChipText: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '500' },
  activityDateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  activityDateText: { fontSize: 12, color: COLORS.secondaryText },
  activityPaymentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activityPaymentAmount: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  activityPaymentStrike: { fontSize: 12, color: COLORS.danger, textDecorationLine: 'line-through' },
  invoiceBtn: { marginLeft: 4, padding: 3 },
  activityEmpty: { alignItems: 'center', paddingVertical: 20 },
  activityEmptyText: { marginTop: 8, fontSize: 13, color: COLORS.secondaryText },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },

  // States
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 12, fontSize: 15, color: COLORS.secondaryText, textAlign: 'center' },
  retryBtn: { marginTop: 16, paddingVertical: 8, paddingHorizontal: 24, backgroundColor: COLORS.primary, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontWeight: '600' },
});
