import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { getMyEnrollments } from '../../services/enrollments.service';
import { MyEnrollmentsResponse, Enrollment } from '../../types';
import SubjectCard from '../../components/SubjectCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const SubjectsScreen: React.FC = () => {
  const [data, setData] = useState<MyEnrollmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyEnrollments();
      setData(res);
    } catch (err) {
      console.error('Subjects fetch error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={styles.page}>
        {loading ? (
          <View>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </View>
        ) : data && data.enrollments.length > 0 ? (
          <FlatList
            data={data.enrollments}
            keyExtractor={(item: Enrollment) => String(item.id)}
            renderItem={({ item }) => <SubjectCard enrollment={item} />}
            contentContainerStyle={{ padding: 12 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : (
          <View style={{ padding: 12 }}>
            <EmptyState title="No subjects enrolled" subtitle="You have not enrolled in any subjects yet." buttonLabel="Refresh" onPress={fetch} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ page: { flex: 1 } });

export default SubjectsScreen;
