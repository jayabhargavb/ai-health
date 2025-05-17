# HealthAssistAI: System Architecture Overview

**Author:** Jay Bhargav Bonigala  
**Version:** 1.0.0  
**Last Updated:** 2023-11-20

## 1. Introduction

This document provides a comprehensive high-level architecture overview of the HealthAssistAI system. It outlines the major components, their interactions, data flows, and the underlying technology choices. This architecture is designed to support the functional and non-functional requirements specified in the requirements documentation.

## 2. Architectural Goals and Principles

### 2.1 Architecture Goals

- **User-Centric Design**: Prioritize user experience and accessibility
- **Modularity**: Create loosely coupled components for maintainability and testability
- **Performance**: Optimize for mobile performance and responsiveness
- **Security**: Protect sensitive user health data
- **Scalability**: Support future feature expansion
- **Reliability**: Ensure system remains functional even with partial connectivity

### 2.2 Architecture Principles

- **Clean Architecture**: Separate concerns into distinct layers
- **Dependency Inversion**: Higher-level modules don't depend on lower-level modules
- **Single Responsibility**: Each component has one reason to change
- **Defensive Programming**: Validate inputs, handle errors gracefully
- **Mobile First**: Optimize for mobile devices and connections
- **Privacy by Design**: Minimize data collection, secure what is collected

## 3. System Overview

HealthAssistAI is a mobile application that provides symptom analysis and health recommendations using large language models. The system consists of a React Native mobile application frontend and a Node.js backend ML pipeline that integrates with external language model APIs.

### 3.1 High-Level System Architecture Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                       Mobile Application                       │
│                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐    │
│  │             │    │             │    │                 │    │
│  │  UI Layer   │───►│ State Layer │───►│  Service Layer  │    │
│  │             │    │             │    │                 │    │
│  └─────────────┘    └─────────────┘    └────────┬────────┘    │
│                                                  │             │
└──────────────────────────────────────────────────┼─────────────┘
                                                   │
                                                   ▼
                  ┌───────────────────────────────────────────────┐
                  │                                               │
                  │               Network Layer                   │
                  │                                               │
                  └───────────────────┬───────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                     Backend ML Pipeline                             │
│                                                                     │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐    │
│  │                │    │                │    │                │    │
│  │  API Gateway   │───►│ LLM Processing │───►│ Evaluation     │    │
│  │                │    │                │    │                │    │
│  └────────────────┘    └────────────────┘    └────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                  ┌───────────────────────────────────────────┐
                  │                                           │
                  │      External Language Model APIs         │
                  │      (OpenRouter, OpenAI, etc.)           │
                  │                                           │
                  └───────────────────────────────────────────┘
