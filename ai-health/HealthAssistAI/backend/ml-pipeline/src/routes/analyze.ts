import express from 'express';
import { validateAnalyzeRequest } from '../utils/validation';
import { analyzeSymptomsWithOpenRouter } from '../llm/openrouterService';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Validate request body
    const parsed = validateAnalyzeRequest(req.body);
    
    // Only use OpenRouter - no fallbacks
    const result = await analyzeSymptomsWithOpenRouter(parsed);
    
    // If we have a successful result with possibleConditions, use it
    if (!('error' in result) && Array.isArray(result.possibleConditions) && result.possibleConditions.length > 0) {
      console.log('Successfully generated analysis with OpenRouter');
      return res.status(200).json(result);
    }
    
    // If OpenRouter failed or returned invalid data, return the error
    if ('error' in result) {
      console.error('OpenRouter error:', result.error);
      return res.status(result.status || 500).json({ error: result.error });
    }
    
    // Unexpected case - no error but no valid data either
    return res.status(500).json({ error: 'Failed to generate analysis' });
  } catch (err: any) {
    // Return the actual error for debugging
    console.error('Request error:', err.message || err);
    return res.status(500).json({
      error: err.message || 'Unknown error',
      details: err.response?.data || {}
    });
  }
});

export default router; 