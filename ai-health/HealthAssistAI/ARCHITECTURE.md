# Architecture Overview

<!-- describes the high-level architecture of HealthAssist -->

## Frontend (React Native/Expo)
- Modular components (cards, forms, common)
- Redux Toolkit for state management
- React Navigation v6 for navigation
- Services layer for API, ML, storage
- Strict TypeScript typing throughout

## Backend (Express/TypeScript)
- REST API for auth, symptoms, analysis
- Secure middleware and validation
- Connects to ML pipeline for analysis

## ML Pipeline (Python)
- Handles symptom analysis and model integration
- Exposes endpoints for analysis

## Testing
- Unit, integration, E2E tests
- Jest, React Native Testing Library, Detox

## DevOps
- Husky, lint-staged, commitizen, CI/CD workflows
