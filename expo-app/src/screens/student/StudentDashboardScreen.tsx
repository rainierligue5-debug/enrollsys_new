/**
 * Student Dashboard Screen - Mobile Responsive
 *
 * Shows student's enrollments and quick stats.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { getMyEnrollments } from '../../services/enrollments.service';
import { MyEnrollmentsResponse } from '../../types';
import StudentHeader from '../../components/StudentHeader';
import DashboardCard from '../../components/DashboardCard';
import QuickActionCard from '../../components/QuickActionCard';
import SubjectCard from '../../components/SubjectCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  pageWrapper: {
    width: '100%',
    maxWidth: 720,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    minWidth: 140,
    marginRight: 8,
    elevation: 2,
  },
  statHeader: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    padding: 12,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  enrollmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  enrollmentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '700',
  },
  enrollmentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  enrollmentInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  enrollmentStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 8,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
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

interface StudentDashboardScreenProps {
  navigation: any;
}

const StudentDashboardScreen: React.FC<StudentDashboardScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isNarrow = width < 540;
  const isCompact = width < 360;
  const statCardLayout = {
    flexBasis: isNarrow ? 1 : 0.48,
    minWidth: isNarrow ? width : 160,
    maxWidth: 360,
  };
  const titleFontSize = isCompact ? 22 : 24;
  const sectionFontSize = isCompact ? 16 : 17;
  const [data, setData] = useState<MyEnrollmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEnrollments = async () => {
    try {
      setError(null);
      const response = await getMyEnrollments();
      setData(response);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch enrollments';
      setError(errorMsg);
      console.error('Enrollment error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEnrollments();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.pageWrapper}>
          <StudentHeader user={null} />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {data && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              <DashboardCard title="Subjects" value={data.total_subjects} icon="book-open-page-variant" />
              <DashboardCard title="Units" value={data.total_units} colors={["#06b6d4", "#06b6d4"]} icon="alpha-u-circle" />
              <DashboardCard title="Sections" value={data.enrollments.length} colors={["#8b5cf6", "#a78bfa"]} icon="grid" />
            </View>
          )}

          <View style={{ marginTop: 14 }}>
            <Text style={[styles.sectionTitle, { fontSize: sectionFontSize }]}>Quick Actions</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <QuickActionCard label="Subjects" icon="book-open-page-variant" onPress={()=>navigation.navigate('Subjects')} />
              <QuickActionCard label="Schedule" icon="calendar-range" onPress={()=>navigation.navigate('Schedule')} />
              <QuickActionCard label="Prospectus" icon="file-document-outline" onPress={()=>{}} />
              <QuickActionCard label="Grades" icon="chart-bar" onPress={()=>{}} />
            </View>

            <Text style={[styles.sectionTitle, { fontSize: sectionFontSize }]}>Enrolled Subjects</Text>

            {data && data.enrollments.length > 0 ? (
              data.enrollments.map(e => <SubjectCard key={e.id} enrollment={e} />)
            ) : (
              <View style={{ padding: 12 }}>
                <EmptyState title="No enrollments yet" subtitle="You have not enrolled in any subjects." buttonLabel="Refresh" onPress={onRefresh} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboardScreen;
