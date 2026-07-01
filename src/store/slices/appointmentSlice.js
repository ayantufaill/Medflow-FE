import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointment.service';

const DETAIL_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (args = {}, { rejectWithValue }) => {
    const {
      page = 1, limit = 10,
      providerId = '', patientId = '', status = '',
      startDate = '', endDate = '', appointmentTypeId = '', search = '',
    } = args;
    try {
      const result = await appointmentService.getAllAppointments(
        page, limit, providerId, patientId, status, startDate, endDate, appointmentTypeId, search,
      );
      return { data: result, args };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointments');
    }
  },
  {
    condition: (_args, { getState }) => !getState().appointment.listLoading,
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointment/fetchAppointmentById',
  async (appointmentId, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointmentById(appointmentId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointment');
    }
  },
  {
    condition: (appointmentId, { getState }) => {
      const { appointment } = getState();
      if (appointment.detailLoading) return false;
      const cached = appointment.cache[appointmentId];
      return !cached || (Date.now() - cached.timestamp) >= DETAIL_CACHE_TTL;
    },
  }
);

export const createAppointmentThunk = createAsyncThunk(
  'appointment/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await appointmentService.createAppointment(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create appointment',
      );
    }
  }
);

export const updateAppointmentThunk = createAsyncThunk(
  'appointment/update',
  async ({ appointmentId, payload }, { rejectWithValue }) => {
    try {
      return await appointmentService.updateAppointment(appointmentId, payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update appointment',
      );
    }
  }
);

export const deleteAppointmentThunk = createAsyncThunk(
  'appointment/delete',
  async (appointmentId, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      return appointmentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete appointment',
      );
    }
  }
);

export const cancelAppointmentThunk = createAsyncThunk(
  'appointment/cancel',
  async ({ appointmentId, cancellationReason = '' }, { rejectWithValue }) => {
    try {
      return await appointmentService.cancelAppointment(appointmentId, cancellationReason);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to cancel appointment',
      );
    }
  }
);

export const fetchCheckoutAppointments = createAsyncThunk(
  'appointment/fetchCheckoutAppointments',
  async (args = {}, { rejectWithValue }) => {
    const { page = 1, limit = 200, providerId = '', startDate = '', endDate = '' } = args;
    try {
      const result = await appointmentService.getAllAppointments(
        page, limit, providerId, '', 'checkout complete', startDate, endDate,
      );
      return { data: result, args };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch checkout appointments');
    }
  }
);

export const fetchFamilyAppointments = createAsyncThunk(
  'appointment/fetchFamilyAppointments',
  async (patientIds, { rejectWithValue }) => {
    try {
      const results = await Promise.all(
        patientIds.map(id => appointmentService.getAppointmentsByPatient(id).catch(() => [])),
      );
      return results.flat();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch family appointments');
    }
  }
);

