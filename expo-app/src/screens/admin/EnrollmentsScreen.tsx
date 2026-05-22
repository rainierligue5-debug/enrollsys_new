import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getEnrollments,
  createEnrollment,
  bulkEnroll,
} from '../../services/enrollments.service';
import { getStudents } from '../../services/students.service';
import { getSections } from '../../services/sections.service';
import { Enrollment, Student, Section, NewEnrollment } from '../../types';
import { Ionicons } from '@expo/vector-icons';

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
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  pillActive: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  pillText: { color: '#475569' },
  pillTextActive: { color: '#fff', fontWeight: '700' },
  selectCard: { backgroundColor: '#f8fafb', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0' },
});

const EnrollmentsScreen: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [formData, setFormData] = useState<NewEnrollment>({ student_id: 0, section_id: 0 });
  const [bulkItems, setBulkItems] = useState<Array<{ student_id: number; section_id: number; subject_id: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [enrollmentData, studentData, sectionData] = await Promise.all([getEnrollments(), getStudents(), getSections()]);
      setEnrollments(enrollmentData);
      setStudents(studentData);
      setSections(sectionData);
    } catch (err) {
      console.error(err);
      setError('Failed to load enrollment data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setFormData({ student_id: 0, section_id: 0 });
    setError(null);
  };

  const addBulkItem = () => {
    if (!formData.student_id || !formData.section_id) {
      setError('Select both student and section before adding a bulk item.');
      return;
    }
    const selectedSection = sections.find((section) => section.id === formData.section_id);
    const subjectId = selectedSection
      ? typeof selectedSection.subject === 'number'
        ? selectedSection.subject
        : selectedSection.subject.id
      : 0;

    if (!selectedSection || !subjectId) {
      setError('Please select a valid section with a subject.');
      return;
    }

    setBulkItems((current) => [
      ...current,
      { student_id: formData.student_id, section_id: formData.section_id, subject_id: subjectId },
    ]);
    setFormData({ student_id: 0, section_id: 0 });
    setError(null);
  };

  const submitBulkEnrollments = async () => {
    if (bulkItems.length === 0) {
      setError('Add at least one bulk enrollment item.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await bulkEnroll(bulkItems);
      await loadData();
      setBulkItems([]);
      setShowBulk(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Bulk enrollment failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.student_id || !formData.section_id) {
      setError('Student and section are required.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await createEnrollment(formData);
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to save enrollment.');
    } finally {
      setSaving(false);
    }
  };

  const getStudentName = (studentId: number) => students.find((student) => student.id === studentId)?.name || 'Unknown student';
  const getSectionName = (sectionId: number) => sections.find((section) => section.id === sectionId)?.name || 'Unknown section';

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
            <Text style={styles.pageTitle}>Enrollments</Text>
            <Text style={styles.pageSubtitle}>Assign students to sections and manage bulk enrollments</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => { setShowForm((value) => !value); setShowBulk(false); }}>
              <Ionicons name="person-add" size={18} color="#fff" />
              <Text style={styles.buttonText}>{showForm ? 'Close Form' : 'New Enrollment'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => { setShowBulk((value) => !value); setShowForm(false); }}>
              <Ionicons name="layers" size={18} color="#0f172a" />
              <Text style={styles.buttonTextSecondary}>{showBulk ? 'Close Bulk' : 'Bulk Enroll'}</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={{ color: '#dc2626', marginTop: 12 }}>{error}</Text> : null}

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Create Enrollment</Text>
              <Text style={styles.label}>Student</Text>
              <View style={styles.selectCard}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>{getStudentName(formData.student_id)}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeRow}>
                {students.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.pill, formData.student_id === student.id && styles.pillActive]}
                    onPress={() => setFormData({ ...formData, student_id: student.id })}
                  >
                    <Text style={[styles.pillText, formData.student_id === student.id && styles.pillTextActive]}>{student.student_id}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Section</Text>
              <View style={styles.selectCard}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>{getSectionName(formData.section_id)}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeRow}>
                {sections.map((section) => (
                  <TouchableOpacity
                    key={section.id}
                    style={[styles.pill, formData.section_id === section.id && styles.pillActive]}
                    onPress={() => setFormData({ ...formData, section_id: section.id })}
                  >
                    <Text style={[styles.pillText, formData.section_id === section.id && styles.pillTextActive]}>{section.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.actionRow, { justifyContent: 'flex-end' }]}> 
                <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={resetForm}>
                  <Text style={styles.actionEditText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={handleSubmit} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Enroll</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showBulk && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Bulk Enrollment</Text>
              <Text style={styles.label}>Pick student and section, then add to batch.</Text>
              <Text style={styles.label}>Student</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeRow}>
                {students.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.pill, formData.student_id === student.id && styles.pillActive]}
                    onPress={() => setFormData({ ...formData, student_id: student.id })}
                  >
                    <Text style={[styles.pillText, formData.student_id === student.id && styles.pillTextActive]}>{student.student_id}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Section</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeRow}>
                {sections.map((section) => (
                  <TouchableOpacity
                    key={section.id}
                    style={[styles.pill, formData.section_id === section.id && styles.pillActive]}
                    onPress={() => setFormData({ ...formData, section_id: section.id })}
                  >
                    <Text style={[styles.pillText, formData.section_id === section.id && styles.pillTextActive]}>{section.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.actionRow, { justifyContent: 'flex-end' }]}> 
                <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={addBulkItem}>
                  <Text style={styles.actionEditText}>Add Item</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={submitBulkEnrollments} disabled={saving || bulkItems.length === 0}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Submit Bulk</Text>
                </TouchableOpacity>
              </View>

              {bulkItems.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  {bulkItems.map((item, index) => (
                    <View key={`${item.student_id}-${item.section_id}-${index}`} style={[styles.card, { marginBottom: 10 }]}> 
                      <Text style={styles.cardTitle}>{getStudentName(item.student_id)}</Text>
                      <Text style={styles.cardSubtitle}>{getSectionName(item.section_id)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {enrollments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No enrollments yet.</Text>
            </View>
          ) : (
            enrollments.map((enrollment) => {
              const student = enrollment.student as Student;
              const section = enrollment.section as Section;
              return (
                <View key={enrollment.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{student?.name || 'Unknown student'}</Text>
                  <Text style={styles.cardSubtitle}>{section?.name || 'Unknown section'}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaItem}>{student?.student_id}</Text>
                    <Text style={styles.metaItem}>{section?.schedule || ''}</Text>
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

export default EnrollmentsScreen;
