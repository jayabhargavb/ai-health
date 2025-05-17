import { AnalyzeRequest, AnalyzeResponse } from '../../types/api.types';
import { loadTokenFromStorage } from '../api/apiClient';
import { analyzeSymptoms } from '../api/symptomService';

/**
 * Analyze symptoms using the LLM-based ML pipeline with OpenRouter.
 * 
 * This service connects to our backend ML pipeline which uses 
 * OpenRouter to access the Llama 3.3 8B model for medical analysis.
 */
export const analyzeSymptomsWithLLM = async (payload: AnalyzeRequest): Promise<AnalyzeResponse> => {
  // Load auth token if needed for future authenticated endpoints
  await loadTokenFromStorage();
  
  try {
    // Call our symptom service which connects to the backend
    return await analyzeSymptoms(payload);
  } catch (error) {
    console.error('Symptom analysis failed in LLM service', error);
    throw error; // Propagate error to be handled by the caller
  }
};
