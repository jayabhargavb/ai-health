import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../../constants/api';
import * as SecureStore from 'expo-secure-store';
import { ApiError } from '../../types/api.types';
import { Platform } from 'react-native';

let authToken: string | null = null;

// set auth token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // avoid hanging on failures
  validateStatus: (status) => status >= 200 && status < 500
});

// add token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    // add device info
    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-Platform-Version'] = Platform.Version.toString();
    
    // set timeout
    if (!config.timeout) {
      config.timeout = API_TIMEOUT;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    // handle cancellation
    if (axios.isCancel(error)) {
      return Promise.reject({
        status: 408,
        message: 'Request was canceled.',
        code: 'REQUEST_CANCELED',
      } as ApiError);
    }

    // network errors
    if (!error.response) {
      // timeout check
      if (error.message?.toLowerCase().includes('timeout')) {
        return Promise.reject({
          status: 408,
          message: 'Request timed out. Your connection may be slow or the server is busy.',
          code: 'TIMEOUT_ERROR',
        } as ApiError);
      }

      // other network issues
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      } as ApiError);
    }
    
    // server errors
    const apiError: ApiError = {
      status: error.response.status || 500,
      message: error.message,
      code: error.code as string,
      details: error.response.data,
    };
    
    // extract fallback result
    if (error.response.data?.fallbackResult) {
      apiError.fallbackResult = error.response.data.fallbackResult;
    }
    
    // customize error messages
    switch (apiError.status) {
      case 401:
        apiError.message = 'Authentication required. Please log in again.';
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
