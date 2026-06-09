import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientService } from '../../services/patient.service';
import { documentService } from '../../services/document.service';
import { invoiceService } from '../../services/invoice.service';

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
      const patient = await patientService.getPatientWorkspace(patientId);
      return patient;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch patient');
    }
  },
  {
    condition: (patientId, { getState }) => {
      const { patient } = getState();
      // Block the request if we are already currently fetching a patient detail
      // This prevents React StrictMode from double-fetching in development
      if (patient.detailLoading) {
        return false;
      }
      return true;
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
  },
  {
    condition: ({ patientId }, { getState }) => {
      const { patient } = getState();
      if (patient.patientInsurancesLoading) {
        return false;
      }
      if (patient.insurancesCache && patient.insurancesCache[patientId]) {
        return false;
      }
      return true;
    }
  }
);

export const fetchPatientBalance = createAsyncThunk(
  'patient/fetchBalance',
  async (patientId, { rejectWithValue }) => {
    try {
      const balance = await invoiceService.getPatientBalance(patientId);
      return { patientId, balance };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch balance');
    }
  },
  {
    condition: (patientId, { getState }) => {
      const { patient } = getState();
      if (patient.balanceLoading) {
        return false;
      }
      if (patient.balanceCache && patient.balanceCache[patientId]) {
        const cached = patient.balanceCache[patientId];
        if ((Date.now() - cached.timestamp) < 5 * 60 * 1000) {
          return false;
        }
      }
      return true;
    }
  }
);

export const createPatientInsuranceThunk = createAsyncThunk(
  'patient/createPatientInsurance',
  async ({ patientId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const data = await patientService.createPatientInsurance(patientId, payload);
      dispatch(fetchPatientInsurances({ patientId }));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create insurance');
    }
  }
);

export const updatePatientInsuranceThunk = createAsyncThunk(
  'patient/updatePatientInsurance',
  async ({ patientId, insuranceId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const data = await patientService.updatePatientInsurance(patientId, insuranceId, payload);
      dispatch(fetchPatientInsurances({ patientId }));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update insurance');
    }
  }
);

export const deletePatientInsuranceThunk = createAsyncThunk(
  'patient/deletePatientInsurance',
  async ({ patientId, insuranceId }, { dispatch, rejectWithValue }) => {
    try {
      await patientService.deletePatientInsurance(patientId, insuranceId);
      dispatch(fetchPatientInsurances({ patientId }));
      return { patientId, insuranceId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete insurance');
    }
  }
);

export const createPatientThunk = createAsyncThunk(
  'patient/createPatient',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await patientService.createPatient(payload);
      // Invalidate the patient list so the next fetch gets the new patient
      dispatch(invalidatePatients());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create patient');
    }
  }
);

export const updatePatientThunk = createAsyncThunk(
  'patient/updatePatient',
  async ({ patientId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(patientId, payload);
      
      // Also update workspace metadata (spouseInfo, referralSource, etc.)
      try {
        await patientService.updatePatientWorkspace(patientId, payload);
      } catch (metaErr) {
        console.warn('Failed to update workspace meta, but core patient updated', metaErr);
      }
      
      // After a successful update, we should refresh the workspace payload to ensure Redux has all relational data
      dispatch(fetchPatientById(patientId));
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update patient');
    }
  }
);

export const sendPatientUpdateRequestThunk = createAsyncThunk(
  'patient/sendUpdateRequest',
  async ({ patientId, payload }, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatientUpdateRequest(patientId, payload);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to send update request');
    }
  }
);

// ─── Medical History Thunks ──────────────────────────────────

