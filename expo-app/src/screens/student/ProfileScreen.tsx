import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import EmptyState from '../../components/EmptyState';
import { updateProfile } from '../../services/auth.service';

const ProfileScreen: React.FC = () => {
  const { user, signOut, refresh } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState((user as any)?.first_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View style={{ padding: 12 }}>
          <EmptyState title="Not signed in" subtitle="Please sign in to view your profile." />
        </View>
      </SafeAreaView>
    );
  }

  const onSave = async () => {
    try {
      const payload: any = {};
      if (name) payload.name = name;
      if (email) payload.email = email;
      if (password) payload.password = password;
      const res = await updateProfile(payload);
      // refresh context
      try { await refresh(); } catch (e) { /* ignore */ }
      Alert.alert('Saved', 'Profile updated successfully');
      setEditing(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          {!editing ? (
            <>
              <Text style={styles.name}>{(user as any).first_name} {(user as any).last_name}</Text>
              <Text style={styles.sub}>{user.email}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Role</Text>
                <Text style={styles.infoVal}>{user.role}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Active</Text>
                <Text style={styles.infoVal}>{user.is_active ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.btn} onPress={() => setEditing(true)}>
                  <Text style={styles.btnText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.danger]} onPress={() => signOut()}>
                  <Text style={[styles.btnText, { color: '#fff' }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TextInput placeholder="First name" value={name} onChangeText={setName} style={styles.input} />
              <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
              <TextInput placeholder="New password (leave blank to keep)" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
              <View style={styles.actions}>
                <TouchableOpacity style={styles.btn} onPress={onSave}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.danger]} onPress={() => { setEditing(false); setPassword(''); }}>
                  <Text style={[styles.btnText, { color: '#fff' }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  name: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  sub: { color: '#6b7280', marginTop: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  infoKey: { color: '#6b7280' },
  infoVal: { fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' },
  btn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#eef2ff', alignItems: 'center', marginRight: 8 },
  danger: { backgroundColor: '#ef4444' },
  btnText: { color: '#0f172a', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#e6eefc', padding: 10, borderRadius: 8, marginTop: 10, backgroundColor: '#fff' },
});

export default ProfileScreen;
