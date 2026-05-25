import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface Props { title?: string; subtitle?: string; buttonLabel?: string; onPress?: () => void }

const EmptyState: React.FC<Props> = ({ title = 'Nothing here yet', subtitle = '', buttonLabel, onPress }) => {
  return (
    <View style={styles.container}>
      <Icon name="emoticon-sad-outline" size={48} color="#94a3b8" />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {buttonLabel ? (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 8 },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  btn: { marginTop: 12, backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default React.memo(EmptyState);
