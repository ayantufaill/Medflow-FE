import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointment.service';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (args = {}, { rejectWithValue }) => {
    const { page = 1, limit = 10, providerId = '', patientId = '', status = '', startDate = '', endDate = '', appointmentTypeId = '', search = '' } = args;
    try {
      const result = await appointmentService.getAllAppointments(page, limit, providerId, patientId, status, startDate, endDate, appointmentTypeId, search);
      return { data: result, args };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointments');
    }
  },
  {
    condition: (_args, { getState }) => {
      return !getState().appointment.listLoading;
    },
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointment/fetchAppointmentById',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const appointment = await appointmentService.getAppointmentById(appointmentId);
      return appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointment');
    }
  }
);

export const createAppointmentThunk = createAsyncThunk(
  'appointment/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(payload);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const updateAppointmentThunk = createAsyncThunk(
  'appointment/update',
  async ({ appointmentId, payload }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(appointmentId, payload);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update appointment');
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
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete appointment');
    }
  }
);

export const cancelAppointmentThunk = createAsyncThunk(
  'appointment/cancel',
  async ({ appointmentId, cancellationReason = '' }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.cancelAppointment(appointmentId, cancellationReason);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const fetchCheckoutAppointments = createAsyncThunk(
  'appointment/fetchCheckoutAppointments',
  async (args = {}, { rejectWithValue }) => {
    const { page = 1, limit = 200, providerId = '', startDate = '', endDate = '' } = args;
    try {
      const result = await appointmentService.getAllAppointments(page, limit, providerId, "", "checkout complete", startDate, endDate);
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
      const promises = patientIds.map(id => appointmentService.getAppointmentsByPatient(id).catch(() => []));
      const results = await Promise.all(promises);
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
      const data = await appointmentService.getAppointmentsByPatient(patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointment history');
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'appointment/fetchAvailableSlots',
  async ({ providerId, date, duration }, { rejectWithValue }) => {
    try {
      const data = await appointmentService.getAvailableSlots(providerId, date, duration);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch available slots');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const initialState = {
  // List state
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: { status: '', startDate: '', endDate: '', providerId: '', search: '' },
  listLoading: false,
  listError: null,
  lastFetched: null,
  lastParams: null,

  // Secondary lists
  checkoutCompleteList: [],
  checkoutLoading: false,
  familyAppointmentsList: [],
  familyAppointmentsLoading: false,
  patientHistoryList: [],
  patientHistoryLoading: false,

  // Detail cache
  cache: {},

  // Current appointment
  currentAppointment: null,
  selectedAppointmentId: typeof window !== 'undefined' ? localStorage.getItem('selectedAppointmentId') : null,
  detailLoading: false,
  detailError: null,

  // Calendar state (persists across navigation)
  calendarView: 'week',
  selectedDate: new Date().toISOString(),
  conflicts: [],

  // Operatory schedule — items dragged off the grid into the pending tray
  pendingItems: [],
};

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes for appointments (change more frequently)

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
      state.selectedAppointmentId = action.payload?._id || action.payload?.id || null;
      if (state.selectedAppointmentId) {
        localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId);
      } else {
        localStorage.removeItem('selectedAppointmentId');
      }
      state.detailError = null;
    },
    setSelectedAppointmentId: (state, action) => {
      state.selectedAppointmentId = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedAppointmentId', action.payload);
      } else {
        localStorage.removeItem('selectedAppointmentId');
      }
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
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
      state.selectedAppointmentId = null;
      localStorage.removeItem('selectedAppointmentId');
      state.conflicts = [];
    },
    invalidateAppointments: (state) => {
      state.lastFetched = null;
    },
    invalidateAppointmentDetail: (state, action) => {
      delete state.cache[action.payload];
    },
    updateAppointmentInList: (state, action) => {
      const updated = action.payload;
      const idx = state.list.findIndex(a => a._id === updated._id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    removeAppointmentFromList: (state, action) => {
      state.list = state.list.filter(a => a._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },

    // Pending tray (operatory schedule drag-to-hold)
    addPendingItem: (state, action) => {
      const item = action.payload; // { id, type: 'appointment' | 'block', data }
      const alreadyExists = state.pendingItems.some(i => i.id === item.id);
      if (!alreadyExists) state.pendingItems.push(item);
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
      .addCase(fetchAppointments.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        const raw = Array.isArray(action.payload.data) ? action.payload.data : (action.payload.data?.appointments || []);
        state.list = raw;
        state.pagination = action.payload.data?.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
        const { page = 1, limit = 10, providerId = '', patientId = '', status = '', startDate = '', endDate = '', appointmentTypeId = '', search = '' } = action.payload.args || {};
        state.lastParams = { page, limit, providerId, patientId, status, startDate, endDate, appointmentTypeId, search };
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(fetchCheckoutAppointments.pending, (state) => {
        state.checkoutLoading = true;
      })
      .addCase(fetchCheckoutAppointments.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        const raw = Array.isArray(action.payload.data) ? action.payload.data : (action.payload.data?.appointments || []);
        state.checkoutCompleteList = raw;
      })
      .addCase(fetchCheckoutAppointments.rejected, (state) => {
        state.checkoutLoading = false;
      })
      .addCase(fetchAppointmentById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;
        state.selectedAppointmentId = action.payload?._id || null;
        if (state.selectedAppointmentId) {
          localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId);
        } else {
          localStorage.removeItem('selectedAppointmentId');
        }
        state.detailLoading = false;
        state.cache[action.payload._id] = { data: action.payload, timestamp: Date.now() };
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      .addCase(createAppointmentThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.push(action.payload);
        }
      })
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.list.findIndex(a => a._id === action.payload._id || a.id === action.payload.id);
          if (idx !== -1) {
            state.list[idx] = action.payload;
          }
        }
      })
      .addCase(fetchFamilyAppointments.pending, (state) => {
        state.familyAppointmentsLoading = true;
      })
      .addCase(fetchFamilyAppointments.fulfilled, (state, action) => {
        state.familyAppointmentsLoading = false;
        state.familyAppointmentsList = action.payload || [];
      })
      .addCase(fetchFamilyAppointments.rejected, (state) => {
        state.familyAppointmentsLoading = false;
      })
      .addCase(fetchPatientHistory.pending, (state) => {
        state.patientHistoryLoading = true;
      })
      .addCase(fetchPatientHistory.fulfilled, (state, action) => {
        state.patientHistoryLoading = false;
        state.patientHistoryList = action.payload || [];
      })
      .addCase(fetchPatientHistory.rejected, (state) => {
        state.patientHistoryLoading = false;
      })

      // Delete
      .addCase(deleteAppointmentThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.list = state.list.filter(a => (a._id || a.id) !== deletedId);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        // Also remove from pending tray if it was there
        state.pendingItems = state.pendingItems.filter(i => i.id !== deletedId);
        if (state.selectedAppointmentId === deletedId) {
          state.selectedAppointmentId = null;
          state.currentAppointment = null;
          localStorage.removeItem('selectedAppointmentId');
        }
      })

      // Cancel (keeps the appointment in list but updates its status)
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.list.findIndex(a => (a._id || a.id) === (action.payload._id || action.payload.id));
          if (idx !== -1) state.list[idx] = action.payload;
          if (state.currentAppointment?._id === action.payload._id) {
            state.currentAppointment = action.payload;
          }
        }
      });
  },
});

