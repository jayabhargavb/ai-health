import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  globalLoading: boolean;
  globalError: string | null;
  modal: {
    open: boolean;
    content?: React.ReactNode;
  };
}

const initialState: UIState = {
  globalLoading: false,
  globalError: null,
  modal: {
    open: false,
    content: undefined,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    setGlobalError(state, action: PayloadAction<string | null>) {
      state.globalError = action.payload;
    },
    openModal(state, action: PayloadAction<React.ReactNode | undefined>) {
      state.modal.open = true;
      state.modal.content = action.payload;
    },
    closeModal(state) {
      state.modal.open = false;
      state.modal.content = undefined;
    },
  },
});

export const { setGlobalLoading, setGlobalError, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
