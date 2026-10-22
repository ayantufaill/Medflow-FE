import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/api';

const emptyGoals = {
  providerProduction: { dentist: [], hygienist: [] }, hygieneGroups: [], treatmentGroups: [],
  collectionPercent: '', newPatientsTotal: '', newPatientsProvider: { dentist: [], hygienist: [] },
  visitsTotal: '', visitsHygienePercent: '', visitsTreatmentPercent: '', reappointmentPercent: '',
  acceptanceNewPt: '', acceptanceExistingPt: '',
};

export const fetchDashboardGoals = createAsyncThunk(
  'dashboardGoals/fetch',
  async (_, { signal, getState, rejectWithValue }) => {
    try {
      const { branch } = getState();
      const branchId = branch?.currentBranchId || 'All';
      const response = await apiClient.get(`/admin-finance/settings/dashboard_goals?branchId=${branchId}`, { signal });
      // Missing settings have no configured values.
      return { ...emptyGoals, ...(response.data?.data ?? {}) };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { dashboardGoals } = getState();
      if (dashboardGoals.loading) return false;
      return true;
    }
  }
);

export const updateDashboardGoalField = createAsyncThunk(
  'dashboardGoals/updateField',
  async ({ fieldPath, value }, { getState, rejectWithValue }) => {
    try {
      const { dashboardGoals, branch } = getState();
      
      // Deep clone the existing data to mutate
      const newData = JSON.parse(JSON.stringify(dashboardGoals.data));
      
      // Update the specific field using dot notation path
      const keys = fieldPath.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      const branchId = branch?.currentBranchId || 'All';
      // Save the entire updated object to the backend
      const response = await apiClient.put(`/admin-finance/settings/dashboard_goals?branchId=${branchId}`, newData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dashboardGoalsSlice = createSlice({
  name: 'dashboardGoals',
  initialState: {
    data: emptyGoals,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardGoals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchDashboardGoals.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateDashboardGoalField.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateDashboardGoalField.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export const selectDashboardGoals = (state) => state.dashboardGoals.data;
export const selectDashboardGoalsLoading = (state) => state.dashboardGoals.loading;

export default dashboardGoalsSlice.reducer;
