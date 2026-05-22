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
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { getMyEnrollments } from '../../services/enrollments.service';
import { MyEnrollmentsResponse } from '../../types';

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.pageWrapper}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: titleFontSize }]}>My Dashboard</Text>
            <Text style={styles.subtitle}>View your enrollments</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {data && (
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, statCardLayout]}>
                <LinearGradient colors={["#2563eb", "#3b82f6"]} style={styles.statHeader}>
                  <Text style={styles.statCount}>{data.total_subjects}</Text>
                  <View style={styles.statIconCircle}>
                    <Icon name="book-open-page-variant" size={20} color="#fff" />
                  </View>
                </LinearGradient>
                <Text style={styles.statLabel}>Enrolled Subjects</Text>
              </View>

              <View style={[styles.statCard, statCardLayout]}>
                <LinearGradient colors={["#10b981", "#34d399"]} style={styles.statHeader}>
                  <Text style={styles.statCount}>{data.total_units}</Text>
                  <View style={styles.statIconCircle}>
                    <Icon name="alpha-u-circle" size={20} color="#fff" />
                  </View>
                </LinearGradient>
                <Text style={styles.statLabel}>Total Units</Text>
              </View>

              <View style={[styles.statCard, { flexBasis: '100%', maxWidth: 760 }]}>
                <LinearGradient colors={["#8b5cf6", "#a78bfa"]} style={styles.statHeader}>
                  <Text style={styles.statCount}>{data.enrollments.length}</Text>
                  <View style={styles.statIconCircle}>
                    <Icon name="grid" size={20} color="#fff" />
                  </View>
                </LinearGradient>
                <Text style={styles.statLabel}>Sections</Text>
              </View>
            </View>
          )}

          {data && data.enrollments.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { fontSize: sectionFontSize }]}>My Enrollments</Text>
              {data.enrollments.map((enrollment) => (
                <View key={enrollment.id} style={styles.enrollmentCard}>
                  <View style={styles.enrollmentHeaderRow}>
                    <Text style={styles.enrollmentTitle}>
                      {typeof enrollment.subject === 'object'
                        ? enrollment.subject.title
                        : 'Subject #' + enrollment.subject}
                    </Text>
                    <View>
                      <View
                        style={{
                          backgroundColor:
                            enrollment.status === 'enrolled' ? '#d1fae5' : '#f3f4f6',
                          borderRadius: 999,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: enrollment.status === 'enrolled' ? '#047857' : '#374151',
                            fontWeight: '700',
                            fontSize: 12,
                          }}
                        >
                          {enrollment.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.enrollmentInfo}>
                    Section:{' '}
                    {typeof enrollment.section === 'object'
                      ? enrollment.section.name
                      : 'Section #' + enrollment.section}
                  </Text>
                  <Text style={styles.enrollmentInfo}>
                    Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No enrollments yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboardScreen;
