/**
 * Admin Navigation Stack
 * Navigation structure for admin users
 */

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SubjectsScreen from '../screens/admin/SubjectsScreen';
import StudentsScreen from '../screens/admin/StudentsScreen';
import SectionsScreen from '../screens/admin/SectionsScreen';
import EnrollmentsScreen from '../screens/admin/EnrollmentsScreen';
import StudentAccountsScreen from '../screens/admin/StudentAccountsScreen';
import AdminDrawerContent from '../components/AdminDrawerContent';
import { useAuth } from '../contexts/AuthContext';

const Drawer = createDrawerNavigator();

export const AdminNavigator: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Drawer.Navigator
      initialRouteName="AdminDashboard"
      drawerContent={(props) => (
        <AdminDrawerContent {...props} onLogout={() => signOut()} />
      )}
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Students" component={StudentsScreen} options={{ title: 'Students' }} />
      <Drawer.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Subjects' }} />
      <Drawer.Screen name="Sections" component={SectionsScreen} options={{ title: 'Sections' }} />
      <Drawer.Screen name="Enrollments" component={EnrollmentsScreen} options={{ title: 'Enrollments' }} />
      <Drawer.Screen name="StudentAccounts" component={StudentAccountsScreen} options={{ title: 'Student Accounts' }} />
    </Drawer.Navigator>
  );
};