export const fetchPatientHistory = createAsyncThunk(
  'appointment/fetchPatientHistory',
  async (patientId, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointmentsByPatient(patientId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointment history');
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'appointment/fetchAvailableSlots',
  async ({ providerId, date, duration }, { rejectWithValue }) => {
    try {
      return await appointmentService.getAvailableSlots(providerId, date, duration);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch available slots');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // Appointment list
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: { status: '', startDate: '', endDate: '', providerId: '', search: '' },
  listLoading: false,
  listError: null,
  lastFetched: null,

  // Secondary lists
  checkoutCompleteList: [],
  checkoutLoading: false,
  familyAppointmentsList: [],
  familyAppointmentsLoading: false,
  patientHistoryList: [],
  patientHistoryLoading: false,

  // Single appointment detail
  currentAppointment: null,
  selectedAppointmentId:
    typeof window !== 'undefined' ? localStorage.getItem('selectedAppointmentId') : null,
  detailLoading: false,
  detailError: null,
  cache: {}, // { [appointmentId]: { data, timestamp } }

  // Schedule UI (persists across navigation)
  calendarView: 'week',
  selectedDate: new Date().toISOString(),
  conflicts: [],

  // Operatory schedule pending tray (items dragged off the grid)
  pendingItems: [], // { id, type: 'appointment' | 'block', data }
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
      state.selectedAppointmentId = action.payload?._id || action.payload?.id || null;
      state.detailError = null;
      if (state.selectedAppointmentId) {
        localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId);
      } else {
        localStorage.removeItem('selectedAppointmentId');
      }
    },
    setSelectedAppointmentId: (state, action) => {
      state.selectedAppointmentId = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedAppointmentId', action.payload);
      } else {
        localStorage.removeItem('selectedAppointmentId');
      }
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
      state.selectedAppointmentId = null;
      state.conflicts = [];
      localStorage.removeItem('selectedAppointmentId');
    },
    invalidateAppointments: (state) => {
      state.lastFetched = null;
    },
    invalidateAppointmentDetail: (state, action) => {
      delete state.cache[action.payload];
    },
    updateAppointmentInList: (state, action) => {
      const updated = action.payload;
      const id = updated._id || updated.id;
      const idx = state.list.findIndex(a => (a._id || a.id) === id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    removeAppointmentFromList: (state, action) => {
      state.list = state.list.filter(a => (a._id || a.id) !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setConflicts: (state, action) => {
      state.conflicts = action.payload;
    },
    clearConflicts: (state) => {
      state.conflicts = [];
    },
    addPendingItem: (state, action) => {
      const item = action.payload;
      if (!state.pendingItems.some(i => i.id === item.id)) {
        state.pendingItems.push(item);
      }
    },
    removePendingItem: (state, action) => {
      state.pendingItems = state.pendingItems.filter(i => i.id !== action.payload);
    },
    clearPendingItems: (state) => {
      state.pendingItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAppointments
      .addCase(fetchAppointments.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        const raw = action.payload.data;
        state.list = Array.isArray(raw) ? raw : (raw?.appointments || []);
        state.pagination = raw?.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })

      // fetchAppointmentById
      .addCase(fetchAppointmentById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;
        state.selectedAppointmentId = action.payload?._id || null;
        state.detailLoading = false;
        state.cache[action.payload._id] = { data: action.payload, timestamp: Date.now() };
        if (state.selectedAppointmentId) {
          localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId);
        }
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })

      // createAppointmentThunk
      .addCase(createAppointmentThunk.fulfilled, (state, action) => {
        if (action.payload) state.list.push(action.payload);
      })

      // updateAppointmentThunk
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const id = action.payload._id || action.payload.id;
        const idx = state.list.findIndex(a => (a._id || a.id) === id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.currentAppointment?._id === id) state.currentAppointment = action.payload;
        delete state.cache[id];
      })

      // deleteAppointmentThunk
      .addCase(deleteAppointmentThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter(a => (a._id || a.id) !== id);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.pendingItems = state.pendingItems.filter(i => i.id !== id);
        delete state.cache[id];
        if (state.selectedAppointmentId === id) {
          state.selectedAppointmentId = null;
          state.currentAppointment = null;
          localStorage.removeItem('selectedAppointmentId');
        }
      })

      // cancelAppointmentThunk
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const id = action.payload._id || action.payload.id;
        const idx = state.list.findIndex(a => (a._id || a.id) === id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.currentAppointment?._id === id) state.currentAppointment = action.payload;
        delete state.cache[id];
      })

      // fetchCheckoutAppointments
      .addCase(fetchCheckoutAppointments.pending, (state) => {
        state.checkoutLoading = true;
      })
      .addCase(fetchCheckoutAppointments.fulfilled, (state, action) => {
        const raw = action.payload.data;
        state.checkoutCompleteList = Array.isArray(raw) ? raw : (raw?.appointments || []);
        state.checkoutLoading = false;
      })
      .addCase(fetchCheckoutAppointments.rejected, (state) => {
        state.checkoutLoading = false;
      })

      // fetchFamilyAppointments
      .addCase(fetchFamilyAppointments.pending, (state) => {
        state.familyAppointmentsLoading = true;
      })
      .addCase(fetchFamilyAppointments.fulfilled, (state, action) => {
        state.familyAppointmentsList = action.payload || [];
        state.familyAppointmentsLoading = false;
      })
      .addCase(fetchFamilyAppointments.rejected, (state) => {
        state.familyAppointmentsLoading = false;
      })

      // fetchPatientHistory
      .addCase(fetchPatientHistory.pending, (state) => {
        state.patientHistoryLoading = true;
      })
      .addCase(fetchPatientHistory.fulfilled, (state, action) => {
        state.patientHistoryList = action.payload || [];
        state.patientHistoryLoading = false;
      })
      .addCase(fetchPatientHistory.rejected, (state) => {
        state.patientHistoryLoading = false;
      });

    // fetchAvailableSlots result is consumed locally via .unwrap() at the call site;
    // no Redux state is needed for it.
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  setCurrentAppointment,
  setSelectedAppointmentId,
  clearCurrentAppointment,
  invalidateAppointments,
  invalidateAppointmentDetail,
  updateAppointmentInList,
  removeAppointmentFromList,
  setCalendarView,
  setSelectedDate,
  setFilters,
  clearFilters,
  setConflicts,
  clearConflicts,
  addPendingItem,
  removePendingItem,
  clearPendingItems,
} = appointmentSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAppointmentList            = (state) => state.appointment.list;
export const selectAppointmentPagination      = (state) => state.appointment.pagination;
export const selectAppointmentFilters         = (state) => state.appointment.filters;
export const selectAppointmentListLoading     = (state) => state.appointment.listLoading;
export const selectAppointmentListError       = (state) => state.appointment.listError;
export const selectAppointmentLastFetched     = (state) => state.appointment.lastFetched;

export const selectCheckoutCompleteList       = (state) => state.appointment.checkoutCompleteList;
export const selectCheckoutLoading            = (state) => state.appointment.checkoutLoading;

export const selectFamilyAppointmentsList     = (state) => state.appointment.familyAppointmentsList;
export const selectFamilyAppointmentsLoading  = (state) => state.appointment.familyAppointmentsLoading;

export const selectPatientHistoryList         = (state) => state.appointment.patientHistoryList;
export const selectPatientHistoryLoading      = (state) => state.appointment.patientHistoryLoading;

export const selectCurrentAppointment         = (state) => state.appointment.currentAppointment;
export const selectSelectedAppointmentId      = (state) => state.appointment.selectedAppointmentId;
export const selectAppointmentDetailLoading   = (state) => state.appointment.detailLoading;

export const selectCalendarView               = (state) => state.appointment.calendarView;
export const selectSelectedDate               = (state) => state.appointment.selectedDate;
export const selectConflicts                  = (state) => state.appointment.conflicts;
export const selectPendingItems               = (state) => state.appointment.pendingItems;

export default appointmentSlice.reducer;
