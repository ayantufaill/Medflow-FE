import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointment.service';

// Appointments change frequently (drag-reschedule, status updates), so the
// detail cache expires quickly to avoid showing stale data on the schedule grid.
const DETAIL_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// ─── Thunks ───────────────────────────────────────────────────────────────────

// Fetches a paginated, filtered list of appointments.
// The condition blocks a second dispatch while one is already in-flight,
// preventing duplicate API calls when multiple components mount simultaneously.
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
      // Return args alongside data so the fulfilled reducer can record lastFetched context.
      return { data: result, args };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointments');
    }
  },
  {
    // Block concurrent list fetches; param deduplication is intentionally omitted
    // because date range changes on the schedule page should always hit the network.
    condition: (_args, { getState }) => !getState().appointment.listLoading,
  }
);

// Fetches a single appointment by ID.
// The TTL condition prevents redundant network calls when navigating between
// clinical sub-pages that all read the same appointment — each re-mounts and
// would otherwise dispatch independently.
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
      // Skip if a fetch is already running for any appointment
      if (appointment.detailLoading) return false;
      const cached = appointment.cache[appointmentId];
      // Skip if we have a fresh cache entry — caller can use invalidateAppointmentDetail
      // to force a re-fetch when they know the data is stale (e.g. after a status change).
      return !cached || (Date.now() - cached.timestamp) >= DETAIL_CACHE_TTL;
    },
  }
);

// Creates a new appointment and optimistically appends it to the list
// so the schedule grid reflects it immediately without a full refetch.
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

// Updates an appointment (status change, reschedule, room reassignment, etc.).
// On success the reducer updates the list in-place AND invalidates the detail
// cache so the next fetchAppointmentById call hits the network for fresh data.
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

// Permanently deletes an appointment.
// Returns the appointmentId on success so the reducer can clean up all related
// state (list, pending tray, detail cache, selected ID) in a single action.
export const deleteAppointmentThunk = createAsyncThunk(
  'appointment/delete',
  async (appointmentId, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      // Return the ID, not the response body, because DELETE returns no meaningful payload.
      return appointmentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete appointment',
      );
    }
  }
);

// Cancels an appointment via a dedicated backend endpoint (POST /cancel).
// Unlike delete, the record is retained with status="cancelled" — used for
// audit trails and re-booking flows. The reducer updates it in-place in the list.
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

// Fetches appointments with status "checkout complete" for the Progress Notes
// dialog. Uses a high limit (200) because it renders all same-day checkouts
// without pagination — the dialog is not designed for paginated data.
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

// Fetches appointments for multiple family members in parallel.
// Each individual request catches silently so a single failed family member
// doesn't block the rest from rendering.
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

// Fetches past appointments for a single patient (used in appointment history dialog
// and the operatory sidebar's patient history panel).
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

