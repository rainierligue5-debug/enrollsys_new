/**
 * Authentication Context
 * Manages authentication state and user data across the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isUserLoggedIn,
  getStoredUser,
  clearUserData,
} from '../services/auth.service';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignout: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  // Bootstrap async data when app loads
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Wait longer for AsyncStorage to be fully initialized
        // This is critical on initial app load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const loggedIn = await isUserLoggedIn();
        if (loggedIn) {
          const userData = await getStoredUser();
          setUser(userData);
        } else {
          setIsSignout(true);
        }
      } catch (error) {
        console.warn('Error bootstrapping auth (continuing anyway):', error);
        // Don't break the app - just show login screen
        setIsSignout(true);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = {
    user,
    isLoading,
    isSignout,
    signIn: async () => {
      try {
        const userData = await getStoredUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching stored user after sign in:', error);
      } finally {
        setIsSignout(false);
      }
    },
    signOut: async () => {
      setIsLoading(true);
      try {
        await clearUserData();
        setUser(null);
        setIsSignout(true);
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        setIsLoading(false);
      }
    },
    refresh: async () => {
      const userData = await getStoredUser();
      setUser(userData);
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
