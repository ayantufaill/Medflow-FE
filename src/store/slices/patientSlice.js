import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientService } from '../../services/patient.service';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async ({ page = 1, limit = 10, search = '', status = '', dobStart = '', dobEnd = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await patientService.getAllPatients(page, limit, search, status, dobStart, dobEnd);
      return { ...result, params: { page, limit, search, status, dobStart, dobEnd } };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch patients');
    }
  },
  {
    condition: (_, { getState }) => {
      const { patient } = getState();
      return !patient.listLoading;
    },
  }
);

export const fetchPatientById = createAsyncThunk(
  'patient/fetchPatientById',
  async (patientId, { rejectWithValue }) => {
    try {
      const patient = await patientService.getPatientById(patientId);
      return patient;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch patient');
    }
  }
);

export const fetchPatientInsurances = createAsyncThunk(
  'patient/fetchPatientInsurances',
  async ({ patientId, activeOnly = false }, { rejectWithValue }) => {
    try {
      const insurances = await patientService.getPatientInsurances(patientId, activeOnly);
      return { patientId, insurances };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch insurances');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const initialState = {
  // List state
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: { search: '', status: '', dobStart: '', dobEnd: '' },
  listLoading: false,
  listError: null,
  lastFetched: null, // timestamp of last fetch

  // Detail state (cached by ID)
  cache: {}, // { [patientId]: { data, timestamp } }

  // Current patient being viewed
  currentPatient: null,
  selectedPatientId: null,
  detailLoading: false,
  detailError: null,

  // Insurances cache
  insurancesCache: {}, // { [patientId]: { data, timestamp } }
};

// Cache disabled - always fetch fresh data from backend
const CACHE_DURATION = 0; // Disabled for development

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
      state.selectedPatientId = action.payload?._id || action.payload?.id || null;
      state.detailError = null;
    },
    setSelectedPatientId: (state, action) => {
      state.selectedPatientId = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
      state.selectedPatientId = null;
    },
    // Invalidate cache (e.g. after create/update/delete)
    invalidatePatients: (state) => {
      state.lastFetched = null;
    },
    invalidatePatientDetail: (state, action) => {
      delete state.cache[action.payload];
    },
    invalidatePatientInsurances: (state, action) => {
      delete state.insurancesCache[action.payload];
    },
    // Update a patient in the list after edit
    updatePatientInList: (state, action) => {
      const updated = action.payload;
      const idx = state.list.findIndex(p => p._id === updated._id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    // Remove from list after delete
    removePatientFromList: (state, action) => {
      state.list = state.list.filter(p => p._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.list = action.payload.patients || [];
        state.pagination = action.payload.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };
        state.listLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      // fetchPatientById
      .addCase(fetchPatientById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.currentPatient = action.payload;
        state.selectedPatientId = action.payload?._id || null;
        state.detailLoading = false;
        // Cache it
        state.cache[action.payload._id] = { data: action.payload, timestamp: Date.now() };
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // fetchPatientInsurances
      .addCase(fetchPatientInsurances.fulfilled, (state, action) => {
        const { patientId, insurances } = action.payload;
        state.insurancesCache[patientId] = { data: insurances, timestamp: Date.now() };
      });
  },
});

export const {
  setCurrentPatient,
  setSelectedPatientId,
  setFilters,
  clearFilters,
  clearCurrentPatient,
  invalidatePatients,
  invalidatePatientDetail,
  invalidatePatientInsurances,
  updatePatientInList,
  removePatientFromList,
} = patientSlice.actions;

// ─── Selectors ───────────────────────────────────────────────

export const selectPatientList = (state) => state.patient.list;
export const selectPatientPagination = (state) => state.patient.pagination;
export const selectPatientFilters = (state) => state.patient.filters;
export const selectPatientListLoading = (state) => state.patient.listLoading;
export const selectPatientListError = (state) => state.patient.listError;
export const selectPatientLastFetched = (state) => state.patient.lastFetched;
export const selectCurrentPatient = (state) => state.patient.currentPatient;
export const selectSelectedPatientId = (state) => state.patient.selectedPatientId;
export const selectPatientDetailLoading = (state) => state.patient.detailLoading;
export const selectPatientDetailError = (state) => state.patient.detailError;
export const selectPatientCache = (state) => state.patient.cache;
export const selectPatientInsurancesCache = (state) => state.patient.insurancesCache;

// Check if cache is valid
export const selectIsCacheValid = (state) => {
  const lastFetched = state.patient.lastFetched;
  if (!lastFetched) return false;
  return (Date.now() - lastFetched) < CACHE_DURATION;
};

export const selectCachedPatient = (patientId) => (state) => {
  const cached = state.patient.cache[patientId];
  if (!cached) return null;
  if ((Date.now() - cached.timestamp) > CACHE_DURATION) return null;
  return cached.data;
};

export default patientSlice.reducer;
