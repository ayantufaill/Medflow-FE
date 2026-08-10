import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportingService } from '../../services/reporting.service';

export const fetchPatientInsuranceCoverageReport = createAsyncThunk(
  'patientReport/fetchPatientInsuranceCoverageReport',
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
  'patientReport/fetchReferralByPatientReport',
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
  'patientReport/fetchPatientFlagsReport',
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
  'patientReport/fetchCancelledAppointmentsReport',
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
  'patientReport/fetchPatientsReferralReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('referral', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientMembershipPlanReport = createAsyncThunk(
  'patientReport/fetchPatientMembershipPlanReport',
  async (_, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('membership-plan');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchOnlineSchedulingReferralReport = createAsyncThunk(
  'patientReport/fetchOnlineSchedulingReferralReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('online-scheduling-referral', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchNoShowAppointmentsReport = createAsyncThunk(
  'patientReport/fetchNoShowAppointmentsReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('no-show-appointments', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchAppointmentsReport = createAsyncThunk(
  'patientReport/fetchAppointmentsReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('appointments', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchDuplicatePatientsReport = createAsyncThunk(
  'patientReport/fetchDuplicatePatientsReport',
  async (_, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('duplicate-patients');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientContactPreferencesReport = createAsyncThunk(
  'patientReport/fetchPatientContactPreferencesReport',
  async (_, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('contact-preferences');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientLastAppointmentReport = createAsyncThunk(
  'patientReport/fetchPatientLastAppointmentReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('last-appointment', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientNextAppointmentReport = createAsyncThunk(
  'patientReport/fetchPatientNextAppointmentReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('next-appointment', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchReferralDocumentReport = createAsyncThunk(
  'patientReport/fetchReferralDocumentReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('referral-document', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchLabCaseReport = createAsyncThunk(
  'patientReport/fetchLabCaseReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('lab-case', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

export const fetchPatientDiscountEditedFeeReport = createAsyncThunk(
  'patientReport/fetchPatientDiscountEditedFeeReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getPatientReport('discount-edited-fee', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch report');
    }
  }
);

const initialState = {
  insuranceCoverage: [],
  insuranceCoverageLoading: false,
  referralByPatient: [],
  referralByPatientLoading: false,
  patientFlagsReportData: [],
  patientFlagsReportDataLoading: false,
  cancelledAppointmentsData: [],
  cancelledAppointmentsDataLoading: false,
  patientsReferralData: [],
  patientsReferralDataLoading: false,
  membershipPlanData: [],
  membershipPlanDataLoading: false,
  onlineSchedulingReferralData: [],
  onlineSchedulingReferralDataLoading: false,
  noShowAppointmentsData: [],
  noShowAppointmentsDataLoading: false,
  appointmentsData: [],
  appointmentsDataLoading: false,
  duplicatePatientsData: [],
  duplicatePatientsDataLoading: false,
  contactPreferencesData: [],
  contactPreferencesDataLoading: false,
  lastAppointmentData: [],
  lastAppointmentDataLoading: false,
  nextAppointmentData: [],
  nextAppointmentDataLoading: false,
  referralDocumentData: [],
  referralDocumentDataLoading: false,
  labCaseData: [],
  labCaseDataLoading: false,
  discountEditedFeeData: [],
  discountEditedFeeDataLoading: false,
  error: null,
};

const patientReportSlice = createSlice({
  name: 'patientReport',
  initialState,
  reducers: {
    clearReportData: (state) => {
      state.insuranceCoverage = [];
      state.insuranceCoverageLoading = false;
      state.referralByPatient = [];
      state.referralByPatientLoading = false;
      state.patientFlagsReportData = [];
      state.patientFlagsReportDataLoading = false;
      state.cancelledAppointmentsData = [];
      state.cancelledAppointmentsDataLoading = false;
      state.patientsReferralData = [];
      state.patientsReferralDataLoading = false;
      state.membershipPlanData = [];
      state.membershipPlanDataLoading = false;
      state.onlineSchedulingReferralData = [];
      state.onlineSchedulingReferralDataLoading = false;
      state.noShowAppointmentsData = [];
      state.noShowAppointmentsDataLoading = false;
      state.appointmentsData = [];
      state.appointmentsDataLoading = false;
      state.duplicatePatientsData = [];
      state.duplicatePatientsDataLoading = false;
      state.contactPreferencesData = [];
      state.contactPreferencesDataLoading = false;
      state.lastAppointmentData = [];
      state.lastAppointmentDataLoading = false;
      state.nextAppointmentData = [];
      state.nextAppointmentDataLoading = false;
      state.referralDocumentData = [];
      state.referralDocumentDataLoading = false;
      state.labCaseData = [];
      state.labCaseDataLoading = false;
      state.discountEditedFeeData = [];
      state.discountEditedFeeDataLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientInsuranceCoverageReport.pending, (state) => {
        state.insuranceCoverageLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientInsuranceCoverageReport.fulfilled, (state, action) => {
        state.insuranceCoverageLoading = false;
        state.insuranceCoverage = action.payload || [];
      })
      .addCase(fetchPatientInsuranceCoverageReport.rejected, (state, action) => {
        state.insuranceCoverageLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchReferralByPatientReport.pending, (state) => {
        state.referralByPatientLoading = true;
        state.error = null;
      })
      .addCase(fetchReferralByPatientReport.fulfilled, (state, action) => {
        state.referralByPatientLoading = false;
        state.referralByPatient = action.payload || [];
      })
      .addCase(fetchReferralByPatientReport.rejected, (state, action) => {
        state.referralByPatientLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientFlagsReport.pending, (state) => {
        state.patientFlagsReportDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientFlagsReport.fulfilled, (state, action) => {
        state.patientFlagsReportDataLoading = false;
        state.patientFlagsReportData = action.payload || [];
      })
      .addCase(fetchPatientFlagsReport.rejected, (state, action) => {
        state.patientFlagsReportDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchCancelledAppointmentsReport.pending, (state) => {
        state.cancelledAppointmentsDataLoading = true;
        state.error = null;
      })
      .addCase(fetchCancelledAppointmentsReport.fulfilled, (state, action) => {
        state.cancelledAppointmentsDataLoading = false;
        state.cancelledAppointmentsData = action.payload || [];
      })
      .addCase(fetchCancelledAppointmentsReport.rejected, (state, action) => {
        state.cancelledAppointmentsDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientsReferralReport.pending, (state) => {
        state.patientsReferralDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientsReferralReport.fulfilled, (state, action) => {
        state.patientsReferralDataLoading = false;
        state.patientsReferralData = action.payload || [];
      })
      .addCase(fetchPatientsReferralReport.rejected, (state, action) => {
        state.patientsReferralDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientMembershipPlanReport.pending, (state) => {
        state.membershipPlanDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientMembershipPlanReport.fulfilled, (state, action) => {
        state.membershipPlanDataLoading = false;
        state.membershipPlanData = action.payload || [];
      })
      .addCase(fetchPatientMembershipPlanReport.rejected, (state, action) => {
        state.membershipPlanDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchOnlineSchedulingReferralReport.pending, (state) => {
        state.onlineSchedulingReferralDataLoading = true;
        state.error = null;
      })
      .addCase(fetchOnlineSchedulingReferralReport.fulfilled, (state, action) => {
        state.onlineSchedulingReferralDataLoading = false;
        state.onlineSchedulingReferralData = action.payload || [];
      })
      .addCase(fetchOnlineSchedulingReferralReport.rejected, (state, action) => {
        state.onlineSchedulingReferralDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchNoShowAppointmentsReport.pending, (state) => {
        state.noShowAppointmentsDataLoading = true;
        state.error = null;
      })
      .addCase(fetchNoShowAppointmentsReport.fulfilled, (state, action) => {
        state.noShowAppointmentsDataLoading = false;
        state.noShowAppointmentsData = action.payload || [];
      })
      .addCase(fetchNoShowAppointmentsReport.rejected, (state, action) => {
        state.noShowAppointmentsDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchAppointmentsReport.pending, (state) => {
        state.appointmentsDataLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsReport.fulfilled, (state, action) => {
        state.appointmentsDataLoading = false;
        state.appointmentsData = action.payload || [];
      })
      .addCase(fetchAppointmentsReport.rejected, (state, action) => {
        state.appointmentsDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchDuplicatePatientsReport.pending, (state) => {
        state.duplicatePatientsDataLoading = true;
        state.error = null;
      })
      .addCase(fetchDuplicatePatientsReport.fulfilled, (state, action) => {
        state.duplicatePatientsDataLoading = false;
        state.duplicatePatientsData = action.payload || [];
      })
      .addCase(fetchDuplicatePatientsReport.rejected, (state, action) => {
        state.duplicatePatientsDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientContactPreferencesReport.pending, (state) => {
        state.contactPreferencesDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientContactPreferencesReport.fulfilled, (state, action) => {
        state.contactPreferencesDataLoading = false;
        state.contactPreferencesData = action.payload || [];
      })
      .addCase(fetchPatientContactPreferencesReport.rejected, (state, action) => {
        state.contactPreferencesDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientLastAppointmentReport.pending, (state) => {
        state.lastAppointmentDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientLastAppointmentReport.fulfilled, (state, action) => {
        state.lastAppointmentDataLoading = false;
        state.lastAppointmentData = action.payload || [];
      })
      .addCase(fetchPatientLastAppointmentReport.rejected, (state, action) => {
        state.lastAppointmentDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientNextAppointmentReport.pending, (state) => {
        state.nextAppointmentDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientNextAppointmentReport.fulfilled, (state, action) => {
        state.nextAppointmentDataLoading = false;
        state.nextAppointmentData = action.payload || [];
      })
      .addCase(fetchPatientNextAppointmentReport.rejected, (state, action) => {
        state.nextAppointmentDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchReferralDocumentReport.pending, (state) => {
        state.referralDocumentDataLoading = true;
        state.error = null;
      })
      .addCase(fetchReferralDocumentReport.fulfilled, (state, action) => {
        state.referralDocumentDataLoading = false;
        state.referralDocumentData = action.payload || [];
      })
      .addCase(fetchReferralDocumentReport.rejected, (state, action) => {
        state.referralDocumentDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchLabCaseReport.pending, (state) => {
        state.labCaseDataLoading = true;
        state.error = null;
      })
      .addCase(fetchLabCaseReport.fulfilled, (state, action) => {
        state.labCaseDataLoading = false;
        state.labCaseData = action.payload || [];
      })
      .addCase(fetchLabCaseReport.rejected, (state, action) => {
        state.labCaseDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
      .addCase(fetchPatientDiscountEditedFeeReport.pending, (state) => {
        state.discountEditedFeeDataLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientDiscountEditedFeeReport.fulfilled, (state, action) => {
        state.discountEditedFeeDataLoading = false;
        state.discountEditedFeeData = action.payload || [];
      })
      .addCase(fetchPatientDiscountEditedFeeReport.rejected, (state, action) => {
        state.discountEditedFeeDataLoading = false;
        state.error = action.payload || 'Failed to load report';
      })
  },
});

export const { clearReportData } = patientReportSlice.actions;

export const selectInsuranceCoverage = (state) => state.patientReport?.insuranceCoverage;
export const selectInsuranceCoverageLoading = (state) => state.patientReport?.insuranceCoverageLoading;
export const selectReferralByPatient = (state) => state.patientReport?.referralByPatient;
export const selectReferralByPatientLoading = (state) => state.patientReport?.referralByPatientLoading;
export const selectPatientFlagsReportData = (state) => state.patientReport?.patientFlagsReportData;
export const selectPatientFlagsReportDataLoading = (state) => state.patientReport?.patientFlagsReportDataLoading;
export const selectCancelledAppointmentsData = (state) => state.patientReport?.cancelledAppointmentsData;
export const selectCancelledAppointmentsDataLoading = (state) => state.patientReport?.cancelledAppointmentsDataLoading;
export const selectPatientsReferralData = (state) => state.patientReport?.patientsReferralData;
export const selectPatientsReferralDataLoading = (state) => state.patientReport?.patientsReferralDataLoading;
export const selectMembershipPlanData = (state) => state.patientReport?.membershipPlanData;
export const selectMembershipPlanDataLoading = (state) => state.patientReport?.membershipPlanDataLoading;
export const selectOnlineSchedulingReferralData = (state) => state.patientReport?.onlineSchedulingReferralData;
export const selectOnlineSchedulingReferralDataLoading = (state) => state.patientReport?.onlineSchedulingReferralDataLoading;
export const selectNoShowAppointmentsData = (state) => state.patientReport?.noShowAppointmentsData;
export const selectNoShowAppointmentsDataLoading = (state) => state.patientReport?.noShowAppointmentsDataLoading;
export const selectAppointmentsData = (state) => state.patientReport?.appointmentsData;
export const selectAppointmentsDataLoading = (state) => state.patientReport?.appointmentsDataLoading;
export const selectDuplicatePatientsData = (state) => state.patientReport?.duplicatePatientsData;
export const selectDuplicatePatientsDataLoading = (state) => state.patientReport?.duplicatePatientsDataLoading;
export const selectContactPreferencesData = (state) => state.patientReport?.contactPreferencesData;
export const selectContactPreferencesDataLoading = (state) => state.patientReport?.contactPreferencesDataLoading;
export const selectLastAppointmentData = (state) => state.patientReport?.lastAppointmentData;
export const selectLastAppointmentDataLoading = (state) => state.patientReport?.lastAppointmentDataLoading;
export const selectNextAppointmentData = (state) => state.patientReport?.nextAppointmentData;
export const selectNextAppointmentDataLoading = (state) => state.patientReport?.nextAppointmentDataLoading;
export const selectReferralDocumentData = (state) => state.patientReport?.referralDocumentData;
export const selectReferralDocumentDataLoading = (state) => state.patientReport?.referralDocumentDataLoading;
export const selectLabCaseData = (state) => state.patientReport?.labCaseData;
export const selectLabCaseDataLoading = (state) => state.patientReport?.labCaseDataLoading;
export const selectDiscountEditedFeeData = (state) => state.patientReport?.discountEditedFeeData;
export const selectDiscountEditedFeeDataLoading = (state) => state.patientReport?.discountEditedFeeDataLoading;

export const selectPatientReportError = (state) => state.patientReport?.error;
// Keeping these for backward compatibility
export const selectInsuranceCoverageData = (state) => state.patientReport?.insuranceCoverage;
export const selectPatientReportLoading = (state) => state.patientReport?.insuranceCoverageLoading; // Default alias

export default patientReportSlice.reducer;
