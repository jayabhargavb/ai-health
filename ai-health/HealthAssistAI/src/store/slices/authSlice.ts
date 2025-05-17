import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthRequest, AuthResponse, RefreshTokenRequest, RefreshTokenResponse } from '../../types/api.types';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Async thunks (to be implemented with real API calls)
export const login = createAsyncThunk<AuthResponse, AuthRequest>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      // Mock successful authentication for demo
      return {
        user: {
          id: '1',
          email: credentials.email,
          profile: {
            age: 30,
            gender: 'prefer not to say',
            medicalHistory: ['None']
          }
        },
        token: 'mock-auth-token-12345',
        refreshToken: 'mock-refresh-token-12345',
      };
    } catch (error) {
      return thunkAPI.rejectWithValue('Authentication failed');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, AuthRequest>(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      // Mock successful registration for demo
      return {
        user: {
          id: '1',
          email: credentials.email,
          profile: {
            age: 25,
            gender: 'prefer not to say',
            medicalHistory: []
          }
        },
        token: 'mock-auth-token-12345',
        refreshToken: 'mock-refresh-token-12345',
      };
    } catch (error) {
      return thunkAPI.rejectWithValue('Registration failed');
    }
  }
);

export const refresh = createAsyncThunk<RefreshTokenResponse, RefreshTokenRequest>(
  'auth/refresh',
  async (payload, thunkAPI) => {
    try {
      // Mock successful token refresh
      return {
        token: 'new-mock-auth-token-12345',
        refreshToken: 'new-mock-refresh-token-12345',
      };
    } catch (error) {
      return thunkAPI.rejectWithValue('Token refresh failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
    setAuth(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.error = action.error.message || 'Token refresh failed';
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
