/**
 * Authentication Service
 * Handles login, registration, logout, and token management
 */

import AsyncStorage from '../utils/storage';
import API from '../config/api.config';
import {
  AuthResponse,
  User,
  StudentRegistrationData,
  RegisterResponse,
  AdminRegistrationData,
} from '../types';

// ============== LOGIN = =============

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await API.post<AuthResponse>('auth/login/', {
      email,
      password,
    });

    if (response.data.access) {
      await AsyncStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        await AsyncStorage.setItem('refresh_token', response.data.refresh);
      }
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw new Error(
      error.response?.data?.error ||
        'Login failed. Check backend connection.'
    );
  }
};

// ============== REGISTER ==============

export const register = async (
  data: StudentRegistrationData
): Promise<RegisterResponse> => {
  try {
    const response = await API.post<RegisterResponse>('auth/register/', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const dataObj = error.response.data;
      if (typeof dataObj === 'object') {
        const messages: string[] = [];
        Object.entries(dataObj).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            messages.push(`${key}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            messages.push(`${key}: ${value}`);
          }
        });
        if (messages.length > 0) {
          throw new Error(messages.join('\n'));
        }
      }
    }

    throw new Error(
      error.response?.data?.error || 'Registration failed. Please try again.'
    );
  }
};

// ============== ADMIN REGISTRATION ==============

export const adminRegister = async (
  data: AdminRegistrationData
): Promise<AuthResponse> => {
  try {
    const response = await API.post<AuthResponse>(
      'auth/admin-register/',
      data
    );

    if (response.data.access) {
      await AsyncStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        await AsyncStorage.setItem('refresh_token', response.data.refresh);
      }
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        'Admin registration failed. Please try again.'
    );
  }
};

// ============== LOGOUT ==============

export const logout = async (): Promise<void> => {
  try {
    await API.post('auth/logout/');
  } catch (error) {
    console.error('Logout API error (continuing anyway):', error);
  } finally {
    // Always clear local data regardless of API response
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user');
  }
};

// ============== PASSWORD RESET ==============

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await API.post('auth/password-reset/', { email });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        'Password reset request failed. Please try again.'
    );
  }
};

export const confirmPasswordReset = async (
  uid: string,
  token: string,
  password: string,
  password_confirm: string
): Promise<void> => {
  try {
    await API.post('auth/password-reset/confirm/', {
      uid,
      token,
      password,
      password_confirm,
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        'Password reset confirmation failed. Please try again.'
    );
  }
};

// ============== USER INFO ==============

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.warn('Error retrieving stored user (continuing anyway):', error);
    return null;
  }
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  } catch (error) {
    console.warn('AsyncStorage error (continuing anyway):', error);
    return false;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.warn('AsyncStorage error while clearing data:', error);
  }
};

export const updateProfile = async (payload: { name?: string; email?: string; password?: string }) => {
  try {
    const response = await API.patch('auth/me/', payload);
    // Update cached user
    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data?.error || JSON.stringify(error.response.data));
    }
    throw new Error('Failed to update profile');
  }
};
