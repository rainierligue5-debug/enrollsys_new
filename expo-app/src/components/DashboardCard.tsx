import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface Props {
  title: string;
  value: string | number;
  colors?: string[];
  icon?: string;
  onPress?: () => void;
}

const DashboardCard: React.FC<Props> = ({ title, value, colors = ['#2563eb', '#3b82f6'], icon = 'book', onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
      <LinearGradient colors={colors} style={styles.gradient}>
        <View style={styles.left}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={28} color="#fff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
    minWidth: 140,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  gradient: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  value: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  iconWrap: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)'
  }
});

export default React.memo(DashboardCard);
