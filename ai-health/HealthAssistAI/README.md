# HealthAssist Setup Guide

This guide will help you set up and run both the frontend and backend components of HealthAssist.

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Expo CLI (`npm install -g expo-cli`)
- An [OpenRouter](https://openrouter.ai/) account and API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/health-assist.git
   cd health-assist
   ```

2. Install frontend dependencies:
   ```
   cd HealthAssist
   npm install
   ```

3. Install backend dependencies:
   ```
   cd backend/ml-pipeline
   npm install
   ```

## Configuration

### Backend Configuration

1. Create a `.env` file in the `backend/ml-pipeline` directory:
   ```
   # Server configuration
   PORT=5001

   # OpenRouter API configuration 
   OPENROUTER_API_KEY=your_openrouter_api_key_here

   # CORS settings
   CORS_ORIGIN=http://localhost:19006
   ```

2. Replace `your_openrouter_api_key_here` with your actual OpenRouter API key

### Frontend Configuration

No additional configuration is needed for the frontend as it's configured to connect to the local backend by default.

## Running the Application

### Start Both Frontend and Backend

For convenience, you can start both the frontend and backend with a single command:

```
npm run start:all
```

### Start Separately

To start the backend and frontend separately:

1. Start the backend:
   ```
   cd backend/ml-pipeline
   npm start
   ```

2. In a separate terminal, start the frontend:
   ```
   npm start
   ```

## Testing

To make sure everything is working:

1. Launch the app on your preferred device or emulator
2. Navigate to the Symptoms screen
3. Add a symptom using the input form
4. Tap "Analyze Symptoms"
5. You should see the analysis screen with the loading animation
6. After a short time, results should appear from the analysis

## Troubleshooting

- If the analysis fails, check the console logs for error messages
- Verify that your OpenRouter API key is valid and properly set in the `.env` file
- Make sure both the frontend and backend are running
- Check that your device/emulator can connect to the backend server

## Backend Architecture

The backend uses:
- Express.js for the server
- OpenRouter API to access advanced language models
- Zod for request validation
- Custom prompt templates for medical analysis 