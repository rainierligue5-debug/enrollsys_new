import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

interface Props extends DrawerContentComponentProps {
  onLogout?: () => void;
}

const AdminDrawerContent: React.FC<Props> = ({ state, navigation, descriptors, onLogout }) => {
  const items = [
    { key: 'AdminDashboard', label: 'Dashboard', icon: 'grid' },
    { key: 'Students', label: 'Students', icon: 'people' },
    { key: 'Subjects', label: 'Subjects', icon: 'book' },
    { key: 'Sections', label: 'Sections', icon: 'layers' },
    { key: 'Enrollments', label: 'Enrollments', icon: 'clipboard' },
    { key: 'StudentAccounts', label: 'Student Accounts', icon: 'person-circle' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandText}>USTP</Text>
        </View>
        <Text style={styles.brandTitle}>Administrator</Text>
      </View>

      <View style={styles.menu}>
        {items.map((it) => {
          const focused = state.routeNames[state.index] === it.key;
          return (
            <TouchableOpacity
              key={it.key}
              style={[styles.menuItem, focused && styles.menuItemActive]}
              onPress={() => navigation.navigate(it.key)}
            >
              <Ionicons name={it.icon as any} size={20} color={focused ? '#2563eb' : '#475569'} style={{ marginRight: 12 }} />
              <Text style={[styles.menuLabel, focused && styles.menuLabelActive]}>{it.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => onLogout && onLogout()}>
          <Ionicons name="log-out" size={18} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', paddingVertical: 28, paddingHorizontal: 12 },
  header: { marginBottom: 18, alignItems: 'center' },
  brandIcon: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  brandText: { color: '#fff', fontWeight: '800', fontSize: 22 },
  brandTitle: { color: '#e6eefb', marginTop: 8, fontWeight: '700' },
  menu: { marginTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, marginBottom: 6 },
  menuItemActive: { backgroundColor: '#f1f5f9' },
  menuLabel: { color: '#e2e8f0', fontSize: 15 },
  menuLabelActive: { color: '#0f172a', fontWeight: '700' },
  footer: { marginTop: 'auto', paddingTop: 16 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
  logoutText: { color: '#ef4444', fontWeight: '700' },
});

export default AdminDrawerContent;
