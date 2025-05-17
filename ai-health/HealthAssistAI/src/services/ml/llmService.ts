import { AnalyzeRequest, AnalyzeResponse } from '../../types/api.types';
import { loadTokenFromStorage } from '../api/apiClient';
import { analyzeSymptoms } from '../api/symptomService';

export const analyzeSymptomsWithLLM = async (payload: AnalyzeRequest): Promise<AnalyzeResponse> => {
  // load auth token
  await loadTokenFromStorage();
  
  try {
    // call backend service
    return await analyzeSymptoms(payload);
  } catch (error) {
    console.error('Symptom analysis failed in LLM service', error);
    throw error; // propagate error
  }
};
