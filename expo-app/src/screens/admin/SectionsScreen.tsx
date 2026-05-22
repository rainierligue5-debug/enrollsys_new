import React, { useEffect, useState } from 'react';
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

const scheduleOptions = ['MWF', 'TTH', 'MW', 'TT'];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  header: { marginTop: 16, marginBottom: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#64748b' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  buttonPrimary: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, flexDirection: 'row', alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  buttonTextSecondary: { color: '#0f172a', fontWeight: '700', marginLeft: 8 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#f8fafb', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14, color: '#0f172a' },
  selectCard: { backgroundColor: '#f8fafb', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  pillActive: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  pillText: { color: '#475569' },
  pillTextActive: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { color: '#64748b', marginTop: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  metaItem: { color: '#475569', fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 14 },
  actionButton: { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  actionEdit: { backgroundColor: '#eff6ff' },
  actionDelete: { backgroundColor: '#fee2e2' },
  actionEditText: { color: '#2563eb', fontWeight: '700' },
  actionDeleteText: { color: '#dc2626', fontWeight: '700' },
  emptyState: { backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'center', marginTop: 18 },
  emptyText: { color: '#64748b' },
});

const SectionsScreen: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewSection>({
    name: '',
    subject_id: 0,
    schedule: 'MWF',
    time_start: '09:00',
    time_end: '10:30',
    room: '',
    max_capacity: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      subject_id: subjects[0]?.id ?? 0,
      schedule: 'MWF',
      time_start: '09:00',
      time_end: '10:30',
      room: '',
      max_capacity: 0,
    });
    setError(null);
    setShowForm(false);
  };

  const handleEdit = (section: Section) => {
    setEditingId(section.id);
    setFormData({
      name: section.name,
      subject_id: typeof section.subject === 'object' ? section.subject.id : section.subject,
      schedule: section.schedule || 'MWF',
      time_start: section.time_start || '09:00',
      time_end: section.time_end || '10:30',
      room: section.room || '',
      max_capacity: section.max_capacity || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.subject_id || !formData.room || !formData.max_capacity || !formData.time_start || !formData.time_end) {
      setError('Name, subject, schedule, room, capacity, and time range are required.');
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
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to save section.');
    } finally {
      setSaving(false);
    }
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
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete section.');
          }
        },
      },
    ]);
  };

  const selectedSubject = subjects.find((subject) => subject.id === formData.subject_id);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
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
            <Text style={styles.pageSubtitle}>Organize course sections and schedules</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setShowForm((value) => !value)}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.buttonText}>{showForm ? 'Close Form' : 'Create Section'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={loadData}>
              <Ionicons name="refresh" size={18} color="#0f172a" />
              <Text style={styles.buttonTextSecondary}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>{editingId ? 'Edit Section' : 'New Section'}</Text>
              {error ? <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text> : null}
              <Text style={styles.label}>Section Name</Text>
              <TextInput
                placeholder="Section A"
                value={formData.name}
                onChangeText={(value) => setFormData({ ...formData, name: value })}
                style={styles.input}
              />

              <Text style={styles.label}>Subject</Text>
              <View style={styles.selectCard}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>{selectedSubject?.code || 'Select subject'}</Text>
                <Text style={{ color: '#64748b', marginTop: 6 }}>{selectedSubject?.title || 'Tap a subject to choose'}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                <View style={styles.badgeRow}>
                  {subjects.map((subject) => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[styles.pill, formData.subject_id === subject.id && styles.pillActive]}
                      onPress={() => setFormData({ ...formData, subject_id: subject.id })}
                    >
                      <Text style={[styles.pillText, formData.subject_id === subject.id && styles.pillTextActive]}>{subject.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.label}>Schedule</Text>
              <View style={styles.badgeRow}>
                {scheduleOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.pill, formData.schedule === option && styles.pillActive]}
                    onPress={() => setFormData({ ...formData, schedule: option })}
                  >
                    <Text style={[styles.pillText, formData.schedule === option && styles.pillTextActive]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Room</Text>
              <TextInput
                placeholder="Room 101"
                value={formData.room}
                onChangeText={(value) => setFormData({ ...formData, room: value })}
                style={styles.input}
              />

              <Text style={styles.label}>Start Time</Text>
              <TextInput
                placeholder="09:00"
                value={formData.time_start}
                onChangeText={(value) => setFormData({ ...formData, time_start: value })}
                style={styles.input}
              />

              <Text style={styles.label}>End Time</Text>
              <TextInput
                placeholder="10:30"
                value={formData.time_end}
                onChangeText={(value) => setFormData({ ...formData, time_end: value })}
                style={styles.input}
              />

              <Text style={styles.label}>Capacity</Text>
              <TextInput
                placeholder="25"
                value={formData.max_capacity ? formData.max_capacity.toString() : ''}
                onChangeText={(value) => setFormData({ ...formData, max_capacity: Number(value) || 0 })}
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={[styles.actionRow, { justifyContent: 'flex-end' }]}> 
                <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={resetForm}>
                  <Text style={styles.actionEditText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={handleSubmit} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{editingId ? 'Update' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {sections.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No sections created yet.</Text>
            </View>
          ) : (
            sections.map((section) => {
              const subject = subjects.find((subj) => subj.id === (typeof section.subject === 'object' ? section.subject.id : section.subject));
              return (
                <View key={section.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{section.name}</Text>
                  <Text style={styles.cardSubtitle}>{subject ? `${subject.code} • ${subject.title}` : 'Subject not assigned'}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaItem}>{section.schedule}</Text>
                    <Text style={styles.metaItem}>{section.room}</Text>
                    <Text style={styles.metaItem}>{section.max_capacity} seats</Text>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={() => handleEdit(section)}>
                      <Text style={styles.actionEditText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.actionDelete]} onPress={() => handleDelete(section.id)}>
                      <Text style={styles.actionDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SectionsScreen;