export const {
  setCurrentAppointment,
  setSelectedAppointmentId,
  setCalendarView,
  setSelectedDate,
  setFilters,
  clearFilters,
  setConflicts,
  clearConflicts,
  clearCurrentAppointment,
  invalidateAppointments,
  invalidateAppointmentDetail,
  updateAppointmentInList,
  removeAppointmentFromList,
  addPendingItem,
  removePendingItem,
  clearPendingItems,
} = appointmentSlice.actions;

// ─── Selectors ───────────────────────────────────────────────

export const selectAppointmentList = (state) => state.appointment.list;
export const selectAppointmentPagination = (state) => state.appointment.pagination;
export const selectAppointmentFilters = (state) => state.appointment.filters;
export const selectAppointmentListLoading = (state) => state.appointment.listLoading;
export const selectAppointmentListError = (state) => state.appointment.listError;

export const selectCheckoutCompleteList = (state) => state.appointment.checkoutCompleteList;
export const selectCheckoutLoading = (state) => state.appointment.checkoutLoading;

export const selectFamilyAppointmentsList = (state) => state.appointment.familyAppointmentsList;
export const selectFamilyAppointmentsLoading = (state) => state.appointment.familyAppointmentsLoading;

export const selectPatientHistoryList = (state) => state.appointment.patientHistoryList;
export const selectPatientHistoryLoading = (state) => state.appointment.patientHistoryLoading;

export const selectAppointmentLastFetched = (state) => state.appointment.lastFetched;
export const selectCurrentAppointment = (state) => state.appointment.currentAppointment;
export const selectSelectedAppointmentId = (state) => state.appointment.selectedAppointmentId;
export const selectAppointmentDetailLoading = (state) => state.appointment.detailLoading;
export const selectCalendarView = (state) => state.appointment.calendarView;
export const selectSelectedDate = (state) => state.appointment.selectedDate;
export const selectConflicts = (state) => state.appointment.conflicts;
export const selectPendingItems = (state) => state.appointment.pendingItems;

export default appointmentSlice.reducer;
