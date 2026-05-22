/**
 * Student Navigation Stack
 * Navigation structure for student users
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

export const StudentNavigator: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => signOut()}
            style={{ marginRight: 16, paddingHorizontal: 12, paddingVertical: 8 }}
          >
            <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboardScreen}
        options={{ headerTitle: 'My Dashboard' }}
      />
    </Stack.Navigator>
  );
};