export const fetchMedicalHistoryThunk = createAsyncThunk(
  'patient/fetchMedicalHistory',
  async (patientId, { rejectWithValue }) => {
    try {
      const data = await patientService.getStructuredMedicalHistory(patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch medical history');
    }
  },
  {
    condition: (patientId, { getState }) => {
      const { patient } = getState();
      if (patient.medicalHistoryLoading) {
        return false;
      }
      if (patient.currentMedicalHistory && patient.currentMedicalHistory.patientId === patientId) {
        return false;
      }
      return true;
    }
  }
);

export const updateMedicalHistoryThunk = createAsyncThunk(
  'patient/updateMedicalHistory',
  async ({ patientId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const data = await patientService.updateStructuredMedicalHistory(patientId, payload);
      dispatch(fetchMedicalHistoryThunk(patientId));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update medical history');
    }
  }
);

export const uploadMedicalDocumentThunk = createAsyncThunk(
  'patient/uploadMedicalDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await documentService.uploadDocument(formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const fetchDentalHistoryThunk = createAsyncThunk(
  'patient/fetchDentalHistory',
  async (patientId, { rejectWithValue }) => {
    try {
      const data = await patientService.getDentalHistory(patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch dental history');
    }
  },
  {
    condition: (patientId, { getState }) => {
      const { patient } = getState();
      if (patient.dentalHistoryLoading) {
        return false;
      }
      if (patient.currentDentalHistory && patient.currentDentalHistory.patientId === patientId) {
        return false;
      }
      return true;
    }
  }
);

export const updateDentalHistoryThunk = createAsyncThunk(
  'patient/updateDentalHistory',
  async ({ patientId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const data = await patientService.updateDentalHistory(patientId, payload);
      dispatch(fetchDentalHistoryThunk(patientId));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update dental history');
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

  // Medical History
  currentMedicalHistory: null,
  medicalHistoryLoading: false,
  medicalHistoryError: null,

  // Dental History
  currentDentalHistory: null,
  dentalHistoryLoading: false,
  dentalHistoryError: null,

  // Insurances cache
  insurancesCache: {}, // { [patientId]: { data, timestamp } }
  patientInsurancesLoading: false,

  // Balance cache
  balanceCache: {}, // { [patientId]: { data, timestamp } }
  balanceLoading: false,
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
      state.currentMedicalHistory = null;
      state.currentDentalHistory = null;
    },
    // Invalidate cache (e.g. after create/update/delete)
    invalidatePatients: (state) => {
      state.lastFetched = null;
    },
    invalidatePatientInsurances: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.insurancesCache[patientId];
      } else {
        state.insurancesCache = {};
      }
    },
    invalidatePatientBalance: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.balanceCache[patientId];
      } else {
        state.balanceCache = {};
      }
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
      .addCase(fetchPatientInsurances.pending, (state) => {
        state.patientInsurancesLoading = true;
      })
      .addCase(fetchPatientInsurances.fulfilled, (state, action) => {
        const { patientId, insurances } = action.payload;
        state.insurancesCache[patientId] = { data: insurances, timestamp: Date.now() };
        state.patientInsurancesLoading = false;
      })
      .addCase(fetchPatientInsurances.rejected, (state) => {
        state.patientInsurancesLoading = false;
      })
      // Fetch Patient Balance
      .addCase(fetchPatientBalance.pending, (state) => {
        state.balanceLoading = true;
      })
      .addCase(fetchPatientBalance.fulfilled, (state, action) => {
        const { patientId, balance } = action.payload;
        state.balanceCache[patientId] = {
          data: balance,
          timestamp: Date.now(),
        };
        state.balanceLoading = false;
      })
      .addCase(fetchPatientBalance.rejected, (state) => {
        state.balanceLoading = false;
      })
      // fetchMedicalHistoryThunk
      .addCase(fetchMedicalHistoryThunk.pending, (state) => {
        state.medicalHistoryLoading = true;
        state.medicalHistoryError = null;
      })
      .addCase(fetchMedicalHistoryThunk.fulfilled, (state, action) => {
        state.currentMedicalHistory = action.payload;
        state.medicalHistoryLoading = false;
      })
      .addCase(fetchMedicalHistoryThunk.rejected, (state, action) => {
        state.medicalHistoryLoading = false;
        state.medicalHistoryError = action.payload;
      })
      // fetchDentalHistoryThunk
      .addCase(fetchDentalHistoryThunk.pending, (state) => {
        state.dentalHistoryLoading = true;
        state.dentalHistoryError = null;
      })
      .addCase(fetchDentalHistoryThunk.fulfilled, (state, action) => {
        state.currentDentalHistory = action.payload;
        state.dentalHistoryLoading = false;
      })
      .addCase(fetchDentalHistoryThunk.rejected, (state, action) => {
        state.dentalHistoryLoading = false;
        state.dentalHistoryError = action.payload;
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
  invalidatePatientBalance,
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
export const selectCurrentMedicalHistory = (state) => state.patient.currentMedicalHistory;
export const selectMedicalHistoryLoading = (state) => state.patient.medicalHistoryLoading;
export const selectMedicalHistoryError = (state) => state.patient.medicalHistoryError;
export const selectCurrentDentalHistory = (state) => state.patient.currentDentalHistory;
export const selectDentalHistoryLoading = (state) => state.patient.dentalHistoryLoading;
export const selectDentalHistoryError = (state) => state.patient.dentalHistoryError;
export const selectPatientBalanceCache = (state) => state.patient.balanceCache;

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
