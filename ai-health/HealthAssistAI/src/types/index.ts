/**
 * Domain models for HealthAssist AI
 * Strictly typed according to the architecture in README.md
 */

/**
 * User profile information
 */
export interface User {
  id: string;
  email: string;
  profile: {
    age: number;
    gender: string;
    medicalHistory?: string[];
  };
}

/**
 * Symptom reported by the user
 */
export interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-10
  duration?: string;
  description?: string;
}

/**
 * Medical condition returned by analysis
 */
export interface Condition {
  id: string;
  name: string;
  description: string;
  likelihood: number; // 0-1, probability/confidence
  recommendedActions?: string[];
  icd10Code?: string; // Standard medical code
}

/**
 * Result of LLM/medical analysis
 */
export interface AnalysisResult {
  possibleConditions: Condition[];
  recommendations: string[];
  urgencyLevel: 'routine' | 'soon' | 'urgent';
  disclaimer: string;
}

/**
 * A single symptom check event
 */
export interface SymptomCheck {
  id: string;
  userId: string;
  timestamp: Date;
  symptoms: Symptom[];
  analysis: AnalysisResult;
  metadata: {
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    isFallback?: boolean;
  };
}
