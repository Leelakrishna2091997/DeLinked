import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateAPI } from '@/services/api';

interface CandidateProfile {
  _id: string;
  userId: string;
  name?: string;
  skills?: string[];
  experience?: number;
  email?: string;
  profileCompleted: boolean;
}

interface CandidateState {
  profile: CandidateProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  profile: null,
  loading: false,
  error: null,
};

// Get candidate profile
export const getCandidateProfile = createAsyncThunk(
  'candidate/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await candidateAPI.getProfile();
      return response.candidate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get candidate profile');
    }
  }
);

// Update candidate profile
export const updateCandidateProfile = createAsyncThunk(
  'candidate/updateProfile',
  async (profileData: Partial<CandidateProfile>, { rejectWithValue }) => {
    try {
      const response = await candidateAPI.updateProfile(profileData);
      return response.candidate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update candidate profile');
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = candidateSlice.actions;

export default candidateSlice.reducer;