/**
 * Admin Dashboard Screen - Mobile Responsive
 * 
 * Shows statistics and navigation for admin users.
 * Responsive grid layout using Flexbox.
 */

import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';



import { SafeAreaView } from 'react-native-safe-area-context';
import { getStudents } from '../../services/students.service';
import { getSubjects } from '../../services/subjects.service';
import { getSections } from '../../services/sections.service';
import { getEnrollments } from '../../services/enrollments.service';
import { useAdminRefresh } from '../../contexts/AdminRefreshContext';
import { Enrollment } from '../../types';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  header: {
    marginBottom: 18,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  statAccentBlue: {
    borderTopWidth: 4,
    borderTopColor: '#3b82f6',
  },
  statAccentPurple: {
    borderTopWidth: 4,
    borderTopColor: '#a855f7',
  },
  statAccentGreen: {
    borderTopWidth: 4,
    borderTopColor: '#10b981',
  },
  statAccentOrange: {
    borderTopWidth: 4,
    borderTopColor: '#f97316',
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statTrend: {
    fontSize: 12,
    color: '#059669',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
});

interface DashboardStats {
  totalStudents: number;
  totalSubjects: number;
  totalSections: number;
  totalEnrollments: number;
}

const AdminDashboardScreen: React.FC = () => {

  const [stats, setStats] = useState<DashboardStats>({

    totalStudents: 0,
    totalSubjects: 0,
    totalSections: 0,
    totalEnrollments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([]);
  const { refreshTick } = useAdminRefresh();


  const fetchStats = async () => {

    try {
      setError(null);
      const [students, subjects, sections, enrollments] =
        await Promise.all([
          getStudents(),
          getSubjects(),
          getSections(),
          getEnrollments(),
        ]);

      setStats({
        totalStudents: students.length || 0,
        totalSubjects: subjects.length || 0,
        totalSections: sections.length || 0,
        totalEnrollments: enrollments.length || 0,
      });
      // compute recent enrollments (latest 3)
      try {
        const sorted = (enrollments || []).slice().sort((a: Enrollment, b: Enrollment) => {
          // API type uses `enrolled_at`; fallback to `updated_at` if needed
          const aDate = new Date((a as any).enrolled_at ?? (a as any).updated_at ?? 0).getTime();
          const bDate = new Date((b as any).enrolled_at ?? (b as any).updated_at ?? 0).getTime();
          return bDate - aDate;
        });
        setRecentEnrollments(sorted.slice(0, 3));
      } catch (e) {
        setRecentEnrollments([]);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch dashboard data';
      setError(errorMsg);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStats();
  }, [refreshTick]);



  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView

        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>
            Welcome to Enrollment System
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Manage students, subjects, sections, and enrollments efficiently
          </Text>
        </View>

        {/* Error Message */}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Students Card */}
          <View style={[styles.statCard, styles.statAccentBlue]}>
            <Text style={styles.statLabel}>Total Students</Text>
            <Text style={styles.statValue}>{stats.totalStudents}</Text>
            <Text style={styles.statTrend}>+12% this month</Text>
          </View>

          {/* Subjects Card */}
          <View style={[styles.statCard, styles.statAccentPurple]}>
            <Text style={styles.statLabel}>Subjects</Text>
            <Text style={styles.statValue}>{stats.totalSubjects}</Text>
            <Text style={styles.statTrend}>+2 new courses</Text>
          </View>

          {/* Sections Card */}
          <View style={[styles.statCard, styles.statAccentGreen]}>
            <Text style={styles.statLabel}>Sections</Text>
            <Text style={styles.statValue}>{stats.totalSections}</Text>
            <Text style={styles.statTrend}>12 total</Text>
          </View>

          {/* Enrollments Card */}
          <View style={[styles.statCard, styles.statAccentOrange]}>
            <Text style={styles.statLabel}>Enrollments</Text>
            <Text style={styles.statValue}>{stats.totalEnrollments}</Text>
            <Text style={styles.statTrend}>+8% increase</Text>
          </View>
        </View>

        {/* Recent Enrollment History - bottom section */}
        <View style={{ width: '100%', marginTop: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>Recent Enrollment History</Text>
          {recentEnrollments.length === 0 ? (
            <View style={[styles.statCard, { padding: 14 }]}>
              <Text style={{ color: '#64748b' }}>No recent enrollments.</Text>
            </View>
          ) : (
            recentEnrollments.map((enr) => (
              <View key={enr.id} style={[styles.statCard, { padding: 12, marginBottom: 10 }]}>
                <Text style={{ fontWeight: '700', color: '#0f172a' }}>{(enr as any).student_name || 'Unknown Student'}</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>
                  {(enr as any).student_id || ''}
                  {' • '}
                  {typeof (enr.subject as any)?.code === 'string' ? (enr.subject as any).code : (enr as any).subject_code || ''}
                  {' • '}
                  {typeof (enr.section as any)?.name === 'string' ? (enr.section as any).name : (enr as any).section_name || ''}
                </Text>
                <Text style={{ color: '#475569', marginTop: 8, fontSize: 12 }}>
                  {new Date((enr as any).enrolled_at ?? (enr as any).updated_at ?? 0).toLocaleString()} • {enr.status}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
