import { SymptomCheck } from './index';

/**
 * Root stack parameter list
 */
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

/**
 * Auth stack parameter list
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Main tab parameter list
 */
export type MainTabParamList = {
  Home: undefined;
  Symptoms: undefined;
  Analysis: { symptoms: string[] } | undefined;
  Results: { analysisId: string } | undefined;
  History: undefined;
};

/**
 * History stack parameter list
 */
export type HistoryStackParamList = {
  HistoryMain: undefined;
  HistoryDetail: { check: SymptomCheck };
};

/**
 * Navigation prop helpers (for useNavigation generics)
 */
export type Navigation = any; // Replace with proper NavigationProp if needed
