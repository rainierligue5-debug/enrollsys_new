import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { useAdminRefresh } from '../../contexts/AdminRefreshContext';
import {
  getEnrollments,
  createEnrollment,
  bulkEnroll,
  dropEnrollment,
  deleteEnrollment,
} from '../../services/enrollments.service';
import { getStudents } from '../../services/students.service';
import { getSubjects } from '../../services/subjects.service';
import { getSections } from '../../services/sections.service';

import AdminSearchSelectModal from '../../components/AdminSearchSelectModal';
import type { AdminSearchSelectOption } from '../../components/AdminSearchSelectModal';


import { Enrollment, NewEnrollment, Section, Student, Subject } from '../../types';

type BulkItem = {
  student_id: number;
  subject_id: number;
  section_id?: number;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 6 },

  header: { marginTop: 16, marginBottom: 18 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#64748b', lineHeight: 18, maxWidth: 320 },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  buttonPrimary: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 10,
    justifyContent: 'center',
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginLeft: 10,
    justifyContent: 'center',
  },

  buttonText: { color: '#fff', fontWeight: '900', marginLeft: 10, fontSize: 14 },
  buttonTextSecondary: { color: '#0f172a', fontWeight: '900', marginLeft: 10, fontSize: 14 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '800', color: '#475569', marginBottom: 8 },

  pickerCard: {
    backgroundColor: '#f8fafb',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  pickerValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerValueText: { color: '#0f172a', fontWeight: '900', fontSize: 14 },
  pickerHintText: { color: '#64748b', fontWeight: '800', fontSize: 12, marginTop: 6 },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 14 },
  actionButton: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, justifyContent: 'center' },
  actionText: { fontWeight: '900', fontSize: 14 },

  errorBanner: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerText: { fontWeight: '900', color: '#991b1b' },
  bannerTextSuccess: { fontWeight: '900', color: '#166534' },

  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  listTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a' },

  countPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  countPillText: { fontWeight: '900', color: '#3730a3', fontSize: 12 },

  enrollmentCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  enrollmentTitle: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
  enrollmentSubtitle: { color: '#64748b', marginTop: 6, lineHeight: 18, fontWeight: '800' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  metaItem: { color: '#475569', fontSize: 13, fontWeight: '800' },

  statusRow: { marginTop: 12 },
  statusLabel: { fontSize: 12, color: '#64748b', fontWeight: '900', marginBottom: 8 },
  statusButtonsRow: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8 },
  statusBtn: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#e2e8f0' },
  statusBtnText: { fontWeight: '900', fontSize: 12 },
  deleteBtn: { backgroundColor: '#fee2e2' },

  emptyStateCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },
  emptyStateText: { color: '#64748b', fontWeight: '900' },

  grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 10,
    overflow: 'hidden',
  },
  statLabel: { fontSize: 12, color: '#6b7280', fontWeight: '900' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#0f172a', marginTop: 6 },
});

