// evaluation utilities for ml outputs

import apiClient from '../api/apiClient';

export interface EvaluationResult {
  relevance: number;
  faithfulness: number;
  toxicity?: number;
  bias?: number;
  isValid: boolean;
}

/**
 * Evaluates response quality using metrics
 * @param promptText The original prompt sent to the model
 * @param responseText The response to evaluate
 * @param referenceData Optional reference data for factual verification
 */
export async function evaluateLLMResponse(
  promptText: string, 
  responseText: string,
  referenceData?: string
): Promise<EvaluationResult> {
  try {
    // mock api call
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
    
    // fallback to basic checks
    return fallbackEvaluation(responseText);
  }
}

function fallbackEvaluation(responseText: string): EvaluationResult {
  // check length
  const isTooShort = responseText.length < 50;
  
  // check keywords
  const hasMedicalTerms = /symptom|condition|diagnosis|treatment|health|medical|doctor/i.test(responseText);
  
  // check disclaimer
  const hasDisclaimer = /consult|professional|not medical advice|disclaimer/i.test(responseText);
  
  // calc relevance
  const relevance = hasMedicalTerms ? 0.85 : 0.5;
  
  // calc faithfulness
  const faithfulness = hasDisclaimer ? 0.9 : 0.7;
  
  return {
    relevance,
    faithfulness,
    isValid: !isTooShort && hasMedicalTerms && hasDisclaimer
  };
}
