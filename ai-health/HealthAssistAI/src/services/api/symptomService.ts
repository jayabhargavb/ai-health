import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyzeRequest, AnalyzeResponse, ApiError } from '../../types/api.types';
import { SymptomCheck } from '../../types';
import apiClient from './apiClient';
import { API_BASE_URL, ML_ENDPOINTS } from '../../constants/api';

/**
 * Analyze symptoms using the HealthAssistAI backend
 * Connects to our ML pipeline on the backend which uses OpenRouter LLM
 */
export const analyzeSymptoms = async (payload: AnalyzeRequest): Promise<AnalyzeResponse> => {
  try {
    // Format the symptoms into the structure expected by the backend
    const formattedPayload = {
      symptoms: payload.symptoms.map(symptom => ({
        name: symptom.name,
        severity: symptom.severity || 5,
        duration: symptom.duration
      })),
      context: payload.context || {}
    };

    // Add a timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

    try {
      // Call our backend ML pipeline with OpenRouter integration
      const { data } = await apiClient.post<AnalyzeResponse>(
        ML_ENDPOINTS.ANALYZE,
        formattedPayload,
        { 
          timeout: 30000, // 30 seconds timeout
          signal: controller.signal 
        }
      );
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Store successful analysis in history
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
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Handle axios errors which may contain fallback results
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        
        // Log the error
        console.error('API error:', axiosError.response.status, errorData);
        
        // If the backend sent a fallback result, use it
        if (errorData.fallbackResult) {
          console.log('Using fallback result from backend');
          
          // Store fallback result in history
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
          
          // Throw an error with the fallback result
          const errorWithFallback = new Error(errorData.error || 'Analysis failed');
          (errorWithFallback as any).fallbackResult = errorData.fallbackResult;
          throw errorWithFallback;
        }
        
        // Format error message
        const errorMessage = errorData.error || 'Analysis failed due to a server error';
        throw new Error(errorMessage);
      }
      
      // If aborted due to timeout
      if (axiosError.name === 'AbortError' || axiosError.code === 'ECONNABORTED') {
        throw new Error('Analysis timed out. Please try again.');
      }
      
      // Re-throw the original error
      throw axiosError;
    }
  } catch (error: any) {
    // Pass through errors with fallback results
    if (error.fallbackResult) {
      throw error;
    }
    
    // Handle all other errors with user-friendly messages
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

// Helper function to determine severity level
const getSeverityLevel = (symptoms: Array<any>): 'low' | 'medium' | 'high' => {
  const avgSeverity = symptoms.reduce((sum, s) => sum + (s.severity || 5), 0) / symptoms.length;
  if (avgSeverity <= 3) return 'low';
  if (avgSeverity <= 6) return 'medium';
  return 'high';
};

// local history key
const HISTORY_KEY = 'symptom_history';

// adds a symptom check to local history
export const addToHistory = async (check: SymptomCheck): Promise<void> => {
  const history = await getHistory();
  history.unshift(check);
  // Keep only the last 20 entries to prevent storage issues
  const trimmedHistory = history.slice(0, 20);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
};

// gets local symptom check history
export const getHistory = async (): Promise<SymptomCheck[]> => {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

// gets a specific symptom check from local history
export const getSymptomCheckDetail = async (id: string): Promise<SymptomCheck | null> => {
  const history = await getHistory();
  return history.find((c) => c.id === id) || null;
};
