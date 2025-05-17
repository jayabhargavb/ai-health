import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../../constants/api';
import * as SecureStore from 'expo-secure-store';
import { ApiError } from '../../types/api.types';
import { Platform } from 'react-native';

let authToken: string | null = null;

/**
 * Set the auth token for future requests
 */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

/**
 * Axios instance with interceptors
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set to false to avoid hanging on failed requests
  // This will throw faster when server is unreachable
  validateStatus: (status) => status >= 200 && status < 500
});

// Synchronous request interceptor: attach token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    // Add device info to request headers
    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-Platform-Version'] = Platform.Version.toString();
    
    // Ensure timeout is set to prevent hanging
    if (!config.timeout) {
      config.timeout = API_TIMEOUT;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle axios cancelation/timeout errors differently
    if (axios.isCancel(error)) {
      return Promise.reject({
        status: 408,
        message: 'Request was canceled.',
        code: 'REQUEST_CANCELED',
      } as ApiError);
    }

    // Network or timeout errors
    if (!error.response) {
      // If the error contains a message with 'timeout' in it, it's a timeout
      if (error.message?.toLowerCase().includes('timeout')) {
        return Promise.reject({
          status: 408,
          message: 'Request timed out. Your connection may be slow or the server is busy.',
          code: 'TIMEOUT_ERROR',
        } as ApiError);
      }

      // Other network errors
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      } as ApiError);
    }
    
    // Server errors
    let apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.message,
      code: error.code,
      details: error.response?.data,
    };
    
    // Try to extract fallbackResult from the error response if available
    if (error.response?.data?.fallbackResult) {
      apiError.fallbackResult = error.response.data.fallbackResult;
    }
    
    // Customize error message based on status code
    switch (apiError.status) {
      case 401:
        apiError.message = 'Authentication required. Please log in again.';
        // Handle token expiration - could automatically trigger refresh
        break;
      case 403:
        apiError.message = 'You do not have permission to access this resource.';
        break;
      case 404:
        apiError.message = 'The requested resource was not found.';
        break;
      case 422:
        apiError.message = 'Validation error. Please check your input.';
        break;
      case 429:
        apiError.message = 'Too many requests. Please try again later.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        apiError.message = 'An unexpected server error occurred. Please try again later.';
        break;
    }
    
    return Promise.reject(apiError);
  }
);

/**
 * Helper to load token from SecureStore and set it
 */
export const loadTokenFromStorage = async () => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error('Error loading token:', error);
    setAuthToken(null);
    return null;
  }
};

export default apiClient;
