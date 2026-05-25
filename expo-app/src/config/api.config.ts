/**
 * API Configuration for Mobile App
 * 
 * This file handles API configuration for connecting to Django backend
 * from different environments: localhost, local WiFi, or production.
 * 
 * IMPORTANT: Update this based on your network setup and ensure Django is running with the correct host and port.
 */


import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '../utils/storage';

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

/**
 * API Base URL Configuration
 * 
 * Choose one based on your setup:
 * 
 * 1. For Android Emulator (localhost):
 *    const API_BASE_URL = 'http://10.0.2.2:8000/api/';
 * 
 * 2. For Physical Phone on Same WiFi:
 *    Find your computer's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
 *    Example: const API_BASE_URL = 'http://192.168.1.100:8000/api/';
 * 
 * 3. For Production Server:
 *    const API_BASE_URL = 'https://your-server.com/api/';
 * 
 * IMPORTANT NOTES:
 * - Must use HTTP (not HTTPS) for local network on development
 * - Phone must be on SAME WiFi network as Django server
 * - Django must be running with: python manage.py runserver 0.0.0.0:8000
 */

// Change this to your Django backend URL.
// Current development WiFi IP: 192.168.1.35
// Update this value later if your computer's IP changes s.
export const API_BASE_URL = 'http://192.168.1.35:8000/api/';

// ============================================
// API INSTANCE CREATION
// ============================================

const API: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR - Add Auth Token
// ============================================

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      // DEBUG: confirm token is present before API calls (helps diagnose 401 in Expo Go)
      if (!token) {
        // Avoid noisy warnings during app startup; log only during development.
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.debug('[API CONFIG] Missing access_token in storage (token is null/empty)');
        }
        // Keep request without Authorization -> backend should return 401
      } else {
        // Ensure we ALWAYS set the header when a token exists
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }

    } catch (error) {
      // Silently fail - AsyncStorage might not be ready yet
      // This is expected during app initialization
      console.warn('AsyncStorage not available in request interceptor');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Handle Errors
// ============================================

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
        // Navigation will be handled by the app based on user state
      } catch (err) {
        // Silently fail - AsyncStorage might not be available
        console.warn('Could not clear auth data:', err);
      }
    }

    // Provide user-friendly error messages
    if (!error.response) {
      error.message = 'Cannot connect to backend. Check:\n1. Django is running\n2. WiFi network is same\n3. API_BASE_URL is correct';
    }

    return Promise.reject(error);
  }
);

export default API;
