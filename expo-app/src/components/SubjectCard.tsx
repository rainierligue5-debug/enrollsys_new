import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { Enrollment } from '../types';

interface Props {
  enrollment: Enrollment;
}

const SubjectCard: React.FC<Props> = ({ enrollment }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  const subj = typeof enrollment.subject === 'object' ? enrollment.subject : { title: String(enrollment.subject), code: '' } as any;
  const sect = typeof enrollment.section === 'object' ? enrollment.section : { name: String(enrollment.section), room: '-', schedule: '-', time_start: '', time_end: '' } as any;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={toggle} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.code}>{(subj.code || '').toUpperCase()}</Text>
          <Text style={styles.title}>{subj.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{subj.units} units</Text>
            <View style={styles.chip}><Text style={styles.chipText}>{sect.name}</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>{sect.room}</Text></View>
          </View>
        </View>
        <View style={styles.right}>
          <View style={[styles.statusBadge, { backgroundColor: enrollment.status === 'enrolled' ? '#dcfce7' : '#f3f4f6' }]}>
            <Text style={{ color: enrollment.status === 'enrolled' ? '#047857' : '#374151', fontWeight: '700', fontSize: 12 }}>{enrollment.status.toUpperCase()}</Text>
          </View>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#0f172a" />
        </View>
      </View>
      {open && (
        <View style={styles.details}>
          <Text style={styles.detailText}>Schedule: {sect.schedule || 'TBA'}</Text>
          <Text style={styles.detailText}>Time: {sect.time_start ? `${sect.time_start} - ${sect.time_end}` : 'TBA'}</Text>
          <Text style={styles.detailText}>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  left: { flex: 1 },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  code: { fontSize: 12, color: '#2563eb', fontWeight: '800' },
  title: { fontSize: 14, color: '#0f172a', fontWeight: '700', marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: '#6b7280', marginRight: 8 },
  chip: { backgroundColor: '#eef2ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginRight: 6 },
  chipText: { color: '#0f172a', fontSize: 12, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999, marginBottom: 6 },
  details: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 },
  detailText: { fontSize: 13, color: '#374151', marginBottom: 6 },
});

export default React.memo(SubjectCard);
