import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportingService } from '../../services/reporting.service';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchLoginReport = createAsyncThunk(
  'othersReport/fetchLoginReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getOthersReport('login', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch login report');
    }
  }
);

export const fetchAuditReport = createAsyncThunk(
  'othersReport/fetchAuditReport',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportingService.getOthersReport('audit', params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch audit report');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  loginData: [],
  auditData: [],
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const othersReportSlice = createSlice({
  name: 'othersReport',
  initialState,
  reducers: {
    clearOthersReportData: (state) => {
      state.loginData = [];
      state.auditData = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Report
      .addCase(fetchLoginReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoginReport.fulfilled, (state, action) => {
        state.loading = false;
        state.loginData = action.payload || [];
      })
      .addCase(fetchLoginReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Audit Report
      .addCase(fetchAuditReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditReport.fulfilled, (state, action) => {
        state.loading = false;
        state.auditData = action.payload || [];
      })
      .addCase(fetchAuditReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOthersReportData } = othersReportSlice.actions;
export default othersReportSlice.reducer;
