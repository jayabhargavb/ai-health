import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../../constants/api';

/**
 * Save authentication token
 */
export const saveAuthToken = async (token: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    return false;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Delete authentication token
 */
export const deleteAuthToken = async (): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    return true;
  } catch (error) {
    console.error('Error deleting auth token:', error);
    return false;
  }
};

/**
 * Save refresh token
 */
export const saveRefreshToken = async (token: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving refresh token:', error);
    return false;
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Delete refresh token
 */
export const deleteRefreshToken = async (): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    return true;
  } catch (error) {
    console.error('Error deleting refresh token:', error);
    return false;
  }
};

/**
 * Clear all tokens
 */
export const clearAllTokens = async (): Promise<boolean> => {
  try {
    await Promise.all([
      deleteAuthToken(),
      deleteRefreshToken()
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing tokens:', error);
    return false;
  }
};

/**
 * Save user data
 */
export const saveUserData = async (userData: object): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.USER_DATA, 
      JSON.stringify(userData)
    );
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Get user data
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};
