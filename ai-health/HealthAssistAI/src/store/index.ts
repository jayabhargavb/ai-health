import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { symptomsSlice } from './slices/symptomsSlice';
import { historySlice } from './slices/historySlice';
import { uiSlice } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    symptoms: symptomsSlice.reducer,
    history: historySlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For non-serializable values like Dates
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
