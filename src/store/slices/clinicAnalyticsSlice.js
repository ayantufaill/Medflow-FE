import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clinicAnalyticsService } from '../../services/clinicAnalytics.service';

// ─── Thunks ──────────────────────────────────────────────────────────────────
// Branch list itself is owned by branchSlice.js (global, shared with UserProfile.jsx) —
// this slice only fetches the metrics for whichever branch is selected.

export const fetchClinicAnalytics = createAsyncThunk(
  'clinicAnalytics/fetchData',
  async ({ branchId = 'all', startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const data = await clinicAnalyticsService.getClinicAnalytics(branchId, { startDate, endDate });
      return { branchId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch clinic analytics');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  selectedBranchId: 'all',
  data: null,
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const clinicAnalyticsSlice = createSlice({
  name: 'clinicAnalytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinicAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBranchId = action.payload.branchId;
        state.data = action.payload.data;
      })
      .addCase(fetchClinicAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load clinic analytics';
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectClinicAnalyticsSelectedBranchId = (state) => state.clinicAnalytics?.selectedBranchId;
export const selectClinicAnalyticsData = (state) => state.clinicAnalytics?.data;
export const selectClinicAnalyticsLoading = (state) => state.clinicAnalytics?.loading;
export const selectClinicAnalyticsError = (state) => state.clinicAnalytics?.error;

export default clinicAnalyticsSlice.reducer;