// Fetches available time slots for a provider on a given date.
// Result is NOT stored in Redux state — callers consume it locally via .unwrap()
// because slot availability is ephemeral and only relevant during the booking flow.
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
  // ── Appointment list ────────────────────────────────────────────────────────
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  // Active filters reflected in the list — kept in Redux so filter UI components
  // can read them without prop drilling.
  filters: { status: '', startDate: '', endDate: '', providerId: '', search: '' },
  listLoading: false,
  listError: null,
  // Timestamp of the last successful list fetch — used by consumers to decide
  // whether to trigger a background refresh.
  lastFetched: null,

  // ── Secondary lists (scoped to specific features) ───────────────────────────
  checkoutCompleteList: [],   // Used by ProgressNotesDialog
  checkoutLoading: false,
  familyAppointmentsList: [], // Used by FamilyAppointmentsDialog
  familyAppointmentsLoading: false,
  patientHistoryList: [],     // Used by AppointmentHistoryDialog and OperatorySidebar
  patientHistoryLoading: false,

  // ── Single appointment detail ───────────────────────────────────────────────
  currentAppointment: null,
  // Persisted to localStorage so clinical sub-pages (Radiographic, PeriodontalExam,
  // etc.) can restore the active appointment after a browser refresh without
  // requiring the user to re-select it from the schedule.
  selectedAppointmentId:
    typeof window !== 'undefined' ? localStorage.getItem('selectedAppointmentId') : null,
  detailLoading: false,
  detailError: null,
  // Short-lived in-memory cache keyed by appointmentId.
  // Shape: { [appointmentId]: { data: Appointment, timestamp: number } }
  // Avoids redundant API calls when multiple clinical sub-pages mount for the
  // same appointment within the DETAIL_CACHE_TTL window.
  cache: {},

  // ── Schedule UI state ───────────────────────────────────────────────────────
  // Stored in Redux (not local component state) so ScheduleGridHeader, ScheduleCalendar,
  // and LeftPanel can all read and update the same date/view without prop drilling.
  calendarView: 'week', // 'day' | 'week' | 'month'
  selectedDate: new Date().toISOString(),
  // Conflict windows detected during the booking flow — cleared on dialog close.
  conflicts: [],

  // ── Operatory schedule pending tray ────────────────────────────────────────
  // Holds items the user has dragged off the grid into the "pending" holding area.
  // Shape: Array<{ id: string, type: 'appointment' | 'block', data: object }>
  // Shared between ScheduleCalendar (filters them out) and LeftPanel (renders them).
  pendingItems: [],
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    // Sets the active appointment and syncs selectedAppointmentId in one step.
    // Used when the appointment object is already in memory (e.g. clicked on the grid)
    // so we don't need to re-fetch it.
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

    // Sets only the ID without loading the full appointment object.
    // Used when navigating to a clinical page from a link that only has the ID —
    // the page then dispatches fetchAppointmentById to load the full record.
    setSelectedAppointmentId: (state, action) => {
      state.selectedAppointmentId = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedAppointmentId', action.payload);
      } else {
        localStorage.removeItem('selectedAppointmentId');
      }
    },

    // Clears all appointment detail state including conflicts.
    // Dispatched by clinicalExamSessionSlice on session end so clinical pages
    // don't display stale appointment data after the session closes.
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
      state.selectedAppointmentId = null;
      state.conflicts = [];
      localStorage.removeItem('selectedAppointmentId');
    },

    // Forces the next fetchAppointments call to hit the network regardless of
    // listLoading state. Used after create/update/delete to sync the grid.
    invalidateAppointments: (state) => {
      state.lastFetched = null;
    },

    // Removes a single appointment from the detail cache so the next
    // fetchAppointmentById call bypasses the TTL and hits the network.
    // Use this after an external update that the thunks didn't handle
    // (e.g. a WebSocket push from another user's edit).
    invalidateAppointmentDetail: (state, action) => {
      delete state.cache[action.payload];
    },

    // Applies a partial update to a list item without a full refetch.
    // Normalizes _id / id so it works regardless of which field the API returns.
    updateAppointmentInList: (state, action) => {
      const updated = action.payload;
      const id = updated._id || updated.id;
      const idx = state.list.findIndex(a => (a._id || a.id) === id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },

    // Removes an item from the list and decrements the total count.
    // For permanent removal without an API call (e.g. optimistic local delete before
    // the thunk resolves). The thunk's fulfilled case also calls this logic.
    removeAppointmentFromList: (state, action) => {
      state.list = state.list.filter(a => (a._id || a.id) !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },

    // ── Schedule UI actions ───────────────────────────────────────────────────

    setCalendarView: (state, action) => {
      state.calendarView = action.payload; // 'day' | 'week' | 'month'
    },

    // Stores the date as an ISO string so it survives Redux serialization checks.
    // Components convert to/from dayjs at the boundary.
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },

    // Merges partial filter updates so callers only need to pass changed fields.
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Stores time windows where the selected provider is already booked.
    // Set by the booking form after checking conflicts; cleared on dialog close.
    setConflicts: (state, action) => {
      state.conflicts = action.payload;
    },

    clearConflicts: (state) => {
      state.conflicts = [];
    },

    // ── Pending tray actions ──────────────────────────────────────────────────

    // Adds an item to the pending tray. Idempotent — silently ignores duplicates
    // so rapid drag events don't add the same item twice.
    addPendingItem: (state, action) => {
      const item = action.payload; // { id, type: 'appointment' | 'block', data }
      if (!state.pendingItems.some(i => i.id === item.id)) {
        state.pendingItems.push(item);
      }
    },

    // Removes one item from the pending tray (e.g. when dropped back onto the grid
    // or successfully rescheduled via drag-and-drop).
    removePendingItem: (state, action) => {
      state.pendingItems = state.pendingItems.filter(i => i.id !== action.payload);
    },

    // Clears the entire tray — used when navigating away from the schedule page
    // so stale pending items don't reappear on return.
    clearPendingItems: (state) => {
      state.pendingItems = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ── fetchAppointments ─────────────────────────────────────────────────
      .addCase(fetchAppointments.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        const raw = action.payload.data;
        // API returns either a bare array or { appointments: [], pagination: {} }
        state.list = Array.isArray(raw) ? raw : (raw?.appointments || []);
        state.pagination = raw?.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })

      // ── fetchAppointmentById ──────────────────────────────────────────────
      .addCase(fetchAppointmentById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;
        state.selectedAppointmentId = action.payload?._id || null;
        state.detailLoading = false;
        // Write to cache so subsequent navigations within the TTL window skip the network.
        state.cache[action.payload._id] = { data: action.payload, timestamp: Date.now() };
        if (state.selectedAppointmentId) {
          localStorage.setItem('selectedAppointmentId', state.selectedAppointmentId);
        }
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })

      // ── createAppointmentThunk ────────────────────────────────────────────
      .addCase(createAppointmentThunk.fulfilled, (state, action) => {
        // Append immediately so the schedule grid shows the new appointment
        // without waiting for a full list refetch.
        if (action.payload) state.list.push(action.payload);
      })

      // ── updateAppointmentThunk ────────────────────────────────────────────
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const id = action.payload._id || action.payload.id;
        const idx = state.list.findIndex(a => (a._id || a.id) === id);
        // Update in the list so the grid card reflects the new time/status/room.
        if (idx !== -1) state.list[idx] = action.payload;
        // Keep currentAppointment in sync if the details panel is open.
        if (state.currentAppointment?._id === id) state.currentAppointment = action.payload;
        // Evict the cache entry so the next fetchAppointmentById returns fresh data
        // rather than the pre-update version.
        delete state.cache[id];
      })

      // ── deleteAppointmentThunk ────────────────────────────────────────────
      .addCase(deleteAppointmentThunk.fulfilled, (state, action) => {
        const id = action.payload; // The deleted appointmentId returned by the thunk
        // Remove from the visible list and correct the pagination total.
        state.list = state.list.filter(a => (a._id || a.id) !== id);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        // Remove from the pending tray in case the user had dragged it there before deleting.
        state.pendingItems = state.pendingItems.filter(i => i.id !== id);
        // Clean up the detail cache to free memory.
        delete state.cache[id];
        // Clear selected state so clinical pages don't hold a reference to a deleted record.
        if (state.selectedAppointmentId === id) {
          state.selectedAppointmentId = null;
          state.currentAppointment = null;
          localStorage.removeItem('selectedAppointmentId');
        }
      })

      // ── cancelAppointmentThunk ────────────────────────────────────────────
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const id = action.payload._id || action.payload.id;
        const idx = state.list.findIndex(a => (a._id || a.id) === id);
        // Update in-place (record is kept, only status changes to "cancelled").
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.currentAppointment?._id === id) state.currentAppointment = action.payload;
        // Evict cache so the cancelled status is reflected on the next detail fetch.
        delete state.cache[id];
      })

      // ── fetchCheckoutAppointments ─────────────────────────────────────────
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

      // ── fetchFamilyAppointments ───────────────────────────────────────────
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

      // ── fetchPatientHistory ───────────────────────────────────────────────
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

    // fetchAvailableSlots has no reducer cases because the result is consumed
    // locally via .unwrap() in AppointmentForm — slot availability is ephemeral
    // and doesn't belong in shared Redux state.
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

