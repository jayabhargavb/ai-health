import apiClient, { setAuthToken, loadTokenFromStorage } from './apiClient';
import * as SecureStore from 'expo-secure-store';
import { AuthRequest, AuthResponse, RefreshTokenRequest, RefreshTokenResponse } from '../../types/api.types';
import { User } from '../../types';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Store tokens securely and update apiClient
 */
const storeTokens = async (token: string, refreshToken?: string) => {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  setAuthToken(token);
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Login user
 */
export const login = async (payload: AuthRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', payload);
  await storeTokens(data.token, data.refreshToken);
  return data;
};

/**
 * Register user
 */
export const register = async (payload: AuthRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/register', payload);
  await storeTokens(data.token, data.refreshToken);
  return data;
};

/**
 * Refresh token
 */
export const refresh = async (payload: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const { data } = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh', payload);
  await storeTokens(data.token, data.refreshToken);
  return data;
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<User> => {
  await loadTokenFromStorage();
  const { data } = await apiClient.get<User>('/api/profile');
  return data;
};

/**
 * Update user profile
 */
export const updateProfile = async (profile: Partial<User>): Promise<User> => {
  await loadTokenFromStorage();
  const { data } = await apiClient.put<User>('/api/profile', profile);
  return data;
};
