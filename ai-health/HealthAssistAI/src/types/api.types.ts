import { Symptom, AnalysisResult, User } from './index';

/**
 * Request to analyze symptoms
 */
export interface AnalyzeRequest {
  symptoms: Symptom[];
  context?: {
    age?: number;
    gender?: string;
    existingConditions?: string[];
  };
}

/**
 * Response from symptom analysis
 */
export interface AnalyzeResponse {
  result: AnalysisResult;
  confidence: number;
  processingTime: number;
  isErrorFallback?: boolean;
}

/**
 * API error response structure
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
  fallbackResult?: any;
}

/**
 * Authentication request (login/register)
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Authentication response (login/register)
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

/**
 * LLM Evaluation request
 */
export interface EvaluationRequest {
  prompt: string;
  response: string;
  reference?: string;
}

/**
 * LLM Evaluation response
 */
export interface EvaluationResponse {
  metrics: {
    relevance: number;
    faithfulness: number;
    toxicity?: number;
    bias?: number;
    isValid: boolean;
  };
  meta: {
    timestamp: string;
    evaluation_service: string;
    version: string;
  };
}
