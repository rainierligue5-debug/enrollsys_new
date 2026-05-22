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
  useWindowDimensions,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStudents } from '../../services/students.service';

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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  statCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blueCard: {
    borderTopWidth: 4,
    borderTopColor: '#3b82f6',
  },
  purpleCard: {
    borderTopWidth: 4,
    borderTopColor: '#a855f7',
  },
  greenCard: {
    borderTopWidth: 4,
    borderTopColor: '#10b981',
  },
  orangeCard: {
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

interface AdminDashboardScreenProps {
  navigation: any;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  navigation,
}) => {
  const { width } = useWindowDimensions();
  const cardBasisStyle = {
    flexBasis: width > 700 ? 0.48 : 1,
    maxWidth: 380,
  };
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalSubjects: 0,
    totalSections: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setError(null);
      const students = await getStudents();

      setStats({
        totalStudents: students.length || 0,
        totalSubjects: 0,
        totalSections: 0,
        totalEnrollments: 0,
      });
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
  }, []);

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>System Overview</Text>
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
          <View style={[styles.statCard, styles.blueCard, cardBasisStyle]}>
            <Text style={styles.statLabel}>Total Students</Text>
            <Text style={styles.statValue}>{stats.totalStudents}</Text>
            <Text style={styles.statTrend}>+12% this month</Text>
          </View>

          {/* Subjects Card */}
          <View style={[styles.statCard, styles.purpleCard, cardBasisStyle]}>
            <Text style={styles.statLabel}>Subjects</Text>
            <Text style={styles.statValue}>{stats.totalSubjects}</Text>
            <Text style={styles.statTrend}>+2 new courses</Text>
          </View>

          {/* Sections Card */}
          <View style={[styles.statCard, styles.greenCard, cardBasisStyle]}>
            <Text style={styles.statLabel}>Sections</Text>
            <Text style={styles.statValue}>{stats.totalSections}</Text>
            <Text style={styles.statTrend}>12 total</Text>
          </View>

          {/* Enrollments Card */}
          <View style={[styles.statCard, styles.orangeCard, cardBasisStyle]}>
            <Text style={styles.statLabel}>Enrollments</Text>
            <Text style={styles.statValue}>{stats.totalEnrollments}</Text>
            <Text style={styles.statTrend}>+8% increase</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
