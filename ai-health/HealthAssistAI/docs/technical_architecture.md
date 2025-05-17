# HealthAssistAI: Technical Architecture

**Author:** Jay Bhargav Bonigala  
**Version:** 1.0.0  
**Last Updated:** 2023-11-20

## 1. Introduction

This document provides an overview of the technical implementation of HealthAssistAI, a mobile application for symptom analysis and health recommendations using AI.

## 2. Technology Stack

### Frontend
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Storage**: SQLite, Expo SecureStore
- **Networking**: Axios

### Backend
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Validation**: Zod
- **LLM Integration**: OpenRouter API
- **Evaluation**: DeepEval metrics

## 3. Architecture Overview

HealthAssistAI follows a layered architecture:

1. **Presentation Layer**: React Native components and screens
2. **State Management Layer**: Redux store and actions
3. **Service Layer**: API, storage, and ML services
4. **Data Layer**: Local SQLite database and secure storage

The backend ML pipeline provides:
1. **API Gateway**: Express server for endpoints
2. **LLM Processing**: Integration with language models
3. **Evaluation**: Quality assessment of responses

## 4. Key Implementation Areas

### 4.1 Authentication System

JWT-based authentication with secure token storage:
- Token management in SecureStore
- Authorization headers via Axios interceptors
- Session handling and refresh mechanisms

### 4.2 Symptom Analysis Pipeline

Core functionality implementation:
- User inputs symptoms via structured forms
- Data is validated and sent to the backend
- Backend creates medical prompts for LLM
- Results are processed, validated, and returned
- Analysis is displayed and stored in history

### 4.3 Local Data Management

SQLite database implementation:
- Proper schema with tables for users, profiles, and symptom checks
- Transaction handling for data integrity
- Query optimization for performance
- Offline data access

### 4.4 ML Integration

Language model integration via OpenRouter:
- Medical prompt engineering
- Response parsing and validation
- Fallback mechanisms for reliability
- Quality evaluation with DeepEval

### 4.5 Error Handling & Reliability

Comprehensive error management:
- Network error handling with fallbacks
- Graceful degradation when offline
- Input validation at multiple levels
- User-friendly error messages

## 5. Code Structure

```
HealthAssistAI/
├── assets/                # Static assets
├── backend/               # Backend services
│   └── ml-pipeline/       # ML processing pipeline
├── src/                   # Frontend application
│   ├── components/        # UI components
│   ├── constants/         # App constants
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation structure
│   ├── screens/           # App screens
│   ├── services/          # API, storage, ML services
│   ├── store/             # Redux state management
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
└── App.tsx                # Application entry point
```

## 6. Key Technical Components

### 6.1 Frontend Components

#### Redux Store Setup
```typescript
// Store configuration with slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    symptoms: symptomsReducer,
    history: historyReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [/* Non-serializable actions */],
        ignoredPaths: [/* Non-serializable paths */],
      },
    }),
});
```

#### API Client
```typescript
// API client with auth interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
```

#### Database Service
```typescript
// SQLite database service
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await ensureDatabase();
    await createTables(database);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};
```

### 6.2 Backend Components

#### Express Server Setup
```typescript
// ML pipeline server
const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/evaluate', evaluateRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`ML pipeline running on port ${PORT}`);
});
```

#### LLM Integration
```typescript
// Language model integration
export async function analyzeSymptomsWithOpenRouter(
  payload: AnalyzeSymptomsPayload
): Promise<AnalyzeSymptomsResult> {
  const prompt = buildSymptomPrompt(
    payload.symptoms, 
    payload.context?.age, 
    payload.context?.gender
  );

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }]
      },
      { headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}` } }
    );

    return processLLMResponse(response);
  } catch (error) {
    return handleLLMError(error);
  }
}
```

## 7. Security Considerations

- **Authentication**: JWT tokens with proper expiration
- **Data Storage**: Secure storage for sensitive information
- **Input Validation**: Comprehensive validation against injection
- **Network Security**: HTTPS for all communications
- **Error Handling**: Sanitized error messages

## 8. Performance Optimizations

- **Component Memoization**: React.memo for pure components
- **Virtualized Lists**: For efficient rendering of long lists
- **Query Optimization**: Selective column fetching from database
- **Lazy Loading**: On-demand asset and component loading
- **Debounced Inputs**: For search and filtering operations

## 9. Testing Strategy

- **Unit Tests**: Jest for isolated function testing
- **Component Tests**: Testing UI components in isolation
- **Integration Tests**: Testing service interactions
- **End-to-End Tests**: Testing complete user flows
- **LLM Quality Tests**: Evaluating model response quality

## 10. Conclusion

The HealthAssistAI application demonstrates effective integration of modern mobile development with machine learning capabilities for healthcare. The architecture prioritizes reliability, security, and performance while maintaining a clean, maintainable codebase. 