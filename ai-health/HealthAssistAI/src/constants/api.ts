/**
 * API endpoints and environment-based URL handling
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Get environment variables from Expo Constants or fallback to defaults
const expoConstants = Constants.expoConfig?.extra || {};

// Platform-specific API URLs
// Android emulator needs special handling to connect to local machine
const getLocalApiUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator needs to access host machine via 10.0.2.2
    return 'http://10.0.2.2:5001';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:5001';
  } else {
    // Web can use relative URLs
    return '/api';
  }
};

// API URL selection based on environment
export const API_BASE_URL = isProduction
  ? (expoConstants.apiUrl || 'https://api.healthassistai.com')
  : (expoConstants.devApiUrl || getLocalApiUrl());

// Timeout settings
export const API_TIMEOUT = 15000; // 15 seconds

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
};

// Symptom analysis endpoints
export const SYMPTOM_ENDPOINTS = {
  ANALYZE: '/api/symptoms/analyze',
  HISTORY: '/api/symptoms/history',
  DETAIL: (id: string) => `/api/symptoms/${id}`,
};

// ML pipeline endpoints
export const ML_ENDPOINTS = {
  ANALYZE: '/api/analyze',
  EVALUATE: '/api/evaluate/llm',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// Console logging for debugging
if (!isProduction) {
  console.log('API Base URL:', API_BASE_URL);
}
