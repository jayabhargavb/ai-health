import express from 'express';
import { validateEvaluationRequest } from '../utils/validation';
import { evaluateLLMResponse } from '../llm/evaluationService';

const router = express.Router();

/**
 * POST /api/evaluate/llm
 * Evaluates LLM responses for quality, factual consistency, and safety
 */
router.post('/llm', async (req, res) => {
  try {
    const { prompt, response, reference } = validateEvaluationRequest(req.body);
    
    const evaluationResult = await evaluateLLMResponse(prompt, response, reference);
    
    res.json({
      metrics: evaluationResult,
      meta: {
        timestamp: new Date().toISOString(),
        evaluation_service: 'deepeval',
        version: '1.0.0'
      }
    });
  } catch (err: any) {
    res.status(400).json({ 
      error: err.message,
      status: 'failed'
    });
  }
});

export default router; 