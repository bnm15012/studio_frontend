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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
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

const NOTIFICATION_TYPES = ['EMAIL', 'SMS', 'WHATSAPP'];
const MEMBER_TYPES = ['ALL', 'STUDENT', 'INSTRUCTOR'];

const TYPE_ICONS = {
  EMAIL: 'mail-outline',
  SMS: 'chatbubble-outline',
  WHATSAPP: 'logo-whatsapp',
};

const TYPE_COLORS = {
  EMAIL: '#6366f1',
  SMS: '#10b981',
  WHATSAPP: '#25D366',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function HistoryCard({ item, onPress }) {
  const color = TYPE_COLORS[item.notificationType] ?? COLORS.primary;
  const icon = TYPE_ICONS[item.notificationType] ?? 'notifications-outline';

  return (
    <TouchableOpacity style={styles.historyCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.typeIconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.historyCardContent}>
        <Text style={styles.historyTitle} numberOfLines={1}>{item.title || item.subject || '(No Title)'}</Text>
        <View style={styles.historyMeta}>
          <View style={[styles.typePill, { backgroundColor: color + '18' }]}>
            <Text style={[styles.typePillText, { color }]}>{item.notificationType}</Text>
          </View>
          {item.recipientCount !== undefined && (
            <Text style={styles.recipientCount}>
              <Ionicons name="people-outline" size={12} /> {item.recipientCount} recipients
            </Text>
          )}
        </View>
        <Text style={styles.historyDate}>{formatDate(item.sentAt)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.secondaryText} style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  );
}

function RecipientsModal({ visible, messageId, onClose }) {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !messageId) return;
    setRecipients([]);
    setLoading(true);
    api.get(`/getMessageRecipients/${messageId}`)
      .then((res) => setRecipients(res.data?.data ?? []))
      .catch((err) => Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load recipients.'))
      .finally(() => setLoading(false));
  }, [visible, messageId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.recipientsOverlay}>
        <View style={styles.recipientsContainer}>
          <View style={styles.recipientsHeader}>
            <Text style={styles.recipientsTitle}>Recipients</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.recipientsCentered}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={recipients}
              keyExtractor={(r, idx) => String(r.id ?? r.phone ?? r.email ?? idx)}
              contentContainerStyle={recipients.length === 0 ? styles.recipientsCentered : { paddingBottom: 20 }}
              renderItem={({ item: r }) => (
                <View style={styles.recipientRow}>
                  <View style={styles.recipientAvatar}>
                    <Ionicons name="person-outline" size={18} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recipientName}>{r.recipientName || r.name || '—'}</Text>
                    {(r.phone || r.email) ? (
                      <Text style={styles.recipientContact}>{r.phone || r.email}</Text>
                    ) : null}
                  </View>
                  {r.status ? (
                    <View style={[styles.recipientStatusPill, { backgroundColor: r.status === 'SENT' ? '#d1fae5' : '#fef3c7' }]}>
                      <Text style={[styles.recipientStatusText, { color: r.status === 'SENT' ? '#065f46' : '#92400e' }]}>{r.status}</Text>
                    </View>
                  ) : null}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.recipientsCentered}>
                  <Ionicons name="people-outline" size={40} color={COLORS.secondaryText} />
                  <Text style={styles.recipientsEmptyText}>No recipients found.</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

