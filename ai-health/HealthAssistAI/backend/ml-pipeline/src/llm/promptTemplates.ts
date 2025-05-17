export function buildSymptomPrompt(
  symptoms: { name: string; severity?: number; duration?: string }[],
  age?: number,
  gender?: string
) {
  let prompt = `You are a medical analysis system that ONLY outputs valid JSON. Based on symptoms, you identify possible conditions.

A patient presents with the following symptoms:
`;
  symptoms.forEach(s => {
    prompt += `- ${s.name}`;
    if (s.severity) prompt += ` (severity: ${s.severity}/10)`;
    if (s.duration) prompt += ` (duration: ${s.duration})`;
    prompt += '\n';
  });
  
  if (age) prompt += `Patient age: ${age}\n`;
  if (gender) prompt += `Patient gender: ${gender}\n`;
  
  prompt += `
You MUST respond with ONLY valid JSON in the exact format below, with no additional text, markdown formatting, or explanation:

{
  "possibleConditions": [
    { 
      "id": "condition-id",
      "name": "Condition Name",
      "description": "Brief description of the condition",
      "likelihood": 0.7,
      "recommendedActions": [
        "Specific action item 1",
        "Specific action item 2"
      ]
    },
    { 
      "id": "condition-id-2", 
      "name": "Second Condition", 
      "description": "Brief description", 
      "likelihood": 0.5,
      "recommendedActions": ["Action item"]
    }
  ],
  "recommendations": [
    "General recommendation 1",
    "General recommendation 2"
  ],
  "urgencyLevel": "routine",
  "disclaimer": "Medical disclaimer about seeking professional advice"
}

IMPORTANT NOTES:
1. The urgencyLevel MUST be one of: "routine", "soon", or "urgent"
2. Include 1-3 possible conditions based on the symptoms
3. DO NOT include ANY text outside of the JSON structure
4. Ensure the JSON is valid with no trailing commas or syntax errors
5. If symptoms are severe, use "urgent" for urgencyLevel

Any response that is not valid JSON will be rejected.
`;
  return prompt;
} 