// List selectors
export const selectAppointmentList            = (state) => state.appointment.list;
export const selectAppointmentPagination      = (state) => state.appointment.pagination;
export const selectAppointmentFilters         = (state) => state.appointment.filters;
export const selectAppointmentListLoading     = (state) => state.appointment.listLoading;
export const selectAppointmentListError       = (state) => state.appointment.listError;
export const selectAppointmentLastFetched     = (state) => state.appointment.lastFetched;

// Secondary list selectors
export const selectCheckoutCompleteList       = (state) => state.appointment.checkoutCompleteList;
export const selectCheckoutLoading            = (state) => state.appointment.checkoutLoading;
export const selectFamilyAppointmentsList     = (state) => state.appointment.familyAppointmentsList;
export const selectFamilyAppointmentsLoading  = (state) => state.appointment.familyAppointmentsLoading;
export const selectPatientHistoryList         = (state) => state.appointment.patientHistoryList;
export const selectPatientHistoryLoading      = (state) => state.appointment.patientHistoryLoading;

// Detail selectors
export const selectCurrentAppointment         = (state) => state.appointment.currentAppointment;
export const selectSelectedAppointmentId      = (state) => state.appointment.selectedAppointmentId;
export const selectAppointmentDetailLoading   = (state) => state.appointment.detailLoading;

// Schedule UI selectors
export const selectCalendarView               = (state) => state.appointment.calendarView;
export const selectSelectedDate               = (state) => state.appointment.selectedDate;
export const selectConflicts                  = (state) => state.appointment.conflicts;

// Operatory schedule selectors
export const selectPendingItems               = (state) => state.appointment.pendingItems;

export default appointmentSlice.reducer;
