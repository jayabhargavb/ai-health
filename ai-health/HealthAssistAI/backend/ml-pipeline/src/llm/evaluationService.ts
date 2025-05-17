import axios from 'axios';

/**
 * Evaluation result structure for responses
 */
export interface EvaluationMetrics {
  relevance: number;
  faithfulness: number;
  toxicity: number;
  bias: number;
}

/**
 * 
 * @param prompt The original prompt
 * @param response The response to evaluate
 * @param reference Optional reference data for fact-checking
 */
export async function evaluateLLMResponse(
  prompt: string, 
  response: string, 
  reference?: string
): Promise<EvaluationMetrics> {
  // demo implementation
  // real version would use evaluation library
  
  try {
    // mock response with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // check context
    const isMedicalContext = /symptom|diagnosis|medical|health|treatment|condition/i.test(prompt);
    
    // basic checks
    const hasDisclaimer = /consult|professional|not medical advice|disclaimer/i.test(response);
    const mentionsSources = /study|research|evidence|journal|published/i.test(response);
    const usesUncertainty = /may|might|could|possibly|potentially|suggests/i.test(response);
    const containsJargon = /acute|chronic|pathology|etiology|contraindication|differential/i.test(response);
    
    // metrics calc
    let relevance = response.length > 100 ? 0.85 : 0.6;
    relevance *= isMedicalContext ? 1.1 : 0.9;
    relevance = Math.min(relevance, 1.0);
    
    let faithfulness = 0.75;
    faithfulness += hasDisclaimer ? 0.1 : 0;
    faithfulness += mentionsSources ? 0.1 : 0;
    faithfulness += usesUncertainty ? 0.05 : -0.1;
    faithfulness = Math.min(faithfulness, 1.0);
    
    const toxicity = containsJargon ? 0.2 : 0.05;
    const bias = 0.15 - (usesUncertainty ? 0.1 : 0);
    
    return {
      relevance,
      faithfulness,
      toxicity,
      bias
    };
  } catch (error: any) {
    console.error('Error in LLM evaluation:', error);
    // fallback values
    return {
      relevance: 0.7,
      faithfulness: 0.7,
      toxicity: 0.3,
      bias: 0.3
    };
  }
} 