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
  KeyboardAvoidingView,
  Platform,
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

const TEMPLATE_TYPES = ['ALL', 'COMMUNICATION', 'BOOKING', 'INVOICE', 'FORM'];

const TYPE_COLORS = {
  COMMUNICATION: '#6366f1',
  BOOKING: '#10b981',
  INVOICE: '#f59e0b',
  FORM: '#8b5cf6',
};

const TYPE_ICONS = {
  COMMUNICATION: 'chatbubbles-outline',
  BOOKING: 'calendar-outline',
  INVOICE: 'receipt-outline',
  FORM: 'document-text-outline',
};

function TemplateFormModal({ visible, template, studioId, onClose, onSaved }) {
  const isEdit = !!template;
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('COMMUNICATION');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [saving, setSaving] = useState(false);

  const FORM_TYPES = TEMPLATE_TYPES.filter((t) => t !== 'ALL');

  useEffect(() => {
    if (template) {
      setTemplateName(template.templateName ?? '');
      setTemplateType(template.templateType ?? 'COMMUNICATION');
      setTemplateSubject(template.templateSubject ?? template.title ?? '');
      setTemplateContent(template.templateContent ?? template.content ?? '');
    } else {
      setTemplateName('');
      setTemplateType('COMMUNICATION');
      setTemplateSubject('');
      setTemplateContent('');
    }
  }, [template, visible]);

  const handleSave = async () => {
    if (!templateName.trim()) { Alert.alert('Validation', 'Template name is required.'); return; }
    if (!templateSubject.trim()) { Alert.alert('Validation', 'Subject is required.'); return; }

    setSaving(true);
    try {
      const payload = {
        templateName: templateName.trim(),
        templateType,
        templateSubject: templateSubject.trim(),
        templateContent: templateContent.trim(),
        studioId,
      };

      if (isEdit) {
        await api.put(`/genericTemplate/update/${template.id}`, payload);
      } else {
        await api.post('/genericTemplate/add', payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to save template.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formSheet}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{isEdit ? 'Edit Template' : 'New Template'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Template Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter template name"
              placeholderTextColor={COLORS.secondaryText}
              value={templateName}
              onChangeText={setTemplateName}
            />

            <Text style={styles.fieldLabel}>Template Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typePillsScroll}>
              {FORM_TYPES.map((t) => {
                const isActive = templateType === t;
                const color = TYPE_COLORS[t] ?? COLORS.primary;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTemplateType(t)}
                    style={[styles.typePill, isActive && { backgroundColor: color, borderColor: color }]}
                  >
                    <Text style={[styles.typePillText, isActive && styles.typePillTextActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.fieldLabel}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter template subject"
              placeholderTextColor={COLORS.secondaryText}
              value={templateSubject}
              onChangeText={setTemplateSubject}
            />

            <Text style={styles.fieldLabel}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter template content..."
              placeholderTextColor={COLORS.secondaryText}
              value={templateContent}
              onChangeText={setTemplateContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.formActions}>
              <TouchableOpacity onPress={onClose} style={[styles.formBtn, styles.cancelBtn]}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.formBtn, styles.saveBtn]} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>{isEdit ? 'Update' : 'Create'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function TemplateDetailModal({ visible, template, onClose }) {
  if (!template) return null;
  const color = TYPE_COLORS[template.templateType] ?? COLORS.primary;
  const icon = TYPE_ICONS[template.templateType] ?? 'document-outline';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.detailSheet}>
          <View style={styles.formHeader}>
            <View style={styles.detailTitleRow}>
              <View style={[styles.detailIconWrap, { backgroundColor: color + '18' }]}>
                <Ionicons name={icon} size={20} color={color} />
              </View>
              <Text style={styles.formTitle} numberOfLines={2}>{template.templateSubject ?? template.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.secondaryText} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailMeta}>
            <Text style={styles.detailName}>{template.templateName}</Text>
            <View style={[styles.typeTag, { backgroundColor: color + '18' }]}>
              <Text style={[styles.typeTagText, { color }]}>{template.templateType}</Text>
            </View>
          </View>

          <ScrollView style={styles.detailContentScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.detailContentText}>{template.templateContent ?? template.content ?? '(No content)'}</Text>
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.detailCloseBtn}>
            <Text style={styles.detailCloseBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function TemplateCard({ item, onEdit, onDelete, onView }) {
  const color = TYPE_COLORS[item.templateType] ?? COLORS.primary;
  const icon = TYPE_ICONS[item.templateType] ?? 'document-outline';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onView(item)} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconWrap, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.templateName} numberOfLines={1}>{item.templateName}</Text>
          <Text style={styles.templateTitle} numberOfLines={1}>{item.templateSubject ?? item.title}</Text>
        </View>
        <View style={[styles.typeTag, { backgroundColor: color + '18' }]}>
          <Text style={[styles.typeTagText, { color }]}>{item.templateType}</Text>
        </View>
      </View>

      {(item.templateContent ?? item.content) ? (
        <Text style={styles.contentPreview} numberOfLines={2}>{item.templateContent ?? item.content}</Text>
      ) : null}

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionChip} onPress={() => onEdit(item)}>
          <Ionicons name="pencil-outline" size={14} color={COLORS.primary} />
          <Text style={[styles.actionChipText, { color: COLORS.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionChip, styles.deleteChip]} onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
          <Text style={[styles.actionChipText, { color: COLORS.danger }]}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionChip, styles.viewChip]} onPress={() => onView(item)}>
          <Ionicons name="eye-outline" size={14} color={COLORS.success} />
          <Text style={[styles.actionChipText, { color: COLORS.success }]}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function TemplatesScreen() {
  const studio = useSelector((state) => state.auth.studio);
  const studioId = studio?.studioId;

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeType, setActiveType] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [page] = useState(1);

  const fetchTemplates = useCallback(async (isRefresh = false) => {
    if (!studioId) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const typeParam = activeType === 'ALL' ? '' : activeType;
      const res = await api.get(
        `/genericTemplate/getAll/${studioId}?page=${page}&size=10&templateType=${typeParam}&searchTerm=`
      );
      setTemplates(res.data?.data ?? []);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to load templates.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studioId, activeType, page]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = (template) => {
    Alert.alert(
      'Delete Template',
      `Delete "${template.templateName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/genericTemplate/delete/${template.id}`);
              setTemplates((prev) => prev.filter((t) => t.id !== template.id));
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.status?.statusMessage || 'Failed to delete template.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const filteredTemplates = activeType === 'ALL'
    ? templates
    : templates.filter((t) => t.templateType === activeType);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Templates</Text>
        <Text style={styles.headerCount}>{filteredTemplates.length}</Text>
      </View>

      {/* Type Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={styles.tabScrollContent}
      >
        {TEMPLATE_TYPES.map((t) => {
          const isActive = activeType === t;
          const color = t === 'ALL' ? COLORS.primary : (TYPE_COLORS[t] ?? COLORS.primary);
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveType(t)}
              style={[styles.typeFilterTab, isActive && { backgroundColor: color, borderColor: color }]}
            >
              {t !== 'ALL' && (
                <Ionicons name={TYPE_ICONS[t] ?? 'document-outline'} size={13} color={isActive ? '#fff' : color} />
              )}
              <Text style={[styles.typeFilterTabText, { color: isActive ? '#fff' : (t === 'ALL' ? COLORS.secondaryText : color) }]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTemplates}
          keyExtractor={(item, idx) => String(item.id ?? idx)}
          renderItem={({ item }) => (
            <TemplateCard
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={(t) => setViewingTemplate(t)}
            />
          )}
          contentContainerStyle={filteredTemplates.length === 0 ? styles.emptyContainer : styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchTemplates(true)} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.secondaryText} />
              <Text style={styles.emptyText}>No templates found.</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => { setEditingTemplate(null); setShowForm(true); }} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <TemplateFormModal
        visible={showForm}
        template={editingTemplate}
        studioId={studioId}
        onClose={handleFormClose}
        onSaved={fetchTemplates}
      />

      <TemplateDetailModal
        visible={!!viewingTemplate}
        template={viewingTemplate}
        onClose={() => setViewingTemplate(null)}
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
  headerCount: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tabScrollView: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexGrow: 0,
  },
  tabScrollContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  typeFilterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  typeFilterTabText: { fontSize: 12, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.secondaryText, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  templateName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  templateTitle: { fontSize: 13, color: COLORS.secondaryText, marginTop: 2 },
  typeTag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeTagText: { fontSize: 11, fontWeight: '700' },
  contentPreview: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 10,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deleteChip: { borderColor: COLORS.danger + '40', backgroundColor: '#fff1f2' },
  viewChip: { borderColor: COLORS.success + '40', backgroundColor: '#f0fdf4' },
  actionChipText: { fontSize: 12, fontWeight: '600' },
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
  // Form Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  formSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, flex: 1 },
  closeBtn: { padding: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 14 },
  typePillsScroll: { flexGrow: 0 },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  typePillText: { fontSize: 13, fontWeight: '600', color: COLORS.secondaryText },
  typePillTextActive: { color: '#fff' },
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
  textArea: { height: 140, paddingTop: 12 },
  formActions: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 8 },
  formBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#f3f4f6' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
  saveBtn: { backgroundColor: COLORS.primary },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  // Detail Modal
  detailSheet: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    margin: 20,
    padding: 20,
    maxHeight: '80%',
  },
  detailTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 8 },
  detailIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 14 },
  detailName: { fontSize: 14, color: COLORS.secondaryText, fontWeight: '500' },
  detailContentScroll: { maxHeight: 300 },
  detailContentText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  detailCloseBtn: {
    marginTop: 20,
    backgroundColor: '#f3f4f6',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailCloseBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.secondaryText },
});
