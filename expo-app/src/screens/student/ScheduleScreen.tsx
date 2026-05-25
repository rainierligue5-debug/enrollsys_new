import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { getMyEnrollments } from '../../services/enrollments.service';
import { Enrollment } from '../../types';
import EmptyState from '../../components/EmptyState';

const days = ['Mon','Tue','Wed','Thu','Fri','Sat'];

const ScheduleScreen: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.enrollments);
      } catch (err) {
        console.error('Schedule load error', err);
      }
    };
    load();
  }, []);

  const itemsForDay = useMemo(() => {
    if (!selectedDay) return [];
    return enrollments.filter(e => (typeof e.section === 'object' ? (e.section.schedule || '').includes(selectedDay) : false));
  }, [enrollments, selectedDay]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={styles.container}>
        <View style={styles.filterRow}>
          <FlatList data={days} horizontal keyExtractor={(d)=>d} renderItem={({item})=> (
            <TouchableOpacity onPress={()=>{ setSelectedDay(item); setModalVisible(true); }} style={[styles.dayBtn, selectedDay===item && styles.dayBtnActive]}>
              <Text style={[styles.dayText, selectedDay===item && styles.dayTextActive]}>{item}</Text>
            </TouchableOpacity>
          )} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:12}} />
        </View>

        {/* Main list shows all items (overview) */}
        {enrollments.length === 0 ? (
          <View style={{ padding: 12 }}>
            <EmptyState title="No scheduled classes" subtitle="You have no scheduled classes." buttonLabel="Refresh" onPress={async()=>{
              const res = await getMyEnrollments(); setEnrollments(res.enrollments);
            }} />
          </View>
        ) : (
          <FlatList data={enrollments} keyExtractor={(i)=>String(i.id)} renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.code}>{typeof item.subject === 'object' ? item.subject.code : 'SUBJ'}</Text>
              <Text style={styles.title}>{typeof item.subject === 'object' ? item.subject.title : 'Subject'}</Text>
              <Text style={styles.meta}>{typeof item.section === 'object' ? `${item.section.time_start} - ${item.section.time_end} • ${item.section.room}` : ''}</Text>
            </View>
          )} contentContainerStyle={{padding:12}} />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedDay} Schedule</Text>
                <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedDay(null); }}>
                  <Text style={{ color: '#2563eb', fontWeight: '700' }}>Close</Text>
                </TouchableOpacity>
              </View>

              {itemsForDay.length === 0 ? (
                <View style={{ padding: 12 }}>
                  <EmptyState title="No classes" subtitle={`No classes on ${selectedDay}`} />
                </View>
              ) : (
                <FlatList data={itemsForDay} keyExtractor={(i)=>String(i.id)} renderItem={({item}) => (
                  <View style={styles.card}>
                    <Text style={styles.code}>{typeof item.subject === 'object' ? item.subject.code : 'SUBJ'}</Text>
                    <Text style={styles.title}>{typeof item.subject === 'object' ? item.subject.title : 'Subject'}</Text>
                    <Text style={styles.meta}>{typeof item.section === 'object' ? `${item.section.time_start} - ${item.section.time_end} • ${item.section.room}` : ''}</Text>
                  </View>
                )} contentContainerStyle={{padding:12}} />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: { paddingVertical: 12 },
  dayBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', marginRight: 8, borderRadius: 8, elevation: 1 },
  dayBtnActive: { backgroundColor: '#2563eb' },
  dayText: { color: '#0f172a', fontWeight: '700' },
  dayTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 1 },
  code: { color: '#2563eb', fontWeight: '800' },
  title: { fontWeight: '700', marginTop: 4 },
  meta: { color: '#6b7280', marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#f8fafc', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingHorizontal: 16 },
  modalTitle: { fontWeight: '800', fontSize: 16 },
});

export default ScheduleScreen;
