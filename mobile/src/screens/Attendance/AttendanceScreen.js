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
  Platform,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
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

// Simple date helpers — no external libs
function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

// Minimal inline date picker using a Modal with three scroll wheels
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function DatePickerModal({ visible, initialDate, onConfirm, onCancel }) {
  const init = initialDate ? new Date(initialDate) : new Date();
  const [day, setDay] = useState(init.getDate());
  const [month, setMonth] = useState(init.getMonth() + 1);
  const [year, setYear] = useState(init.getFullYear());

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleConfirm = () => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onConfirm(dateStr);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerTitle}>Select Date</Text>
          <View style={styles.datePickerRow}>
            {/* Day */}
            <View style={styles.datePickerCol}>
              <Text style={styles.datePickerLabel}>Day</Text>
              <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                {days.map((d) => (
                  <TouchableOpacity key={d} onPress={() => setDay(d)} style={[styles.datePickerItem, day === d && styles.datePickerItemActive]}>
                    <Text style={[styles.datePickerItemText, day === d && styles.datePickerItemTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Month */}
            <View style={styles.datePickerCol}>
              <Text style={styles.datePickerLabel}>Month</Text>
              <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                {months.map((m) => (
                  <TouchableOpacity key={m} onPress={() => setMonth(m)} style={[styles.datePickerItem, month === m && styles.datePickerItemActive]}>
                    <Text style={[styles.datePickerItemText, month === m && styles.datePickerItemTextActive]}>{MONTHS[m - 1]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Year */}
            <View style={styles.datePickerCol}>
              <Text style={styles.datePickerLabel}>Year</Text>
              <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                {years.map((y) => (
                  <TouchableOpacity key={y} onPress={() => setYear(y)} style={[styles.datePickerItem, year === y && styles.datePickerItemActive]}>
                    <Text style={[styles.datePickerItemText, year === y && styles.datePickerItemTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={styles.datePickerActions}>
            <TouchableOpacity onPress={onCancel} style={[styles.datePickerBtn, styles.datePickerCancelBtn]}>
              <Text style={styles.datePickerCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={[styles.datePickerBtn, styles.datePickerConfirmBtn]}>
              <Text style={styles.datePickerConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function AttendanceScreen({ navigation }) {
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const branchId = currentBranch?.branchId;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIds, setSelectedIds] = useState({}); // assignmentId -> attended bool
  const [page] = useState(1);

  const fetchAttendance = useCallback(async (isRefresh = false) => {
    if (!branchId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await api.get(`/studentActivities/getAll/${branchId}`, {
        params: { rootType: 'BRANCH', page, size: 50, date: selectedDate, membershipStatus: 'ACTIVE' },
      });
      const items = res.data?.data ?? [];
      setRecords(items);
      setSelectedIds({});
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load attendance.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [branchId, page, selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const toggleSelect = (assignmentId, currentAttended) => {
    setSelectedIds((prev) => {
      const key = String(assignmentId);
      if (key in prev) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: !currentAttended };
    });
  };

  const toggleAttendedValue = (assignmentId) => {
    setSelectedIds((prev) => {
      const key = String(assignmentId);
      if (key in prev) {
        return { ...prev, [key]: !prev[key] };
      }
      return prev;
    });
  };

  const handleBulkSubmit = async () => {
    const attendanceList = Object.entries(selectedIds).map(([assignmentId, present]) => ({
      assignmentId: Number(assignmentId),
      present,
    }));
    if (!attendanceList.length) {
      Alert.alert('No Selection', 'Please select at least one record to mark.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put('/studentActivities/mark_attendance/bulk', { date: selectedDate, attendanceList });
      Alert.alert('Success', 'Attendance marked successfully.');
      setSelectedIds({});
      fetchAttendance();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectAll = () => {
    const all = {};
    records.forEach((r) => {
      const present = r.attendanceEntries?.find((e) => e.date?.startsWith(selectedDate))?.present ?? false;
      all[String(r.assignmentId)] = present;
    });
    setSelectedIds(all);
  };

  const clearAll = () => setSelectedIds({});

  const renderItem = ({ item }) => {
    const key = String(item.assignmentId);
    const isSelected = key in selectedIds;
    const serverAttended = item.attendanceEntries?.find((e) => e.date?.startsWith(selectedDate))?.present ?? false;
    const attendedValue = isSelected ? selectedIds[key] : serverAttended;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSelect(item.assignmentId, serverAttended)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View style={styles.checkboxArea}>
            <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
              {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
          </View>
          <View style={styles.cardInfo}>
            <TouchableOpacity
              onPress={() => item.studentId && navigation.navigate('StudentDetail', { studentId: item.studentId })}
              activeOpacity={item.studentId ? 0.6 : 1}
            >
              <Text style={[styles.studentName, item.studentId && styles.studentNameLink]}>
                {item.studentName || '—'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.activityName}>{item.activityName || '—'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.attendedBadge, attendedValue ? styles.attendedPresent : styles.attendedAbsent]}
            onPress={() => isSelected && toggleAttendedValue(item.assignmentId)}
          >
            <Text style={styles.attendedBadgeText}>{attendedValue ? 'Present' : 'Absent'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedCount = Object.keys(selectedIds).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Attendance</Text>
        {selectedCount > 0 && (
          <TouchableOpacity onPress={handleBulkSubmit} style={styles.submitBtn} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Submit ({selectedCount})</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Date filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.dateFilterBtn} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
          <Text style={styles.dateFilterText}>{formatDisplayDate(selectedDate)}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.secondaryText} />
        </TouchableOpacity>

        <View style={styles.selectActions}>
          <TouchableOpacity onPress={selectAll} style={styles.selectActionBtn}>
            <Text style={styles.selectActionText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} style={styles.selectActionBtn}>
            <Text style={styles.selectActionText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item, idx) => String(item.assignmentId ?? idx)}
          renderItem={renderItem}
          contentContainerStyle={records.length === 0 ? styles.emptyContainer : styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAttendance(true)} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.secondaryText} />
              <Text style={styles.emptyText}>No attendance records for this date.</Text>
            </View>
          }
        />
      )}

      <DatePickerModal
        visible={showDatePicker}
        initialDate={selectedDate}
        onConfirm={(dateStr) => {
          setSelectedDate(dateStr);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
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
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateFilterText: { fontSize: 14, color: COLORS.text, marginHorizontal: 4 },
  selectActions: { flexDirection: 'row', gap: 8 },
  selectActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  selectActionText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: 16, gap: 10 },
  emptyContainer: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.secondaryText, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: { borderColor: COLORS.primary, backgroundColor: '#eef2ff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkboxArea: { justifyContent: 'center' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  cardInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  studentNameLink: { color: COLORS.primary, textDecorationLine: 'underline' },
  activityName: { fontSize: 13, color: COLORS.secondaryText, marginTop: 2 },
  attendedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  attendedPresent: { backgroundColor: '#d1fae5' },
  attendedAbsent: { backgroundColor: '#fee2e2' },
  attendedBadgeText: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  // Date Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  datePickerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 16 },
  datePickerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  datePickerCol: { flex: 1, alignItems: 'center' },
  datePickerLabel: { fontSize: 13, color: COLORS.secondaryText, fontWeight: '600', marginBottom: 6 },
  datePickerScroll: { height: 160, width: '100%' },
  datePickerItem: {
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  datePickerItemActive: { backgroundColor: COLORS.primary },
  datePickerItemText: { fontSize: 15, color: COLORS.text },
  datePickerItemTextActive: { color: '#fff', fontWeight: '700' },
  datePickerActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  datePickerBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  datePickerCancelBtn: { backgroundColor: '#f3f4f6' },
  datePickerConfirmBtn: { backgroundColor: COLORS.primary },
  datePickerCancelText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  datePickerConfirmText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
