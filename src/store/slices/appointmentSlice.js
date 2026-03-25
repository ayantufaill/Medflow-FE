import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointment.service';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async ({ page = 1, limit = 10, providerId = '', patientId = '', status = '', startDate = '', endDate = '', appointmentTypeId = '', search = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await appointmentService.getAllAppointments(page, limit, providerId, patientId, status, startDate, endDate, appointmentTypeId, search);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointments');
    }
  },
  {
    condition: (_, { getState }) => {
      const { appointment } = getState();
      return !appointment.listLoading;
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

// ─── Slice ───────────────────────────────────────────────────

const initialState = {
  // List state
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: { status: '', startDate: '', endDate: '', providerId: '', search: '' },
  listLoading: false,
  listError: null,
  lastFetched: null,

  // Detail cache
  cache: {},

  // Current appointment
  currentAppointment: null,
  selectedAppointmentId: null,
  detailLoading: false,
  detailError: null,

  // Calendar state (persists across navigation)
  calendarView: 'week',
  selectedDate: new Date().toISOString(),
  conflicts: [],
};

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes for appointments (change more frequently)

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
      state.selectedAppointmentId = action.payload?._id || action.payload?.id || null;
      state.detailError = null;
    },
    setSelectedAppointmentId: (state, action) => {
      state.selectedAppointmentId = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.list = action.payload.appointments || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(fetchAppointmentById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;
        state.selectedAppointmentId = action.payload?._id || null;
        state.detailLoading = false;
        state.cache[action.payload._id] = { data: action.payload, timestamp: Date.now() };
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
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
} = appointmentSlice.actions;

// ─── Selectors ───────────────────────────────────────────────

export const selectAppointmentList = (state) => state.appointment.list;
export const selectAppointmentPagination = (state) => state.appointment.pagination;
export const selectAppointmentFilters = (state) => state.appointment.filters;
export const selectAppointmentListLoading = (state) => state.appointment.listLoading;
export const selectAppointmentListError = (state) => state.appointment.listError;
export const selectAppointmentLastFetched = (state) => state.appointment.lastFetched;
export const selectCurrentAppointment = (state) => state.appointment.currentAppointment;
export const selectSelectedAppointmentId = (state) => state.appointment.selectedAppointmentId;
export const selectAppointmentDetailLoading = (state) => state.appointment.detailLoading;
export const selectCalendarView = (state) => state.appointment.calendarView;
export const selectSelectedDate = (state) => state.appointment.selectedDate;
export const selectConflicts = (state) => state.appointment.conflicts;

export default appointmentSlice.reducer;
