import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { User } from '../types';

interface Props { user: User | null; studentId?: string; course?: string; yearLevel?: string }

const StudentHeader: React.FC<Props> = ({ user, studentId, course, yearLevel }) => {
  const name = user ? `${(user as any).first_name || ''} ${(user as any).last_name || ''}`.trim() : 'Student';
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.name}>{name || 'Student'}</Text>
        <View style={styles.row}>
          {studentId ? <Text style={styles.subText}>ID: {studentId}</Text> : null}
          {course ? <Text style={styles.subText}> • {course}</Text> : null}
          {yearLevel ? <Text style={styles.subText}> • {yearLevel}</Text> : null}
        </View>
      </View>
      <View style={styles.avatarWrap}>
        <View style={styles.avatarIcon}>
          <Icon name="account" size={28} color="#584d4d" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  left: { flex: 1 },
  welcome: { color: '#6b7280', fontSize: 13 },
  name: { fontSize: 20, color: '#0f172a', fontWeight: '800', marginTop: 4 },
  row: { flexDirection: 'row', marginTop: 6, alignItems: 'center', flexWrap: 'wrap' },
  subText: { color: '#475569', fontSize: 12, marginRight: 6 },
  avatarWrap: { marginLeft: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e2e8f0' },
});

export default React.memo(StudentHeader);
