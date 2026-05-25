import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} from '../../services/sections.service';
import { getSubjects } from '../../services/subjects.service';
import { Section, Subject, NewSection } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { useAdminRefresh } from '../../contexts/AdminRefreshContext';

const scheduleOptions = ['MWF', 'TTH', 'DAILY', 'SAT'];
const timeOptions = Array.from({ length: 32 }, (_, index) => {
  const hour = 6 + Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  header: { marginTop: 16, marginBottom: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#64748b' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  buttonPrimary: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  buttonTextSecondary: { color: '#0f172a', fontWeight: '700', marginLeft: 8 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 22, marginTop: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#f8fafb', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14, color: '#0f172a' },
  pickerButton: { backgroundColor: '#f8fafb', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 14 },
  pickerLabel: { color: '#0f172a', fontWeight: '700' },
  pickerHint: { color: '#64748b', marginTop: 6, fontSize: 13 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginBottom: 14 },
  tag: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff', marginHorizontal: 6, marginBottom: 10 },
  tagActive: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  tagText: { color: '#475569', fontWeight: '700' },
  tagTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  cardSubtitle: { color: '#64748b', marginTop: 6, maxWidth: '72%' },
  cardRight: { alignItems: 'flex-end' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  metaItemLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  metaItemValue: { color: '#475569', fontWeight: '700' },
  progressTrack: { height: 10, backgroundColor: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 10 },
  progressFill: { height: 10, borderRadius: 999 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 },
  actionButton: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 18, minWidth: 100, alignItems: 'center' },
  actionEdit: { backgroundColor: '#eff6ff', marginLeft: 10 },
  actionDelete: { backgroundColor: '#fee2e2', marginLeft: 10 },
  actionText: { fontWeight: '700' },
  actionEditText: { color: '#2563eb' },
  actionDeleteText: { color: '#dc2626' },
  emptyState: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 18 },
  emptyText: { color: '#64748b', fontSize: 15, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.35)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, maxHeight: '72%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  modalSearch: { backgroundColor: '#f8fafb', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, color: '#0f172a' },
  modalRow: { paddingVertical: 16, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  modalRowSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  modalRowText: { fontWeight: '700', color: '#0f172a' },
  modalRowSubText: { color: '#64748b', marginTop: 6 },
  timeButtonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  timeBox: { flex: 1, backgroundColor: '#f8fafb', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 16, paddingHorizontal: 16, marginRight: 12 },
  timeBoxLast: { marginRight: 0 },
  timeButtonText: { color: '#0f172a', fontWeight: '700' },
});

const SectionsScreen: React.FC = () => {
  const { bump } = useAdminRefresh();

  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'start' | 'end' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewSection>({
    name: '',
    subject_id: 0,
    schedule: 'MWF',
    time_start: '09:00',
    time_end: '10:30',
    room: '',
    max_capacity: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [sectionData, subjectData] = await Promise.all([getSections(), getSubjects()]);
      setSections(sectionData);
      setSubjects(subjectData);
    } catch (err) {
      console.error(err);
      setError('Failed to load sections or subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedSubject = subjects.find((subject) => subject.id === formData.subject_id);
  const filteredSubjects = useMemo(() => subjects.filter((subject) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return `${subject.code} ${subject.title}`.toLowerCase().includes(query);
  }), [searchQuery, subjects]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      subject_id: 0,
      schedule: 'MWF',
      time_start: '09:00',
      time_end: '10:30',
      room: '',
      max_capacity: 0,
    });
    setError(null);
    setShowForm(false);
  };

  const openTimePicker = (mode: 'start' | 'end') => {
    setTimePickerMode(mode);
    setTimePickerVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.subject_id || !formData.name.trim() || !formData.room.trim() || !formData.time_start || !formData.time_end || !formData.max_capacity) {
      setError('Please complete all section fields before saving.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await updateSection(editingId, formData);
      } else {
        await createSection(formData);
      }

      await loadData();
      resetForm();
      bump();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to save section.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (section: Section) => {
    setEditingId(section.id);
    setFormData({
      name: section.name || '',
      subject_id: typeof section.subject === 'object' ? section.subject.id : section.subject,
      schedule: section.schedule || 'MWF',
      time_start: section.time_start || '09:00',
      time_end: section.time_end || '10:30',
      room: section.room || '',
      max_capacity: section.max_capacity || 0,
    });
    setError(null);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Section', 'Are you sure you want to delete this section?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSection(id);
            await loadData();
            bump();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete section.');
          }
        },
      },
    ]);
  };

  const capacityColor = (percent: number) => {
    if (percent >= 80) return '#dc2626';
    if (percent >= 60) return '#f59e0b';
    return '#22c55e';
  };

  const renderSectionItem = ({ item }: { item: Section }) => {
    const subjectId = typeof item.subject === 'object' ? item.subject.id : item.subject;
    const subject = subjects.find((subj) => subj.id === subjectId);
    const currentEnrollment = item.current_enrollment ?? 0;
    const maxCapacity = item.max_capacity || 1;
    const percent = Math.min(Math.round((currentEnrollment / maxCapacity) * 100), 100);

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.cardTitle}>{subject ? `${subject.code} · ${item.name}` : item.name}</Text>
            <Text style={styles.cardSubtitle}>{subject ? subject.title : 'Subject unavailable'}</Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.badgeText}>{item.schedule}</Text>
            <Text style={{ color: '#64748b', marginTop: 8, textAlign: 'right' }}>{item.time_start} · {item.time_end}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.metaItemLabel}>Room</Text>
            <Text style={styles.metaItemValue}>{item.room || 'TBD'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaItemLabel}>Capacity</Text>
            <Text style={styles.metaItemValue}>{currentEnrollment}/{maxCapacity}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: capacityColor(percent) }]} />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={() => handleEdit(item)}>
            <Text style={[styles.actionText, styles.actionEditText]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionDelete]} onPress={() => handleDelete(item.id)}>
            <Text style={[styles.actionText, styles.actionDeleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#475569', fontWeight: '700' }}>Loading sections...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Sections</Text>
            <Text style={styles.pageSubtitle}>Manage course sections and schedules</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setShowForm((value) => !value)}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.buttonText}>{showForm ? 'Close Form' : 'Add Section'}</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>{editingId ? 'Edit Section' : 'New Section'}</Text>
              {error ? <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text> : null}

              <Text style={styles.label}>Subject</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setSubjectModalVisible(true)}>
                <Text style={styles.pickerLabel}>{selectedSubject ? `${selectedSubject.code} · ${selectedSubject.title}` : 'Tap to select a subject'}</Text>
                <Text style={styles.pickerHint}>{selectedSubject ? 'Change subject' : 'Select subject from list'}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Section Name</Text>
              <TextInput
                placeholder="Section A"
                placeholderTextColor="#94a3b8"
                value={formData.name}
                onChangeText={(value) => setFormData({ ...formData, name: value })}
                style={styles.input}
              />

              <Text style={styles.label}>Schedule</Text>
              <View style={styles.tagRow}>
                {scheduleOptions.map((option) => {
                  const selected = formData.schedule === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.tag, selected && styles.tagActive]}
                      onPress={() => setFormData({ ...formData, schedule: option })}
                    >
                      <Text style={[styles.tagText, selected && styles.tagTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.timeButtonRow}>
                <TouchableOpacity style={styles.timeBox} onPress={() => openTimePicker('start')}>
                  <Text style={styles.timeButtonText}>Start</Text>
                  <Text style={{ color: '#0f172a', marginTop: 8 }}>{formData.time_start}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.timeBox, styles.timeBoxLast]} onPress={() => openTimePicker('end')}>
                  <Text style={styles.timeButtonText}>End</Text>
                  <Text style={{ color: '#0f172a', marginTop: 8 }}>{formData.time_end}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Room</Text>
              <TextInput
                placeholder="Room 101"
                placeholderTextColor="#94a3b8"
                value={formData.room}
                onChangeText={(value) => setFormData({ ...formData, room: value })}
                style={styles.input}
              />

              <Text style={styles.label}>Max Capacity</Text>
              <TextInput
                placeholder="25"
                placeholderTextColor="#94a3b8"
                value={formData.max_capacity ? String(formData.max_capacity) : ''}
                onChangeText={(value) => setFormData({ ...formData, max_capacity: Number(value) || 0 })}
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={resetForm} disabled={saving}>
                  <Text style={[styles.actionText, styles.actionEditText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={handleSubmit} disabled={saving}>
                  <Text style={[styles.actionText, { color: '#fff' }]}>{editingId ? 'Update' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {sections.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No sections yet. Create one to get started.</Text>
            </View>
          ) : (
            <FlatList
              data={sections}
              keyExtractor={(item) => `${item.id}`}
              renderItem={renderSectionItem}
              scrollEnabled={false}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={subjectModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity onPress={() => setSubjectModalVisible(false)}>
                <Text style={{ color: '#2563eb', fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search subjects..."
              placeholderTextColor="#94a3b8"
              style={styles.modalSearch}
            />
            <FlatList
              data={filteredSubjects}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => {
                const selected = formData.subject_id === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setFormData({ ...formData, subject_id: item.id });
                      setSubjectModalVisible(false);
                      setSearchQuery('');
                    }}
                    style={[styles.modalRow, selected && styles.modalRowSelected]}
                  >
                    <Text style={styles.modalRowText}>{item.code}</Text>
                    <Text style={styles.modalRowSubText}>{item.title}</Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={<Text style={{ color: '#64748b', textAlign: 'center', marginTop: 16 }}>No subjects found.</Text>}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={timePickerVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pick {timePickerMode === 'start' ? 'Start' : 'End'} Time</Text>
              <TouchableOpacity onPress={() => setTimePickerVisible(false)}>
                <Text style={{ color: '#2563eb', fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={timeOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (timePickerMode) {
                      setFormData({
                        ...formData,
                        [timePickerMode === 'start' ? 'time_start' : 'time_end']: item,
                      });
                    }
                    setTimePickerVisible(false);
                  }}
                  style={styles.modalRow}
                >
                  <Text style={styles.modalRowText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ color: '#64748b', textAlign: 'center', marginTop: 16 }}>No times available.</Text>}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SectionsScreen;
