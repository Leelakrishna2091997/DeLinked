import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/services/api';
import { connectWallet, signMessage } from '@/services/web3';

interface User {
  id: string;
  address: string;
  userType: 'organizer' | 'candidate';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  address: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  address: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Connect wallet thunk
export const connectWalletThunk = createAsyncThunk(
  'auth/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      const address = await connectWallet();
      return address;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect wallet');
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ userType }: { userType?: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const address = auth.address;
      
      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      // Get nonce
      const nonceResponse = await authAPI.getNonce(address);
      const nonce = nonceResponse.nonce;
      
      // Sign message
      const message = `Login to DeLinked: ${nonce}`;
      const signature = await signMessage(message, address);
      
      // Authenticate
      const authResponse = await authAPI.authenticate(address, signature, nonce, userType);
      
      // Save token to localStorage
      localStorage.setItem('token', authResponse.token);
      
      return {
        user: authResponse.user,
        token: authResponse.token,
        isNewUser: authResponse.isNewUser,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Get current user thunk
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get current user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect wallet
      .addCase(connectWalletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWalletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(connectWalletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;