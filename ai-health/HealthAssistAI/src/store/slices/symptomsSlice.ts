import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Symptom, AnalysisResult } from '../../types';
import { AnalyzeRequest, AnalyzeResponse } from '../../types/api.types';
import { analyzeSymptomsWithLLM } from '../../services/ml/llmService';

interface SymptomsState {
  selectedSymptoms: Symptom[];
  analysis: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  analysisCompleted: boolean; // Track if analysis has been completed for history
}

const initialState: SymptomsState = {
  selectedSymptoms: [],
  analysis: null,
  loading: false,
  error: null,
  analysisCompleted: false,
};

// Async thunk for symptom analysis using backend
export const analyzeSymptoms = createAsyncThunk<AnalyzeResponse, AnalyzeRequest, { rejectValue: any }>(
  'symptoms/analyzeSymptoms',
  async (payload, thunkAPI) => {
    try {
      // Call the LLM service
      const response = await analyzeSymptomsWithLLM(payload);
      return response;
    } catch (error: any) {
      console.error("Analysis error:", error);
      
      // If the error response includes a fallbackResult, we'll use it
      if (error.fallbackResult) {
        return thunkAPI.fulfillWithValue({
          result: error.fallbackResult.result,
          confidence: error.fallbackResult.confidence || 0,
          processingTime: error.fallbackResult.processingTime || 0,
          isErrorFallback: true
        });
      }

      const errorMessage = error.message || 'Analysis failed. Please try again.';
      return thunkAPI.rejectWithValue({ 
        message: errorMessage,
        fallbackResult: null
      });
    }
  }
);

export const symptomsSlice = createSlice({
  name: 'symptoms',
  initialState,
  reducers: {
    setSelectedSymptoms(state, action: PayloadAction<Symptom[]>) {
      state.selectedSymptoms = action.payload;
      // Reset analysis state when symptoms change
      state.analysis = null;
      state.error = null;
      state.analysisCompleted = false;
    },
    clearSymptoms(state) {
      state.selectedSymptoms = [];
      state.analysis = null;
      state.error = null;
      state.analysisCompleted = false;
    },
    clearAnalysisError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeSymptoms.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.analysisCompleted = false;
      })
      .addCase(analyzeSymptoms.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload.result;
        state.analysisCompleted = true;
        
        // If this was a fallback due to error, still show the error message
        if (action.payload.isErrorFallback) {
          state.error = 'We encountered an issue, but provided a basic analysis. For accuracy, please try again later.';
        } else {
          state.error = null;
        }
      })
      .addCase(analyzeSymptoms.rejected, (state, action) => {
        state.loading = false;
        
        // Check if we have a fallback result in the error payload
        const payloadData = action.payload as any;
        if (payloadData?.fallbackResult?.result) {
          state.analysis = payloadData.fallbackResult.result;
          state.analysisCompleted = true;
          state.error = 'We encountered an issue, but provided a basic analysis. For accuracy, please try again later.';
        } else {
          state.error = action.payload?.message || 'Analysis failed. Please check your connection and try again.';
          state.analysisCompleted = false;
        }
      });
  },
});

export const { setSelectedSymptoms, clearSymptoms, clearAnalysisError } = symptomsSlice.actions;
export default symptomsSlice.reducer;
