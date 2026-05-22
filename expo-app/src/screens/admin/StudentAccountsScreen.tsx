import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStudents } from '../../services/students.service';
import { getStudentUsers, createStudentUser, updateStudentUser, deleteStudentUser } from '../../services/user.service';
import { Student, AdminStudentUser } from '../../types';
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
  input: { backgroundColor: '#f8fafb', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14, color: '#0f172a' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardSubtitle: { color: '#64748b', marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  metaItem: { color: '#475569', fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 14 },
  actionButton: { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  actionEdit: { backgroundColor: '#eff6ff' },
  actionDelete: { backgroundColor: '#fee2e2' },
  actionEditText: { color: '#2563eb', fontWeight: '700' },
  actionDeleteText: { color: '#dc2626', fontWeight: '700' },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#ecfdf5' },
  statusText: { color: '#047857', fontWeight: '700' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  pill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  pillActive: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  pillText: { color: '#475569' },
  pillTextActive: { color: '#fff', fontWeight: '700' },
  emptyState: { backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'center', marginTop: 18 },
  emptyText: { color: '#64748b' },
});

const StudentAccountsScreen: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [accounts, setAccounts] = useState<AdminStudentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ student: 0, email: '', password: '', re_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentData, accountData] = await Promise.all([getStudents(), getStudentUsers()]);
      setStudents(studentData);
      setAccounts(accountData);
    } catch (err) {
      console.error(err);
      setError('Failed to load student account data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ student: 0, email: '', password: '', re_password: '' });
    setShowPassword(false);
    setError(null);
  };

  const handleEdit = (account: AdminStudentUser) => {
    setEditingId(account.id);
    setFormData({ student: account.student ?? 0, email: account.email, password: '', re_password: '' });
    setShowForm(true);
  };

  const selectedStudent = students.find((student) => student.id === formData.student);

  const handleSubmit = async () => {
    if (!formData.student || !formData.email) {
      setError('Student and email are required.');
      return;
    }
    if (!selectedStudent) {
      setError('Please choose a valid student.');
      return;
    }
    if (!editingId && (!formData.password || !formData.re_password)) {
      setError('Password fields are required when creating an account.');
      return;
    }
    if (formData.password !== formData.re_password) {
      setError('Passwords must match.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload = {
        name: selectedStudent.name,
        email: formData.email,
        password: formData.password || undefined,
        student_id: selectedStudent.student_id,
      };
      if (editingId) {
        await updateStudentUser(editingId, payload);
      } else {
        await createStudentUser(payload);
      }
      await loadData();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to save account.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (accountId: number) => {
    Alert.alert('Delete Account', 'Remove this student account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStudentUser(accountId);
            await loadData();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete account.');
          }
        },
      },
    ]);
  };

  const getStudentName = (studentId: number) => students.find((student) => student.id === studentId)?.name || 'Unknown student';

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
            <Text style={styles.pageTitle}>Student Accounts</Text>
            <Text style={styles.pageSubtitle}>Create, edit, and manage student login accounts</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => { resetForm(); setShowForm((value) => !value); }}>
              <Ionicons name="person-add" size={18} color="#fff" />
              <Text style={styles.buttonText}>{showForm ? 'Close Form' : 'New Account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={loadData}>
              <Ionicons name="refresh" size={18} color="#0f172a" />
              <Text style={styles.buttonTextSecondary}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={{ color: '#dc2626', marginTop: 12 }}>{error}</Text> : null}

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>{editingId ? 'Edit Account' : 'Create Account'}</Text>
              <Text style={styles.label}>Student</Text>
              <View style={styles.pillRow}>
                {students.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.pill, formData.student === student.id && styles.pillActive]}
                    onPress={() => setFormData({ ...formData, student: student.id })}
                  >
                    <Text style={[styles.pillText, formData.student === student.id && styles.pillTextActive]}>{student.student_id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => setFormData({ ...formData, email: value })}
                placeholder="student@example.com"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={formData.password}
                onChangeText={(value) => setFormData({ ...formData, password: value })}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                value={formData.re_password}
                onChangeText={(value) => setFormData({ ...formData, re_password: value })}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword((value) => !value)} style={{ marginBottom: 14 }}>
                <Text style={{ color: '#2563eb', fontWeight: '700' }}>{showPassword ? 'Hide passwords' : 'Show passwords'}</Text>
              </TouchableOpacity>
              <View style={[styles.actionRow, { justifyContent: 'flex-end' }]}> 
                <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={resetForm}>
                  <Text style={styles.actionEditText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={handleSubmit} disabled={saving}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{editingId ? 'Update' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {accounts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No accounts available.</Text>
            </View>
          ) : (
            accounts.map((account) => (
              <View key={account.id} style={styles.card}>
                <Text style={styles.cardTitle}>{getStudentName(account.student ?? 0)}</Text>
                <Text style={styles.cardSubtitle}>{account.email}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{account.is_active ? 'Active' : 'Inactive'}</Text>
                  </View>
                  <Text style={styles.metaItem}>{account.role || 'Student'}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.actionButton, styles.actionEdit]} onPress={() => handleEdit(account)}>
                    <Text style={styles.actionEditText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionDelete]} onPress={() => handleDelete(account.id)}>
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

export default StudentAccountsScreen;
