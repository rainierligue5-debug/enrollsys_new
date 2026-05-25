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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../services/subjects.service';
import { Subject, NewSubject } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { useAdminRefresh } from '../../contexts/AdminRefreshContext';


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
  formRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  halfInput: { flex: 1, minWidth: 140 },
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

const SubjectsScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { bump } = useAdminRefresh();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewSubject>({ code: '', title: '', description: '', units: 0 });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSubjects(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ code: '', title: '', description: '', units: 0 });
    setError(null);
    setShowForm(false);
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setFormData({ code: subject.code, title: subject.title, description: subject.description, units: subject.units });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.title || !formData.units) {
      setError('Subject code, title, and units are required.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateSubject(editingId, formData);
      } else {
        await createSubject(formData);
      }
      await loadSubjects();
      resetForm();
      bump();
    } catch (err: any) {

      console.error(err);
      setError(err?.response?.data?.error || 'Failed to save subject.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Subject', 'Are you sure you want to delete this subject?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSubject(id);
            await loadSubjects();
            bump();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete subject.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Subjects</Text>
            <Text style={styles.pageSubtitle}>Manage academic subjects and courses</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setShowForm((value) => !value)}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.buttonText}>{showForm ? 'Close' : 'Add Subject'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={loadSubjects}>
              <Ionicons name="refresh" size={18} color="#0f172a" />
              <Text style={styles.buttonTextSecondary}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>{editingId ? 'Edit Subject' : 'New Subject'}</Text>
              {error ? <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text> : null}
              <Text style={styles.label}>Subject Code</Text>
              <TextInput
                value={formData.code}
                onChangeText={(value) => setFormData({ ...formData, code: value })}
                placeholder="CS101"
                style={styles.input}
                autoCapitalize="characters"
              />
              <Text style={styles.label}>Subject Title</Text>
              <TextInput
                value={formData.title}
                onChangeText={(value) => setFormData({ ...formData, title: value })}
                placeholder="Introduction to Computing"
                style={styles.input}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={formData.description}
                onChangeText={(value) => setFormData({ ...formData, description: value })}
                placeholder="Brief description"
                style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
                multiline
              />
              <Text style={styles.label}>Units</Text>
              <TextInput
                value={formData.units?.toString() ?? ''}
                onChangeText={(value) => setFormData({ ...formData, units: Number(value) || 0 })}
                placeholder="0"
                style={styles.input}
                keyboardType="numeric"
              />
              <View style={[styles.actionsRow, { justifyContent: 'flex-end' }]}> 
                <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={resetForm}>
                  <Text style={styles.actionEditText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={handleSubmit} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{editingId ? 'Update' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : subjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No subjects yet. Add one to begin.</Text>
            </View>
          ) : (
            subjects.map((subject) => (
              <View key={subject.id} style={styles.card}>
                <Text style={styles.cardTitle}>{subject.code}</Text>
                <Text style={styles.cardSubtitle}>{subject.title}</Text>
                <Text style={[styles.metaItem, { marginTop: 12 }]} numberOfLines={2}>{subject.description}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaItem}>{subject.units} units</Text>
                  <Text style={styles.metaItem}>{new Date(subject.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={() => handleEdit(subject)}>
                    <Text style={styles.actionEditText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionDelete]} onPress={() => handleDelete(subject.id)}>
                    <Text style={styles.actionDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SubjectsScreen;
