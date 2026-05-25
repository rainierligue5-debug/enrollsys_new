import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LoadingSkeleton: React.FC<{ style?: any }> = ({ style }) => {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.circle} />
      <View style={styles.lines}>
        <View style={styles.lineShort} />
        <View style={styles.lineLong} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, elevation: 1 },
  circle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e6eefc', marginRight: 12 },
  lines: { flex: 1 },
  lineShort: { height: 12, backgroundColor: '#eef2ff', borderRadius: 6, width: '40%', marginBottom: 8 },
  lineLong: { height: 12, backgroundColor: '#eef2ff', borderRadius: 6, width: '80%' },
});

export default React.memo(LoadingSkeleton);
