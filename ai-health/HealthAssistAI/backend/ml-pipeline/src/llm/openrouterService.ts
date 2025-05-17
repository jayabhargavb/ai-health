import axios from 'axios';
import { OpenAI } from 'openai';
import { buildSymptomPrompt } from './promptTemplates';

export interface SymptomInput {
  name: string;
  severity?: number;
  duration?: string;
}
export interface ContextInput {
  age?: number;
  gender?: string;
}
export interface AnalyzeSymptomsPayload {
  symptoms: SymptomInput[];
  context?: ContextInput;
}
export interface LLMOutput {
  possibleConditions?: { name: string; likelihood: number }[];
  recommendations?: string[];
  urgencyLevel?: 'routine' | 'soon' | 'urgent';
  disclaimer?: string;
  error?: string;
  status?: number;
}

export interface ErrorResult {
  error: string;
  status: number;
  raw?: string;
  details?: any;
  possibleConditions?: never;
}

export type AnalyzeSymptomsResult = LLMOutput | ErrorResult;

// api config
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// model selection
const MODEL = "openai/gpt-4.1-nano"; 

// init client
const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5001',
    'X-Title': 'HealthAssistAI'
  }
});

function validatePayload(payload: any): { valid: boolean; error?: string } {
  if (!payload || typeof payload !== 'object') return { valid: false, error: 'Payload must be an object' };
  if (!Array.isArray(payload.symptoms) || payload.symptoms.length === 0) return { valid: false, error: 'At least one symptom is required' };
  for (const s of payload.symptoms) {
    if (!s.name || typeof s.name !== 'string') return { valid: false, error: 'Each symptom must have a name' };
    if (s.severity && (typeof s.severity !== 'number' || s.severity < 0 || s.severity > 10)) return { valid: false, error: 'Severity must be a number between 0 and 10' };
    if (s.duration && typeof s.duration !== 'string') return { valid: false, error: 'Duration must be a string' };
  }
  if (payload.context) {
    if (payload.context.age && (typeof payload.context.age !== 'number' || payload.context.age < 0 || payload.context.age > 120)) return { valid: false, error: 'Age must be a number between 0 and 120' };
    if (payload.context.gender && !['male', 'female', 'other'].includes(payload.context.gender)) return { valid: false, error: 'Gender must be male, female, or other' };
  }
  return { valid: true };
}

function validateLLMOutput(output: any): { valid: boolean; error?: string } {
  if (!output || typeof output !== 'object') return { valid: false, error: 'LLM output is not an object' };
  if (output.error) return { valid: false, error: output.error };
  if (!Array.isArray(output.possibleConditions)) return { valid: false, error: 'Missing or invalid possibleConditions' };
  if (!Array.isArray(output.recommendations)) return { valid: false, error: 'Missing or invalid recommendations' };
  if (!['routine', 'soon', 'urgent'].includes(output.urgencyLevel)) return { valid: false, error: 'Invalid urgencyLevel' };
  if (typeof output.disclaimer !== 'string') return { valid: false, error: 'Missing disclaimer' };
  return { valid: true };
}

function extractFirstJsonObject(text: string): string | null {
  // find json with regex
  const jsonRegex = /\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}/g;
  const matches = text.match(jsonRegex);
  
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  // fallback approach
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }
  
  return null;
}

export async function analyzeSymptomsWithOpenRouter(payload: AnalyzeSymptomsPayload): Promise<AnalyzeSymptomsResult> {
  // validate input
  const validation = validatePayload(payload);
  if (!validation.valid) {
    return { error: validation.error || 'Invalid input', status: 400 };
  }
  
  // check api key
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is not configured');
    return { 
      error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env file.',
      status: 500 
    };
  }
  
  // debug key format
  console.log(`API key format check: ${OPENROUTER_API_KEY.substring(0, 6)}...${OPENROUTER_API_KEY.length} chars`);
  console.log('Expected format: sk-or-...');
  
  // create prompt
  const prompt = buildSymptomPrompt(payload.symptoms, payload.context?.age, payload.context?.gender);
  console.log('Sending prompt to OpenRouter:', prompt.substring(0, 100) + '...');
  console.log('Full prompt length:', prompt.length);

  try {
    console.log('Making OpenRouter API call using OpenAI SDK...');
    
    // api call
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    console.log('OpenAI SDK response received');
    console.log('Response object keys:', Object.keys(response).join(', '));
    
    // debug response
    console.log('Full response:', JSON.stringify(response, null, 2));
    
    if ('error' in response) {
      console.error('Error in response:', response.error);
      return {
        error: `OpenRouter error: ${typeof response.error === 'object' ? JSON.stringify(response.error) : response.error}`,
        status: 502,
        raw: JSON.stringify(response)
      };
    }
    
    // get content
    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      console.error('No content in response');
      return {
        error: 'OpenRouter API returned no content',
        status: 502,
        raw: JSON.stringify(response)
      };
    }
    
    console.log('OpenRouter raw response (first 200 chars):', content.substring(0, 200));
    
    // check for choices
    if (!response.choices || response.choices.length === 0) {
      console.error('No choices in response');
      return {
        error: 'OpenRouter API returned no response choices',
        status: 502,
        raw: JSON.stringify(response)
      };
    }
    
    // check for empty content
    if (content.trim() === '') {
      console.error('Empty response content');
      return {
        error: 'OpenRouter API returned empty content',
        status: 502,
        raw: JSON.stringify(response)
      };
    }
    
    // parse json
    try {
      const parsed = JSON.parse(content);
      console.log('JSON parse successful. Keys:', Object.keys(parsed).join(', '));
      
      // validate format
      if (!Array.isArray(parsed.possibleConditions)) {
        console.error('Missing possibleConditions array');
        return { 
          error: 'Missing or invalid possibleConditions in response',
          status: 502,
          raw: JSON.stringify(parsed).substring(0, 300)
        };
      }
      
      // success!
      return parsed;
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      
      // extract json if possible
      const extractedJson = extractFirstJsonObject(content);
      if (extractedJson) {
        try {
          const extracted = JSON.parse(extractedJson);
          console.log('Extracted JSON from response');
          return extracted;
        } catch (extractError) {
          console.error('Failed to parse extracted JSON:', extractError);
        }
      }
      
      // detailed error
      return {
        error: 'Failed to parse response from OpenRouter',
        status: 502,
        raw: content.substring(0, 500),
        details: String(jsonError)
      };
    }
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    return {
      error: `OpenRouter API call failed: ${error instanceof Error ? error.message : String(error)}`,
      status: 502,
      details: error instanceof Error ? error.stack : undefined
    };
  }
}