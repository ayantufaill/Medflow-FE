import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportingService } from '../../services/reporting.service';

export const fetchPatientInsuranceCoverageReport = createAsyncThunk(
  'patientReport/fetchInsuranceCoverage',
  async (_, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('insurance-coverage');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

const initialState = {
  insuranceCoverage: [],
  loading: false,
  error: null,
};

const patientReportSlice = createSlice({
  name: 'patientReport',
  initialState,
  reducers: {
    clearReportData: (state) => {
      state.insuranceCoverage = [];
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientInsuranceCoverageReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientInsuranceCoverageReport.fulfilled, (state, action) => {
        state.loading = false;
        state.insuranceCoverage = action.payload || [];
      })
      .addCase(fetchPatientInsuranceCoverageReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load report';
      });
  }
});

export const { clearReportData } = patientReportSlice.actions;

export const selectInsuranceCoverageData = (state) => state.patientReport.insuranceCoverage;
export const selectInsuranceCoverageLoading = (state) => state.patientReport.loading;
export const selectInsuranceCoverageError = (state) => state.patientReport.error;

export default patientReportSlice.reducer;
