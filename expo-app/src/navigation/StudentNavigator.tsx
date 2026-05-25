/**
 * Student Navigation Stack
 * Navigation structure for student users
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import SubjectsScreen from '../screens/student/SubjectsScreen';
import ScheduleScreen from '../screens/student/ScheduleScreen';
import NotificationsScreen from '../screens/student/NotificationsScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

export const StudentNavigator: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarShowLabel: true,
        tabBarStyle: { height: 62, paddingBottom: 6, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => {
          let name = 'home';
          if (route.name === 'Home') name = 'home-outline';
          if (route.name === 'Subjects') name = 'book-open-page-variant-outline';
          if (route.name === 'Schedule') name = 'calendar-range';
          if (route.name === 'Notifications') name = 'bell-outline';
          if (route.name === 'Profile') name = 'account-circle-outline';
          return <Icon name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      })}
    >
      <Tab.Screen name="Home" component={StudentDashboardScreen} options={{ headerTitle: 'Dashboard' }} />
      <Tab.Screen name="Subjects" component={SubjectsScreen} options={{ headerTitle: 'Subjects' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ headerTitle: 'Schedule' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerTitle: 'Notifications' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerTitle: 'Profile' }} />
    </Tab.Navigator>
  );
};
