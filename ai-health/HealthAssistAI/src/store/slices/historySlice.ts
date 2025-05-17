import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SymptomCheck } from '../../types';

interface HistoryState {
  history: SymptomCheck[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  history: [],
  loading: false,
  error: null,
};

// Async thunk for fetching history with mock implementation
export const fetchHistory = createAsyncThunk<SymptomCheck[]>(
  'history/fetchHistory',
  async (_, thunkAPI) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return empty array for now, the history will be built up
      // as the user saves analysis results
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch history');
    }
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addSymptomCheck(state, action: PayloadAction<SymptomCheck>) {
      state.history.unshift(action.payload);
    },
    clearHistory(state) {
      state.history = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch history';
      });
  },
});

export const { addSymptomCheck, clearHistory } = historySlice.actions;
export default historySlice.reducer;
