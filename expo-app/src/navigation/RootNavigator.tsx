/**
 * Root Navigation Component
 * Main app navigation logic based on authentication state
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AdminNavigator } from './AdminNavigator';
import { StudentNavigator } from './StudentNavigator';
import { AdminRefreshProvider } from '../contexts/AdminRefreshContext';

const Stack = createNativeStackNavigator();


export const RootNavigator: React.FC = () => {
  const { user, isLoading, isSignout, signIn } = useAuth();

  useEffect(() => {
    // After login, update auth state
    const checkAuth = async () => {
      // This will be triggered by login service
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSignout ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        ) : user?.role === 'admin' ? (
          <Stack.Screen
            name="Admin"
            options={{
              animationTypeForReplace: 'pop',
            }}
          >
            {() => (
              <AdminRefreshProvider>
                <AdminNavigator />
              </AdminRefreshProvider>
            )}
          </Stack.Screen>

        ) : (


          <Stack.Screen
            name="Student"
            component={StudentNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
