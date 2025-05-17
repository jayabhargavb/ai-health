import { z } from 'zod';

const SymptomSchema = z.object({
  name: z.string(),
  severity: z.number().optional(),
  duration: z.string().optional(),
});

const AnalyzeRequestSchema = z.object({
  symptoms: z.array(SymptomSchema),
  context: z.object({
    age: z.number().optional(),
    gender: z.string().optional(),
    existingConditions: z.array(z.string()).optional(),
  }).optional(),
});

export function validateAnalyzeRequest(data: any) {
  return AnalyzeRequestSchema.parse(data);
}

const EvaluationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  response: z.string().min(1, "Response is required"),
  reference: z.string().optional(),
});

export function validateEvaluationRequest(data: any) {
  return EvaluationRequestSchema.parse(data);
} 