function SendTab({ branchId, onSent }) {
  const [notificationType, setNotificationType] = useState('EMAIL');
  const [memberType, setMemberType] = useState('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim()) { Alert.alert('Validation', 'Please enter a title.'); return; }
    if (!message.trim()) { Alert.alert('Validation', 'Please enter a message.'); return; }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('branchId', String(branchId));
      formData.append('content', message.trim());
      formData.append('title', title.trim());
      formData.append('notificationType', notificationType);
      formData.append('memberType', memberType);

      await api.post(`/sendMessage/${branchId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Message sent successfully!');
      setTitle('');
      setMessage('');
      setMemberType('ALL');
      onSent?.();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.sendTabContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.sendScrollView} contentContainerStyle={styles.sendScrollContent} showsVerticalScrollIndicator={false}>
        {/* Notification Type Selector */}
        <Text style={styles.fieldLabel}>Notification Type</Text>
        <View style={styles.typeRow}>
          {NOTIFICATION_TYPES.map((t) => {
            const isActive = notificationType === t;
            const color = TYPE_COLORS[t];
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setNotificationType(t)}
                style={[styles.typeBtn, isActive && { backgroundColor: color, borderColor: color }]}
              >
                <Ionicons name={TYPE_ICONS[t]} size={16} color={isActive ? '#fff' : color} />
                <Text style={[styles.typeBtnText, { color: isActive ? '#fff' : color }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Member Type Selector */}
        <Text style={styles.fieldLabel}>Send To</Text>
        <View style={styles.typeRow}>
          {MEMBER_TYPES.map((m) => {
            const isActive = memberType === m;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => setMemberType(m)}
                style={[
                  styles.typeBtn,
                  isActive && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                ]}
              >
                <Text style={[styles.typeBtnText, { color: isActive ? '#fff' : COLORS.primary }]}>
                  {m}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Title */}
        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter message title..."
          placeholderTextColor={COLORS.secondaryText}
          value={title}
          onChangeText={setTitle}
        />

        {/* Message */}
        <Text style={styles.fieldLabel}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your message..."
          placeholderTextColor={COLORS.secondaryText}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.sendBtnText}>Send Message</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function CommunicationScreen() {
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const branchId = currentBranch?.branchId;

  const [activeTab, setActiveTab] = useState('send'); // 'send' | 'history'
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (!branchId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await api.get(`/getMessageHistory/${branchId}?page=${page}&size=10`);
      setHistory(res.data?.data ?? []);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load message history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [branchId, page]);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab, fetchHistory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Communication</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBarItem, activeTab === 'send' && styles.tabBarItemActive]}
          onPress={() => setActiveTab('send')}
        >
          <Ionicons name="send-outline" size={16} color={activeTab === 'send' ? COLORS.primary : COLORS.secondaryText} />
          <Text style={[styles.tabBarText, activeTab === 'send' && styles.tabBarTextActive]}>Send Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBarItem, activeTab === 'history' && styles.tabBarItemActive]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons name="time-outline" size={16} color={activeTab === 'history' ? COLORS.primary : COLORS.secondaryText} />
          <Text style={[styles.tabBarText, activeTab === 'history' && styles.tabBarTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'send' ? (
        <SendTab branchId={branchId} onSent={() => {}} />
      ) : (
        loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, idx) => String(item.messageId ?? item.id ?? idx)}
            renderItem={({ item }) => <HistoryCard item={item} onPress={() => setSelectedMessage(item)} />}
            contentContainerStyle={history.length === 0 ? styles.emptyContainer : styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => fetchHistory(true)} tintColor={COLORS.primary} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={48} color={COLORS.secondaryText} />
                <Text style={styles.emptyText}>No message history yet.</Text>
              </View>
            }
          />
        )
      )}

      <RecipientsModal
        visible={selectedMessage !== null}
        messageId={selectedMessage?.messageId}
        onClose={() => setSelectedMessage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  screenTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 8,
  },
  tabBarItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBarItemActive: { borderBottomColor: COLORS.primary },
  tabBarText: { fontSize: 14, color: COLORS.secondaryText, fontWeight: '500' },
  tabBarTextActive: { color: COLORS.primary, fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, gap: 10 },
  emptyContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.secondaryText, textAlign: 'center' },
  // History Card
  historyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  typeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyCardContent: { flex: 1 },
  historyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  typePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  typePillText: { fontSize: 11, fontWeight: '700' },
  recipientCount: { fontSize: 12, color: COLORS.secondaryText },
  historyDate: { fontSize: 12, color: COLORS.secondaryText, marginTop: 5 },
  // Send Form
  sendTabContainer: { flex: 1 },
  sendScrollView: { flex: 1 },
  sendScrollContent: { padding: 16, gap: 4, paddingBottom: 40 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  typeBtnText: { fontSize: 12, fontWeight: '700' },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 24,
  },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  // Recipients Modal
  recipientsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  recipientsContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: '75%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  recipientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recipientsTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  recipientsCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40, gap: 10 },
  recipientsEmptyText: { fontSize: 14, color: COLORS.secondaryText },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recipientAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipientName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  recipientContact: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  recipientStatusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  recipientStatusText: { fontSize: 11, fontWeight: '700' },
});