const EnrollmentsScreen: React.FC = () => {
  const { bump } = useAdminRefresh();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [createStudentId, setCreateStudentId] = useState<number | null>(null);
  const [createSubjectId, setCreateSubjectId] = useState<number | null>(null);
  const [createSectionId, setCreateSectionId] = useState<number | null>(null); // optional

  const [bulkStudentId, setBulkStudentId] = useState<number | null>(null);
  const [bulkSubjectId, setBulkSubjectId] = useState<number | null>(null);
  const [bulkSectionId, setBulkSectionId] = useState<number | null>(null); // optional

  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);

  const [modalTarget, setModalTarget] = useState<
    | 'create_student'
    | 'create_subject'
    | 'create_section'
    | 'bulk_student'
    | 'bulk_subject'
    | 'bulk_section'
    | null
  >(null);

  const [modalVisibleStudents, setModalVisibleStudents] = useState(false);
  const [modalVisibleSubjects, setModalVisibleSubjects] = useState(false);
  const [modalVisibleSections, setModalVisibleSections] = useState(false);

  const studentsOptions = useMemo<AdminSearchSelectOption[]>(() => {
    return students.map((s) => ({ id: s.id, label: s.name, subLabel: s.student_id }));
  }, [students]);

  const subjectsOptions = useMemo<AdminSearchSelectOption[]>(() => {
    return subjects.map((subj) => ({
      id: subj.id,
      label: `${subj.code} - ${subj.title}`,
      subLabel: subj.title,
    }));
  }, [subjects]);

  const sectionsOptions = useMemo(() => {
    const subjectId =
      modalTarget?.includes('create')
        ? createSubjectId
        : modalTarget?.includes('bulk')
          ? bulkSubjectId
          : null;

    const filtered = subjectId
      ? sections.filter((sec) => {
          const subj = sec.subject;
          const sid = typeof subj === 'number' ? subj : subj?.id;
          return sid === subjectId;
        })
      : sections;

    return filtered.map((sec) => {
      const subj = sec.subject;
      const sid = typeof subj === 'number' ? subj : subj?.id;
      const subjObj = subjects.find((s) => s.id === sid);
      return {
        id: sec.id,
        label: sec.name,
        subLabel: `${sec.schedule}${subjObj ? ` • ${subjObj.code}` : ''}`,
      };
    });
  }, [bulkSectionId, bulkSubjectId, createSectionId, createSubjectId, modalTarget, sections, subjects]);

  const openModal = useCallback((target: NonNullable<typeof modalTarget>) => {
    setModalTarget(target);
    if (target.includes('student')) {
      setModalVisibleStudents(true);
    } else if (target.includes('subject')) {
      setModalVisibleSubjects(true);
    } else {
      setModalVisibleSections(true);
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setModalTarget(null);
    setModalVisibleStudents(false);
    setModalVisibleSubjects(false);
    setModalVisibleSections(false);
  }, []);

  const selectedIdForModal = useMemo(() => {
    if (!modalTarget) return null;
    switch (modalTarget) {
      case 'create_student':
        return createStudentId;
      case 'create_subject':
        return createSubjectId;
      case 'create_section':
        return createSectionId;
      case 'bulk_student':
        return bulkStudentId;
      case 'bulk_subject':
        return bulkSubjectId;
      case 'bulk_section':
        return bulkSectionId;
      default:
        return null;
    }
  }, [bulkSectionId, bulkStudentId, bulkSubjectId, createSectionId, createStudentId, createSubjectId, modalTarget]);

  const studentById = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);

  const subjectById = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const getAutoAssignSection = useCallback(
    (subjectId: number): Section | null => {
      const match = sections.find((sec) => {
        const subj = sec.subject;
        const sid = typeof subj === 'number' ? subj : subj?.id;
        return sid === subjectId;
      });
      return match || null;
    },
    [sections]
  );

  const applyAutoAssign = useCallback(
    (currentSectionId: number | null, subjectId: number | null): number | null => {
      if (currentSectionId) return currentSectionId;
      if (!subjectId) return null;
      const auto = getAutoAssignSection(subjectId);
      return auto ? auto.id : null;
    },
    [getAutoAssignSection]
  );

  const setBannerWithTimeout = useCallback((kind: 'error' | 'success', msg: string, ms: number) => {
    if (kind === 'error') setError(msg);
    else setSuccessMessage(msg);

    setTimeout(() => {
      if (kind === 'error') setError(null);
      else setSuccessMessage(null);
    }, ms);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const [enrollmentData, studentData, subjectData, sectionData] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getSubjects(),
        getSections(),
      ]);

      setEnrollments(enrollmentData);
      setStudents(studentData);
      setSubjects(subjectData);
      setSections(sectionData);
    } catch (err) {
      console.error(err);
      setError('Failed to load enrollment data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateEnrollment = useCallback(async () => {
    if (!createStudentId || !createSubjectId) {
      setBannerWithTimeout('error', 'Please select a student and subject', 3000);
      return;
    }

    const resolvedSectionId = applyAutoAssign(createSectionId, createSubjectId);

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const payload: NewEnrollment = {
        student_id: createStudentId,
        subject_id: createSubjectId,
        ...(resolvedSectionId ? { section_id: resolvedSectionId } : {}),
      };

      const newEnrollment = await createEnrollment(payload);

      // Auto-refresh after action (web parity)
      await loadData();
      bump();

      setShowCreate(false);
      setCreateStudentId(null);
      setCreateSubjectId(null);
      setCreateSectionId(null);
      setBannerWithTimeout('success', 'Enrollment created successfully', 3000);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Failed to create enrollment');
    } finally {
      setSaving(false);
    }
  }, [applyAutoAssign, bump, createSectionId, createStudentId, createSubjectId, loadData, setBannerWithTimeout]);

  const addBulkItem = useCallback(() => {
    if (!bulkStudentId || !bulkSubjectId) {
      setBannerWithTimeout('error', 'Please select a student and subject', 3000);
      return;
    }

    const resolvedSectionId = applyAutoAssign(bulkSectionId, bulkSubjectId);

    const item: BulkItem = {
      student_id: bulkStudentId,
      subject_id: bulkSubjectId,
      ...(resolvedSectionId ? { section_id: resolvedSectionId } : {}),
    };

    setBulkItems((prev) => [...prev, item]);
    setBulkSectionId(null);
  }, [applyAutoAssign, bulkSectionId, bulkStudentId, bulkSubjectId, setBannerWithTimeout]);

  const removeBulkItem = useCallback((index: number) => {
    setBulkItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleBulkEnroll = useCallback(async () => {
    if (bulkItems.length === 0) {
      setBannerWithTimeout('error', 'Please add at least one enrollment', 3000);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const result = await bulkEnroll(bulkItems as any);

      // Always refresh data after bulk
      await loadData();
      bump();

      const successful = result?.summary?.successful || 0;
      const failed = result?.summary?.failed || 0;

      setBulkItems([]);
      setShowBulk(false);

      if (successful > 0 && failed === 0) {
        setBannerWithTimeout('success', `Bulk enrollment completed: ${successful} successful`, 5000);
      } else if (successful > 0 && failed > 0) {
        setBannerWithTimeout('success', `Bulk enrollment completed: ${successful} successful, ${failed} failed`, 5000);
        if (result?.failed?.length > 0) {
          const firstError = result.failed[0].error || 'Unknown error';
          setError(`Some enrollments failed: ${firstError}`);
          setTimeout(() => setError(null), 5000);
        }
      } else if (failed > 0) {
        if (result?.failed?.length > 0) {
          const firstError = result.failed[0].error || 'Unknown error';
          setError(`Bulk enrollment failed: ${firstError}`);
        } else {
          setError('Bulk enrollment failed');
        }
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || err?.response?.data?.error || 'Failed to bulk enroll students');
    } finally {
      setSaving(false);
    }
  }, [bump, bulkItems, loadData, setBannerWithTimeout]);

  const handleStatusChange = useCallback(
    async (enrollmentId: number, newStatus: string) => {
      try {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        if (newStatus === 'dropped') {
          await dropEnrollment(enrollmentId);
        } else if (newStatus === 'completed') {
          setError('Marking enrollment as completed is not implemented on the backend.');
          return;
        } else {
          // enrolled: no-op
        }

        await loadData();
        bump();
        setBannerWithTimeout('success', 'Enrollment status updated', 3000);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.detail || 'Failed to update enrollment');
      } finally {
        setSaving(false);
      }
    },
    [bump, loadData, setBannerWithTimeout]
  );

  const handleDelete = useCallback(
    async (enrollmentId: number) => {
      Alert.alert('Delete enrollment', 'Are you sure you want to delete this enrollment?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              setError(null);
              setSuccessMessage(null);

              await deleteEnrollment(enrollmentId);
              await loadData();
              bump();

              setBannerWithTimeout('success', 'Enrollment deleted', 3000);
            } catch (err: any) {
              console.error(err);
              setError(err?.response?.data?.detail || 'Failed to delete enrollment');
            } finally {
              setSaving(false);
            }
          },
        },
      ]);
    },
    [bump, loadData, setBannerWithTimeout]
  );

  const activeCount = useMemo(() => enrollments.filter((e) => e.status === 'enrolled').length, [enrollments]);
  const droppedCount = useMemo(() => enrollments.filter((e) => e.status === 'dropped').length, [enrollments]);
  const completedCount = useMemo(() => enrollments.filter((e) => e.status === 'completed').length, [enrollments]);
  const totalStudentsCount = students.length;

  const studentValueText = useMemo(() => {
    if (!createStudentId) return 'Tap to select student';
    const s = studentById.get(createStudentId);
    return s ? `${s.name} • ${s.student_id}` : 'Tap to select student';
  }, [createStudentId, studentById]);

  const subjectValueText = useMemo(() => {
    if (!createSubjectId) return 'Tap to select subject';
    const s = subjectById.get(createSubjectId);
    return s ? `${s.code} - ${s.title}` : 'Tap to select subject';
  }, [createSubjectId, subjectById]);

  const sectionValueText = useMemo(() => {
    if (!createSectionId) return 'Auto-assign section (optional)';
    const sec = sections.find((s) => s.id === createSectionId);
    return sec ? `${sec.name} • ${sec.schedule}` : 'Auto-assign section (optional)';
  }, [createSectionId, sections]);

  const bulkStudentValueText = useMemo(() => {
    if (!bulkStudentId) return 'Tap to select student';
    const s = studentById.get(bulkStudentId);
    return s ? `${s.name} • ${s.student_id}` : 'Tap to select student';
  }, [bulkStudentId, studentById]);

  const bulkSubjectValueText = useMemo(() => {
    if (!bulkSubjectId) return 'Tap to select subject';
    const s = subjectById.get(bulkSubjectId);
    return s ? `${s.code} - ${s.title}` : 'Tap to select subject';
  }, [bulkSubjectId, subjectById]);

  const bulkSectionValueText = useMemo(() => {
    if (!bulkSectionId) return 'Auto-assign section (optional)';
    const sec = sections.find((s) => s.id === bulkSectionId);
    return sec ? `${sec.name} • ${sec.schedule}` : 'Auto-assign section (optional)';
  }, [bulkSectionId, sections]);

  const enrollmentSubjectText = useCallback((enrollment: Enrollment) => {
    const subj = enrollment.subject as any;
    const code = typeof subj?.code === 'string' ? subj.code : '';
    const title = typeof subj?.title === 'string' ? subj.title : '';
    return `${code}${title ? ` - ${title}` : ''}`.trim();
  }, []);

  const enrollmentSectionText = useCallback((enrollment: Enrollment) => {
    const section = enrollment.section as any;
    if (!section) return 'Unknown section';
    return `${section.name || 'Unknown'}${section.schedule ? ` • ${section.schedule}` : ''}`;
  }, []);

  const renderEnrollmentCard = useCallback(
    ({ item }: { item: Enrollment }) => {
      const studentId = item.student_id || '';
      const studentName = item.student_name || 'Unknown student';

      return (
        <View style={styles.enrollmentCard}>
          <Text style={styles.enrollmentTitle}>
            {studentId} • {studentName}
          </Text>

          <Text style={styles.enrollmentSubtitle}>
            Subject: {enrollmentSubjectText(item)}
            {'\n'}Section: {enrollmentSectionText(item)}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Status: {item.status}</Text>
            <Text style={styles.metaItem}>{new Date(item.enrolled_at).toLocaleDateString()}</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusButtonsRow}>
              {(['enrolled', 'dropped', 'completed'] as const).map((s) => {
                const color = s === 'dropped' ? '#dc2626' : s === 'completed' ? '#047857' : '#2563eb';
                return (
                  <TouchableOpacity
                    key={s}
                    style={styles.statusBtn}
                    onPress={() => handleStatusChange(item.id, s)}
                    disabled={saving}
                  >
                    <Text style={[styles.statusBtnText, { color }]}>{s}</Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity style={[styles.statusBtn, styles.deleteBtn]} onPress={() => handleDelete(item.id)} disabled={saving}>
                <Text style={[styles.statusBtnText, { color: '#dc2626' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [enrollmentSectionText, enrollmentSubjectText, handleDelete, handleStatusChange, saving]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 10, color: '#475569', fontWeight: '900' }}>Loading enrollments...</Text>
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
            <Text style={styles.pageSubtitle}>Create, Bulk, List, Update Status, and Delete (Admin)</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              activeOpacity={0.9}
              onPress={() => {
                setShowCreate((v) => !v);
                setShowBulk(false);
                setError(null);
                setSuccessMessage(null);
              }}
            >
              <LinearGradient colors={['#7c3aed', '#2563eb']} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: 16 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text style={styles.buttonText}>{showCreate ? 'Close Form' : 'New Enrollment'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              activeOpacity={0.9}
              onPress={() => {
                setShowBulk((v) => !v);
                setShowCreate(false);
                setError(null);
                setSuccessMessage(null);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="layers" size={18} color="#0f172a" />
                <Text style={styles.buttonTextSecondary}>{showBulk ? 'Close Bulk' : 'Bulk Enroll'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#dc2626" />
              <Text style={styles.bannerText}>{error}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#166534" />
              <Text style={styles.bannerTextSuccess}>{successMessage}</Text>
            </View>
          ) : null}

          {showCreate ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Create Enrollment</Text>

              <Text style={styles.label}>Student</Text>
              <TouchableOpacity style={styles.pickerCard} activeOpacity={0.85} onPress={() => openModal('create_student')}>
                <View style={styles.pickerValueRow}>
                  <Text style={styles.pickerValueText}>{studentValueText}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#2563eb" />
                </View>
                <Text style={styles.pickerHintText}>Tap to open searchable selector</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Subject</Text>
              <TouchableOpacity style={styles.pickerCard} activeOpacity={0.85} onPress={() => openModal('create_subject')}>
                <View style={styles.pickerValueRow}>
                  <Text style={styles.pickerValueText}>{subjectValueText}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#2563eb" />
                </View>
                <Text style={styles.pickerHintText}>Tap to open searchable selector</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Section (Optional - Auto-assign if empty)</Text>
              <TouchableOpacity style={styles.pickerCard} activeOpacity={0.85} onPress={() => openModal('create_section')}>
                <View style={styles.pickerValueRow}>
                  <Text style={styles.pickerValueText}>{sectionValueText}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#2563eb" />
                </View>
                <Text style={styles.pickerHintText}>If empty, auto-assigns on create</Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#e2e8f0' }]}
                  onPress={() => {
                    setShowCreate(false);
                    setCreateStudentId(null);
                    setCreateSubjectId(null);
                    setCreateSectionId(null);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  disabled={saving}
                >
                  <Text style={[styles.actionText, { color: '#0f172a' }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2563eb' }]} onPress={handleCreateEnrollment} disabled={saving}>
                  <Text style={[styles.actionText, { color: '#fff' }]}>Create Enrollment</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {showBulk ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Bulk Enrollment - Add Multiple Students</Text>
              <Text style={{ color: '#64748b', fontWeight: '900', marginBottom: 12, lineHeight: 18 }}>
                Select Student + Subject (Section optional). Tap “Add to List”, then submit bulk.
              </Text>

              <Text style={styles.label}>Student</Text>
              <TouchableOpacity style={styles.pickerCard} activeOpacity={0.85} onPress={() => openModal('bulk_student')}>
                <View style={styles.pickerValueRow}>
                  <Text style={styles.pickerValueText}>{bulkStudentValueText}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#7c3aed" />
                </View>
                <Text style={styles.pickerHintText}>Tap to open searchable selector</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Subject</Text>
              <TouchableOpacity style={styles.pickerCard} activeOpacity={0.85} onPress={() => openModal('bulk_subject')}>
                <View style={styles.pickerValueRow}>
                  <Text style={styles.pickerValueText}>{bulkSubjectValueText}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#7c3aed" />
                </View>
                <Text style={styles.pickerHintText}>Section selector filters by chosen subject</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Section (Optional - Auto-assign if empty)</Text>
              <TouchableOpacity style={styles.pickerCard} activeOpacity={0.85} onPress={() => openModal('bulk_section')}>
                <View style={styles.pickerValueRow}>
                  <Text style={styles.pickerValueText}>{bulkSectionValueText}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#7c3aed" />
                </View>
                <Text style={styles.pickerHintText}>If empty, auto-assigns on add</Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#e9d5ff' }]} onPress={addBulkItem} disabled={saving}>
                  <Text style={[styles.actionText, { color: '#5b21b6' }]}>Add to List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#7c3aed', opacity: bulkItems.length === 0 ? 0.6 : 1 }]}
                  onPress={handleBulkEnroll}
                  disabled={saving || bulkItems.length === 0}
                >
                  <Text style={[styles.actionText, { color: '#fff' }]}>{`Submit Bulk (${bulkItems.length})`}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 16 }}>
                <Text style={{ fontWeight: '900', color: '#0f172a', marginBottom: 8 }}>{`Items to Enroll (${bulkItems.length})`}</Text>

                {bulkItems.length === 0 ? (
                  <Text style={{ color: '#64748b', fontWeight: '900' }}>No items added yet.</Text>
                ) : (
                  <FlatList
                    data={bulkItems}
                    keyExtractor={(_, i) => `${i}`}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      const student = studentById.get(item.student_id);
                      const subj = subjectById.get(item.subject_id);
                      const sec = item.section_id ? sections.find((s) => s.id === item.section_id) : null;

                      return (
                        <View style={[styles.enrollmentCard, { paddingVertical: 12 }]}>
                          <Text style={styles.enrollmentTitle}>
                            {student ? `${student.student_id} • ${student.name}` : `Student #${item.student_id}`}
                          </Text>
                          <Text style={styles.enrollmentSubtitle}>
                            {subj ? `${subj.code} - ${subj.title}` : `Subject #${item.subject_id}`}
                            {'\n'}Section: {sec?.name || 'Auto-assign'}
                          </Text>

                          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                            <TouchableOpacity
                              style={[styles.statusBtn, styles.deleteBtn, { paddingVertical: 8, paddingHorizontal: 12 }]}
                              onPress={() => removeBulkItem(index)}
                              disabled={saving}
                            >
                              <Text style={[styles.statusBtnText, { color: '#dc2626' }]}>Remove</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            </View>
          ) : null}

          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>{`All Enrollments (${enrollments.length})`}</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{enrollments.length ? 'Manage' : 'Ready'}</Text>
            </View>
          </View>

          {enrollments.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateText}>No enrollments yet</Text>
              <Text style={{ color: '#64748b', fontWeight: '900', marginTop: 10, textAlign: 'center', lineHeight: 18 }}>
                Create your first enrollment to get started.
              </Text>
              <TouchableOpacity
                style={{ marginTop: 14, width: '100%', borderRadius: 16, paddingVertical: 12, backgroundColor: '#2563eb' }}
                onPress={() => {
                  setShowCreate(true);
                  setShowBulk(false);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '900', textAlign: 'center' }}>Create First Enrollment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={enrollments}
              keyExtractor={(item) => `${item.id}`}
              renderItem={renderEnrollmentCard}
              scrollEnabled={false}
              initialNumToRender={6}
              maxToRenderPerBatch={8}
              windowSize={10}
            />
          )}

          <View style={styles.grid2}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#22c55e', '#16a34a']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 16, opacity: 0.12 }} />
              <Text style={styles.statLabel}>Active Enrollments</Text>
              <Text style={[styles.statValue, { color: '#16a34a' }]}>{activeCount}</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#ef4444', '#dc2626']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 16, opacity: 0.12 }} />
              <Text style={styles.statLabel}>Dropped</Text>
              <Text style={[styles.statValue, { color: '#dc2626' }]}>{droppedCount}</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#3b82f6', '#2563eb']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 16, opacity: 0.12 }} />
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={[styles.statValue, { color: '#2563eb' }]}>{completedCount}</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#f59e0b', '#f97316']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 16, opacity: 0.12 }} />
              <Text style={styles.statLabel}>Total Students</Text>
              <Text style={[styles.statValue, { color: '#f97316' }]}>{totalStudentsCount}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AdminSearchSelectModal
        visible={modalVisibleStudents}
        title="Select Student"
        options={studentsOptions}
        selectedId={selectedIdForModal}
        onClose={closeAllModals}
        onSelect={(id) => {
          if (modalTarget === 'create_student') setCreateStudentId(id);
          if (modalTarget === 'bulk_student') setBulkStudentId(id);
          closeAllModals();
        }}
      />

      <AdminSearchSelectModal
        visible={modalVisibleSubjects}
        title="Select Subject"
        options={subjectsOptions}
        selectedId={selectedIdForModal}
        onClose={closeAllModals}
        onSelect={(id) => {
          if (modalTarget === 'create_subject') {
            setCreateSubjectId(id);
            setCreateSectionId(null);
          }
          if (modalTarget === 'bulk_subject') {
            setBulkSubjectId(id);
            setBulkSectionId(null);
          }
          closeAllModals();
        }}
      />

      <AdminSearchSelectModal
        visible={modalVisibleSections}
        title="Select Section"
        placeholder="Search section"
        options={sectionsOptions}
        selectedId={selectedIdForModal}
        onClose={closeAllModals}
        onSelect={(id) => {
          if (modalTarget === 'create_section') setCreateSectionId(id);
          if (modalTarget === 'bulk_section') setBulkSectionId(id);
          closeAllModals();
        }}
      />
    </SafeAreaView>
  );
};

export default EnrollmentsScreen;

