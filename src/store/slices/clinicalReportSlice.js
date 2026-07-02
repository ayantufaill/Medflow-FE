import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportingService } from '../../services/reporting.service';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchRecareReport = createAsyncThunk(
  'clinicalReport/fetchRecare',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getClinicalReport('recare', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch recare report');
    }
  }
);

export const fetchUnsignedProgressNotesReport = createAsyncThunk(
  'clinicalReport/fetchUnsignedProgressNotes',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getClinicalReport('unsigned-progress-notes', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch unsigned progress notes report');
    }
  }
);

export const fetchRxReport = createAsyncThunk(
  'clinicalReport/fetchRx',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getClinicalReport('rx', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch Rx report');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  recareData: [],
  unsignedProgressNotesData: [],
  rxData: [],
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const clinicalReportSlice = createSlice({
  name: 'clinicalReport',
  initialState,
  reducers: {
    clearClinicalReportData: (state) => {
      state.recareData = [];
      state.unsignedProgressNotesData = [];
      state.rxData = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Recare
      .addCase(fetchRecareReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecareReport.fulfilled, (state, action) => {
        state.loading = false;
        state.recareData = action.payload || [];
      })
      .addCase(fetchRecareReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load recare report';
      })

      // Unsigned Progress Notes
      .addCase(fetchUnsignedProgressNotesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnsignedProgressNotesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.unsignedProgressNotesData = action.payload || [];
      })
      .addCase(fetchUnsignedProgressNotesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load unsigned progress notes report';
      })

      // Rx
      .addCase(fetchRxReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRxReport.fulfilled, (state, action) => {
        state.loading = false;
        state.rxData = action.payload || [];
      })
      .addCase(fetchRxReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load Rx report';
      });
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { clearClinicalReportData } = clinicalReportSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectRecareData = (state) => state.clinicalReport?.recareData;
export const selectUnsignedProgressNotesData = (state) => state.clinicalReport?.unsignedProgressNotesData;
export const selectRxData = (state) => state.clinicalReport?.rxData;
export const selectClinicalReportLoading = (state) => state.clinicalReport?.loading;
export const selectClinicalReportError = (state) => state.clinicalReport?.error;

export default clinicalReportSlice.reducer;
