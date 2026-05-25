import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const enrolled = status === 'enrolled';
  return (
    <View style={[styles.badge, { backgroundColor: enrolled ? '#dcfce7' : '#f3f4f6' }]}>
      <Text style={{ color: enrolled ? '#047857' : '#374151', fontWeight: '700', fontSize: 12 }}>{status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999 },
});

export default React.memo(StatusBadge);
