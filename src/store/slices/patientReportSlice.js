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

export const fetchReferralByPatientReport = createAsyncThunk(
  'patientReport/fetchReferralByPatient',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('referral-by-patient', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientFlagsReport = createAsyncThunk(
  'patientReport/fetchPatientFlags',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('by-flag', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchCancelledAppointmentsReport = createAsyncThunk(
  'patientReport/fetchCancelledAppointments',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('cancelled-appointments', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientsReferralReport = createAsyncThunk(
  'patientReport/fetchPatientsReferral',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('referral', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

const initialState = {
  insuranceCoverage: [],
  referralByPatient: [],
  patientFlagsReportData: [],
  cancelledAppointmentsData: [],
  patientsReferralData: [],
  loading: false,
  error: null,
};

const patientReportSlice = createSlice({
  name: 'patientReport',
  initialState,
  reducers: {
    clearReportData: (state) => {
      state.insuranceCoverage = [];
      state.referralByPatient = [];
      state.patientFlagsReportData = [];
      state.cancelledAppointmentsData = [];
      state.patientsReferralData = [];
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
      })
      .addCase(fetchPatientFlagsReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientFlagsReport.fulfilled, (state, action) => {
        state.loading = false;
        state.patientFlagsReportData = action.payload || [];
      })
      .addCase(fetchPatientFlagsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchCancelledAppointmentsReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCancelledAppointmentsReport.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelledAppointmentsData = action.payload || [];
      })
      .addCase(fetchCancelledAppointmentsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchReferralByPatientReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralByPatientReport.fulfilled, (state, action) => {
        state.loading = false;
        state.referralByPatient = action.payload || [];
      })
      .addCase(fetchReferralByPatientReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientsReferralReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsReferralReport.fulfilled, (state, action) => {
        state.loading = false;
        state.patientsReferralData = action.payload || [];
      })
      .addCase(fetchPatientsReferralReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load report';
      });
  },
});

export const { clearReportData } = patientReportSlice.actions;

export const selectInsuranceCoverageData = (state) => state.patientReport?.insuranceCoverage;
export const selectInsuranceCoverageLoading = (state) => state.patientReport?.loading;
export const selectReferralByPatientData = (state) => state.patientReport?.referralByPatient;
export const selectPatientFlagsReportData = (state) => state.patientReport?.patientFlagsReportData;
export const selectCancelledAppointmentsData = (state) => state.patientReport?.cancelledAppointmentsData;
export const selectPatientsReferralData = (state) => state.patientReport?.patientsReferralData;
export const selectPatientReportLoading = (state) => state.patientReport?.loading;
export const selectPatientReportError = (state) => state.patientReport?.error;

export default patientReportSlice.reducer;
