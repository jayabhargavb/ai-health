# API Documentation

<!-- describes the main API endpoints for HealthAssist AI -->

## Auth
- `POST /api/auth/login` — user login
- `POST /api/auth/register` — user registration

## Symptoms
- `POST /api/symptoms/analyze` — analyze symptoms and return possible conditions
- `GET /api/symptoms/history` — get user's symptom check history
- `GET /api/symptoms/:id` — get details for a specific symptom check

## Example Request/Response
```json
// POST /api/symptoms/analyze
{
  "symptoms": [
    { "id": "s1", "name": "Cough", "severity": 5 }
  ]
}
```

```json
// Response
{
  "result": {
    "possibleConditions": [ { "id": "c1", "name": "Flu", "description": "...", "likelihood": 0.8 } ],
    "recommendations": ["Rest"],
    "urgencyLevel": "routine",
    "disclaimer": "This is not medical advice."
  },
  "confidence": 0.95,
  "processingTime": 0.2
}
```