```

### 3.2 Component Overview

1. **Mobile Application**:
   - React Native frontend with Expo framework
   - Redux state management
   - SQLite local database
   - Secure Storage for sensitive data

2. **Backend ML Pipeline**:
   - Node.js Express server
   - LLM integration services
   - Evaluation and quality control

3. **External Services**:
   - Language Model APIs (via OpenRouter)
   - DeepEval integration for response quality

## 4. Component Details

### 4.1 Mobile Application

#### 4.1.1 UI Layer

The UI layer follows a component-based architecture using React Native. Key aspects include:

- **Screen Components**: Main containers for each application screen
- **UI Components**: Reusable UI elements (cards, buttons, inputs)
- **Navigation**: React Navigation for screen transitions and flow
- **Styling**: Themed components with consistent styling

#### 4.1.2 State Management

Redux is used for global state management with the following stores:

- **Auth Store**: Authentication state and user profile
- **Symptoms Store**: Current symptom analysis state
- **History Store**: Past symptom checks and results
- **UI Store**: UI state like loading indicators, modals

#### 4.1.3 Service Layer

Services mediate between the UI/state and external data sources:

- **API Services**: Communication with backend endpoints
- **Storage Services**: Local database and secure storage
- **ML Services**: Integration with ML pipeline

#### 4.1.4 Local Storage

Two local storage mechanisms are employed:

- **SQLite Database**: For structured data like symptom history
- **Secure Storage**: For sensitive data like authentication tokens

### 4.2 Backend ML Pipeline

#### 4.2.1 API Gateway

The Express.js server that handles:

- **Request Validation**: Input validation and sanitization
- **Route Management**: Endpoint handling and organization
- **Authentication**: Token validation and security

#### 4.2.2 LLM Processing

Core ML integration components:

- **Prompt Construction**: Converts user symptoms into medical prompts
- **LLM Integration**: Connects to language model providers
- **Response Processing**: Parses and validates LLM outputs

#### 4.2.3 Evaluation Service

Quality control and monitoring:

- **Response Evaluation**: DeepEval metrics for quality assessment
- **Fallback Mechanisms**: Alternative processing paths
- **Logging & Monitoring**: System health tracking

## 5. Data Architecture

### 5.1 Data Models

#### 5.1.1 User Model

```typescript
interface User {
  id: string;
  email: string;
  profile?: {
    age?: number;
    gender?: string;
    medicalHistory?: string[];
  };
  createdAt: Date;
}
```

#### 5.1.2 Symptom Model

```typescript
interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-10
  duration?: string;
  description?: string;
}
```

#### 5.1.3 SymptomCheck Model

```typescript
interface SymptomCheck {
  id: string;
  userId: string;
  timestamp: Date;
  symptoms: Symptom[];
  analysis: AnalysisResult;
  metadata: {
    severity: 'low' | 'medium' | 'high';
    confidence: number;
  };
}
```

#### 5.1.4 AnalysisResult Model

```typescript
interface AnalysisResult {
  possibleConditions: Condition[];
  recommendations: string[];
  urgencyLevel: 'routine' | 'soon' | 'urgent';
  disclaimer: string;
}

