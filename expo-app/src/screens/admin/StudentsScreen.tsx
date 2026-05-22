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
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/students.service';
import { Student, NewStudent } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const yearLevels = ['1st', '2nd', '3rd', '4th'];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  header: { marginTop: 16, marginBottom: 18, paddingHorizontal: 4 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#64748b' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  actionButton: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  searchBox: { marginTop: 18, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 10 },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 14, color: '#0f172a', marginBottom: 12 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginTop: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  label: { color: '#475569', fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  smallInput: { flex: 1, minWidth: 140 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1' },
  pillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  pillText: { color: '#475569' },
  pillTextActive: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { color: '#64748b', marginTop: 6 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  metaLabel: { color: '#475569', fontSize: 13 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, gap: 12 },
  smallButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  editButton: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#2563eb' },
  deleteButton: { backgroundColor: '#fee2e2' },
  editText: { color: '#2563eb', fontWeight: '700' },
  deleteText: { color: '#dc2626', fontWeight: '700' },
  emptyState: { backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'center', marginTop: 18 },
  emptyText: { color: '#64748b' },
});

const StudentsScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewStudent>({
    student_id: '',
    name: '',
    email: '',
    course: '',
    year_level: '1st',
    age: 18,
  });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ student_id: '', name: '', email: '', course: '', year_level: '1st', age: 18 });
    setShowForm(false);
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      course: student.course,
      year_level: student.year_level,
      age: student.age ?? 18,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.student_id || !formData.name || !formData.email || !formData.course) {
      setError('Student ID, name, email, and course are required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await updateStudent(editingId, formData);
      } else {
        await createStudent(formData);
      }
      await loadStudents();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to save student.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Student', 'Are you sure you want to delete this student?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStudent(id);
            await loadStudents();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete student.');
          }
        },
      },
    ]);
  };

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.student_id.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    );
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

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
        <ScrollView contentContainerStyle={styles.content} refreshControl={undefined}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Students</Text>
            <Text style={styles.pageSubtitle}>Manage student records and enrollments</Text>
          </View>

          <View style={styles.topRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowForm((value) => !value)}>
              <Ionicons name="person-add" size={18} color="#fff" />
              <Text style={styles.actionText}>{showForm ? 'Close Form' : 'New Student'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#94a3b8' }]} onPress={onRefresh}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.actionText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search student by name, ID, email, or course"
            value={search}
            onChangeText={setSearch}
            style={styles.searchBox}
            placeholderTextColor="#94a3b8"
          />

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>{editingId ? 'Edit Student' : 'New Student'}</Text>
              {error ? <Text style={{ color: '#dc2626', marginBottom: 10 }}>{error}</Text> : null}
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="STU001"
                value={formData.student_id}
                onChangeText={(value) => setFormData({ ...formData, student_id: value })}
                autoCapitalize="characters"
              />
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={formData.name}
                onChangeText={(value) => setFormData({ ...formData, name: value })}
              />
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                value={formData.email}
                onChangeText={(value) => setFormData({ ...formData, email: value })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.label}>Course</Text>
              <TextInput
                style={styles.input}
                placeholder="BS Computer Science"
                value={formData.course}
                onChangeText={(value) => setFormData({ ...formData, course: value })}
              />
              <View style={styles.row}>
                <View style={[styles.input, styles.smallInput, { paddingVertical: 0, paddingHorizontal: 0 }]}> 
                  <Text style={[styles.label, { marginBottom: 6 }]}>Year Level</Text>
                  <View style={styles.pillRow}>
                    {yearLevels.map((level) => {
                      const active = formData.year_level === level;
                      return (
                        <TouchableOpacity
                          key={level}
                          style={[styles.pill, active && styles.pillActive]}
                          onPress={() => setFormData({ ...formData, year_level: level })}
                        >
                          <Text style={[styles.pillText, active && styles.pillTextActive]}>{level} Year</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View style={[styles.smallInput, { flex: 1 }]}> 
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="18"
                    value={formData.age?.toString() ?? ''}
                    onChangeText={(value) => setFormData({ ...formData, age: Number(value) || 0 })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={[styles.row, { justifyContent: 'flex-end' }]}> 
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#e2e8f0' }]} onPress={resetForm}>
                  <Text style={{ color: '#475569', fontWeight: '700' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#2563eb' }]} onPress={handleSave} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{editingId ? 'Update' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {filteredStudents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No students found. Use New Student to add one.</Text>
            </View>
          ) : (
            filteredStudents.map((student) => (
              <View key={student.id} style={styles.card}>
                <Text style={styles.cardTitle}>{student.name}</Text>
                <Text style={styles.cardSubtitle}>{student.student_id} • {student.course}</Text>
                <Text style={[styles.metaLabel, { marginTop: 10 }]}>{student.email}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{student.year_level} Year</Text>
                  <Text style={styles.metaLabel}>{student.age ?? '-'} years</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={[styles.smallButton, styles.editButton]} onPress={() => handleEdit(student)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallButton, styles.deleteButton]} onPress={() => handleDelete(student.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
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

export default StudentsScreen;
