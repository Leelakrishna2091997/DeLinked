import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { organizerAPI } from '@/services/api';

interface OrganizerProfile {
  _id: string;
  userId: string;
  name?: string;
  organizationName?: string;
  email?: string;
  profileCompleted: boolean;
}

interface OrganizerState {
  profile: OrganizerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrganizerState = {
  profile: null,
  loading: false,
  error: null,
};

// Get organizer profile
export const getOrganizerProfile = createAsyncThunk(
  'organizer/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await organizerAPI.getProfile();
      return response.organizer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get organizer profile');
    }
  }
);

// Update organizer profile
export const updateOrganizerProfile = createAsyncThunk(
  'organizer/updateProfile',
  async (profileData: Partial<OrganizerProfile>, { rejectWithValue }) => {
    try {
      const response = await organizerAPI.updateProfile(profileData);
      return response.organizer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update organizer profile');
    }
  }
);

const organizerSlice = createSlice({
  name: 'organizer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getOrganizerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getOrganizerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateOrganizerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganizerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateOrganizerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = organizerSlice.actions;

export default organizerSlice.reducer;