interface Condition {
  name: string;
  probability: number;
  description?: string;
}
```

### 5.2 Data Storage

#### 5.2.1 Local Database (SQLite)

Used for:
- User data caching
- Symptom check history
- Application settings

Tables:
- users
- profiles
- symptom_checks

#### 5.2.2 Secure Storage

Used for:
- Authentication tokens
- Encryption keys
- Sensitive user preferences

#### 5.2.3 Backend Storage

Minimal server-side storage:
- Logging and monitoring data
- Anonymous usage statistics (opt-in)
- No persistent storage of personal health data

### 5.3 Data Flow

#### 5.3.1 Symptom Analysis Flow

1. User inputs symptoms through UI
2. App validates and formats input data
3. API service sends request to backend
4. Backend constructs prompt for LLM
5. LLM processes and returns medical analysis
6. Backend validates and enhances response
7. Response returned to mobile app
8. Results displayed and stored locally

#### 5.3.2 Authentication Flow

1. User enters credentials
2. App validates input format
3. Credentials sent to authentication service
4. Service validates and issues tokens
5. Tokens stored in secure storage
6. Authenticated session begins

## 6. Technology Stack

### 6.1 Frontend Technologies

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Storage**: Expo SQLite, Expo SecureStore
- **UI Components**: Custom themed components
- **Testing**: Jest, Detox

### 6.2 Backend Technologies

- **Framework**: Node.js with Express
- **Language**: TypeScript
- **API Documentation**: OpenAPI/Swagger
- **Validation**: Zod
- **LLM Integration**: OpenRouter API
- **Evaluation**: DeepEval metrics

### 6.3 Development Tools

- **Code Quality**: ESLint, Prettier
- **Build Tools**: Expo Application Services
- **CI/CD**: GitHub Actions
- **Package Management**: Yarn
- **Versioning**: Semantic Versioning

## 7. Security Architecture

### 7.1 Authentication & Authorization

- **Token-based Authentication**: JWT for API access
- **Token Storage**: Secure storage on device
- **Token Lifecycle**: Expiration, refresh mechanisms
- **Authorization**: Role-based access (user/admin)

### 7.2 Data Protection

- **Encryption in Transit**: HTTPS for all network traffic
- **Encryption at Rest**: SQLite encryption for local data
- **Input Validation**: Server-side validation of all inputs
- **Output Sanitization**: Prevent injection attacks

### 7.3 Privacy Considerations

- **Data Minimization**: Collect only what's needed
- **User Consent**: Clear permissions and opt-in
- **Local Processing**: Prioritize on-device processing when possible
- **Anonymization**: Remove identifying data from analytics

## 8. Reliability Architecture

### 8.1 Error Handling

- **Network Error Handling**: Graceful offline operation
- **Input Validation**: Prevent invalid data entry
- **Fallback Mechanisms**: Alternative processing paths
- **Error Logging**: Capture issues for resolution

### 8.2 Offline Capability

- **Local Data Access**: History available offline
- **Operation Queueing**: Defer network operations
- **Synchronization**: Update when connection restored

### 8.3 Backup & Recovery

- **Local Backup**: Export/import user data
- **State Recovery**: Preserve app state across sessions
- **Crash Recovery**: Automatic state restoration

## 9. Performance Architecture

### 9.1 Mobile Optimization

- **Minimize Renders**: React optimization techniques
- **Lazy Loading**: Components and assets loaded on demand
- **Memory Management**: Optimize image and data handling
- **Battery Efficiency**: Minimize background processing

### 9.2 Network Optimization

- **Request Batching**: Combine API calls when possible
- **Caching**: Cache responses for frequent queries
- **Compression**: Minimize data transfer sizes
- **Retry Strategy**: Intelligent handling of network failures

### 9.3 Backend Optimization

- **Response Time**: Target <200ms for backend processing
- **Load Balancing**: Distribute requests evenly
- **Caching**: Cache common LLM queries
- **Timeout Management**: Graceful handling of LLM timeouts

## 10. Integration Points

### 10.1 External Services

- **Language Model APIs**: OpenRouter integration for LLM access
- **DeepEval**: Quality metrics for LLM responses
- **Content Providers**: Medical information sources

### 10.2 Third-Party Libraries

- **UI Components**: Select third-party UI libraries
- **Analytics**: Anonymous usage tracking (optional)
- **Crash Reporting**: Error monitoring
- **Accessibility**: Screen reader support

## 11. Deployment Architecture

### 11.1 Mobile Deployment

- **App Stores**: iOS App Store, Google Play Store
- **Over-the-Air Updates**: Expo updates for minor releases
- **Release Channels**: Development, staging, production

### 11.2 Backend Deployment

- **Container-Based**: Docker containers
- **Cloud Hosting**: AWS/Azure/GCP deployment
- **Scaling**: Horizontal scaling for load handling
- **Regions**: Multi-region deployment for proximity

## 12. Development & Testing Architecture

### 12.1 Development Environment

- **Local Development**: Expo development server
- **Mock Services**: Simulated backend for development
- **Hot Reloading**: Rapid UI iteration

### 12.2 Testing Strategy

- **Unit Testing**: Jest for business logic
- **Component Testing**: React Testing Library
- **Integration Testing**: API and service interactions
- **E2E Testing**: Detox for full app flows
- **LLM Testing**: DeepEval for response quality

### 12.3 CI/CD Pipeline

- **Automated Building**: Build artifacts for each platform
- **Automated Testing**: Run tests on each commit
- **Deployment Automation**: Streamlined release process
- **Environment Promotion**: Controlled progression to production

## 13. Appendices

### 13.1 Architecture Decision Records

- **ADR-001**: React Native over native development
- **ADR-002**: Redux Toolkit for state management
- **ADR-003**: SQLite for local storage
- **ADR-004**: OpenRouter for LLM integration
- **ADR-005**: Express.js for backend services

### 13.2 References

- React Native documentation
- Redux best practices
- SQLite optimization guides
- LLM integration patterns
- Healthcare application security standards 