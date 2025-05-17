import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyzeRequest, AnalyzeResponse, ApiError } from '../../types/api.types';
import { SymptomCheck } from '../../types';
import apiClient from './apiClient';
import { API_BASE_URL, ML_ENDPOINTS } from '../../constants/api';


export const analyzeSymptoms = async (payload: AnalyzeRequest): Promise<AnalyzeResponse> => {
  try {
    // format payload
    const formattedPayload = {
      symptoms: payload.symptoms.map(symptom => ({
        name: symptom.name,
        severity: symptom.severity || 5,
        duration: symptom.duration
      })),
      context: payload.context || {}
    };

    // setup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      // call backend
      const { data } = await apiClient.post<AnalyzeResponse>(
        ML_ENDPOINTS.ANALYZE,
        formattedPayload,
        { 
          timeout: 30000, // 30s timeout
          signal: controller.signal 
        }
      );
      
      // clear timeout
      clearTimeout(timeoutId);
      
      // save to history
      if (data && data.result) {
        await addToHistory({
          id: `analysis-${Date.now()}`,
          userId: 'local',
          timestamp: new Date(),
          symptoms: payload.symptoms,
          analysis: data.result,
          metadata: { 
            severity: getSeverityLevel(payload.symptoms),
            confidence: data.confidence 
          },
        });
      }
      
      return data;
    } catch (axiosError: any) {
      // clear timeout
      clearTimeout(timeoutId);
      
      // handle errors with fallback
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        
        // log error
        console.error('API error:', axiosError.response.status, errorData);
        
        // use fallback if available
        if (errorData.fallbackResult) {
          console.log('Using fallback result from backend');
          
          // save fallback to history
          try {
            await addToHistory({
              id: `fallback-${Date.now()}`,
              userId: 'local',
              timestamp: new Date(),
              symptoms: payload.symptoms,
              analysis: errorData.fallbackResult.result,
              metadata: { 
                severity: getSeverityLevel(payload.symptoms),
                confidence: errorData.fallbackResult.confidence || 0.3,
                isFallback: true
              },
            });
          } catch (historyError) {
            console.error('Failed to save fallback result to history', historyError);
          }
          
          // throw with fallback
          const errorWithFallback = new Error(errorData.error || 'Analysis failed');
          (errorWithFallback as any).fallbackResult = errorData.fallbackResult;
          throw errorWithFallback;
        }
        
        // format error
        const errorMessage = errorData.error || 'Analysis failed due to a server error';
        throw new Error(errorMessage);
      }
      
      // handle timeout
      if (axiosError.name === 'AbortError' || axiosError.code === 'ECONNABORTED') {
        throw new Error('Analysis timed out. Please try again.');
      }
      
      // rethrow
      throw axiosError;
    }
  } catch (error: any) {
    // pass through fallback errors
    if (error.fallbackResult) {
      throw error;
    }
    
    // handle other errors
    console.error('Symptom analysis failed', error);
    
    let errorMessage = 'Analysis failed due to a technical issue.';
    
    if (error.status === 0 || error.message?.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
    } else if (error.status === 503 || error.status === 502) {
      errorMessage = 'The analysis service is temporarily unavailable. Please try again later.';
    }
    
    throw new Error(errorMessage);
  }
};

// calculate severity level
const getSeverityLevel = (symptoms: Array<any>): 'low' | 'medium' | 'high' => {
  const avgSeverity = symptoms.reduce((sum, s) => sum + (s.severity || 5), 0) / symptoms.length;
  if (avgSeverity <= 3) return 'low';
  if (avgSeverity <= 6) return 'medium';
  return 'high';
};

// history storage key
const HISTORY_KEY = 'symptom_history';

// add check to history
export const addToHistory = async (check: SymptomCheck): Promise<void> => {
  const history = await getHistory();
  history.unshift(check);
  // keep last 20 entries
  const trimmedHistory = history.slice(0, 20);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
};

// get history list
export const getHistory = async (): Promise<SymptomCheck[]> => {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

// get single check
export const getSymptomCheckDetail = async (id: string): Promise<SymptomCheck | null> => {
  const history = await getHistory();
  return history.find((c) => c.id === id) || null;
};
