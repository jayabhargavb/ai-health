// provides deep evaluation utilities for LLM/ML outputs

import apiClient from '../api/apiClient';

export interface EvaluationResult {
  relevance: number;
  faithfulness: number;
  toxicity?: number;
  bias?: number;
  isValid: boolean;
}

/**
 * Evaluates LLM response quality using DeepEval metrics
 * @param promptText The original prompt sent to the LLM
 * @param responseText The LLM response to evaluate
 * @param referenceData Optional reference data for factual verification
 */
export async function evaluateLLMResponse(
  promptText: string, 
  responseText: string,
  referenceData?: string
): Promise<EvaluationResult> {
  try {
    // In production, this would call the actual DeepEval API
    const { data } = await apiClient.post('/api/evaluate/llm', {
      prompt: promptText,
      response: responseText,
      reference: referenceData
    });
    
    return {
      relevance: data.metrics.relevance,
      faithfulness: data.metrics.faithfulness,
      toxicity: data.metrics.toxicity,
      bias: data.metrics.bias,
      isValid: data.metrics.relevance > 0.7 && data.metrics.faithfulness > 0.8
    };
  } catch (error) {
    console.error('Error evaluating LLM response:', error);
    
    // Fallback to basic heuristics if API call fails
    return fallbackEvaluation(responseText);
  }
}

/**
 * Simple fallback evaluation using basic heuristics
 */
function fallbackEvaluation(responseText: string): EvaluationResult {
  // Check if response is too short
  const isTooShort = responseText.length < 50;
  
  // Check if response contains medical-related keywords
  const hasMedicalTerms = /symptom|condition|diagnosis|treatment|health|medical|doctor/i.test(responseText);
  
  // Check for disclaimer/uncertainty words
  const hasDisclaimer = /consult|professional|not medical advice|disclaimer/i.test(responseText);
  
  // Calculate basic relevance score
  const relevance = hasMedicalTerms ? 0.85 : 0.5;
  
  // Calculate basic faithfulness score
  const faithfulness = hasDisclaimer ? 0.9 : 0.7;
  
  return {
    relevance,
    faithfulness,
    isValid: !isTooShort && hasMedicalTerms && hasDisclaimer
  };
}
