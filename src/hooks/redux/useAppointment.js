import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  // Thunks
  fetchAppointments,
  fetchAppointmentById,
  createAppointmentThunk,
  updateAppointmentThunk,
  deleteAppointmentThunk,
  cancelAppointmentThunk,
  invalidateAppointments,
  invalidateAppointmentDetail,
  // List actions
  setFilters,
  clearFilters,
  updateAppointmentInList,
  removeAppointmentFromList,
  // Detail actions
  setCurrentAppointment,
  setSelectedAppointmentId,
  clearCurrentAppointment,
  // Schedule UI actions
  setCalendarView,
  setSelectedDate,
  setConflicts,
  clearConflicts,
  // Pending tray actions
  addPendingItem,
  removePendingItem,
  clearPendingItems,
  // Selectors — list
  selectAppointmentList,
  selectAppointmentPagination,
  selectAppointmentFilters,
  selectAppointmentListLoading,
  selectAppointmentListError,
  selectAppointmentLastFetched,
  // Selectors — detail
  selectCurrentAppointment,
  selectSelectedAppointmentId,
  selectAppointmentDetailLoading,
  // Selectors — schedule UI
  selectCalendarView,
  selectSelectedDate,
  selectConflicts,
  selectPendingItems,
} from '../../store/slices/appointmentSlice';

// ─── useAppointmentList ───────────────────────────────────────────────────────
// For pages that render a list of appointments (schedule grid, appointments list).
//
// Pass `initialFilters` to seed the auto-fetch on mount. After mount, callers
// can drive further fetches via fetch() or manage Redux filter state via
// updateFilters() + refresh().
//
// Usage:
//   const { appointments, loading, createAppointment } = useAppointmentList({
//     startDate: '2026-07-01', endDate: '2026-07-31', limit: 100,
//   });
export const useAppointmentList = (initialFilters = {}) => {
  const dispatch = useDispatch();

  const appointments = useSelector(selectAppointmentList);
  const pagination   = useSelector(selectAppointmentPagination);
  const filters      = useSelector(selectAppointmentFilters);
  const loading      = useSelector(selectAppointmentListLoading);
  const error        = useSelector(selectAppointmentListError);
  const lastFetched  = useSelector(selectAppointmentLastFetched);

  // Capture initialFilters in a ref so the auto-fetch effect and the refresh
  // callback always see the latest value without being recreated on every render.
  // This avoids the JSON.stringify(filters) anti-pattern in dependency arrays.
  const initialFiltersRef = useRef(initialFilters);
  useEffect(() => { initialFiltersRef.current = initialFilters; });

  // Auto-fetch on mount. The thunk's condition guard prevents a second in-flight
  // request if another consumer already triggered one.
  useEffect(() => {
    dispatch(fetchAppointments(initialFiltersRef.current));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Explicit fetch with any params — useful when the caller needs to change the
  // query without updating Redux filter state (e.g. a one-off search).
  const fetch = useCallback((params = {}) => {
    return dispatch(fetchAppointments(params));
  }, [dispatch]);

  // Invalidates lastFetched and re-fetches, merging initialFilters with the
  // current Redux filter state. Call this after a mutation to sync the grid.
  const refresh = useCallback(() => {
    dispatch(invalidateAppointments());
    return dispatch(fetchAppointments({ ...initialFiltersRef.current, ...filters }));
  }, [dispatch, filters]);

  // Merges a partial object into the Redux filter state (does not auto-fetch —
  // callers should call refresh() or fetch() after updating filters if needed).
  const updateFilters = useCallback((partial) => {
    dispatch(setFilters(partial));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  // Optimistically appends the new appointment to the list on success.
  const createAppointment = useCallback((payload) => {
    return dispatch(createAppointmentThunk(payload));
  }, [dispatch]);

  // Updates an appointment in-place in the list and invalidates its detail cache.
  const updateAppointment = useCallback((appointmentId, payload) => {
    return dispatch(updateAppointmentThunk({ appointmentId, payload }));
  }, [dispatch]);

  // Removes the appointment from the list, pending tray, cache, and clears
  // selectedAppointmentId if it pointed to the deleted record.
  const deleteAppointment = useCallback((appointmentId) => {
    return dispatch(deleteAppointmentThunk(appointmentId));
  }, [dispatch]);

  // Flips the appointment status to "cancelled" without removing it from the list.
  const cancelAppointment = useCallback((appointmentId, cancellationReason = '') => {
    return dispatch(cancelAppointmentThunk({ appointmentId, cancellationReason }));
  }, [dispatch]);

  // ── Optimistic local mutations (no API call) ───────────────────────────────

  // Apply a partial update to a list item immediately (e.g. after a WebSocket push).
  const updateInList = useCallback((appointment) => {
    dispatch(updateAppointmentInList(appointment));
  }, [dispatch]);

  // Remove an item from the list without an API call (e.g. after optimistic delete).
  const removeFromList = useCallback((appointmentId) => {
    dispatch(removeAppointmentFromList(appointmentId));
  }, [dispatch]);

  return {
    appointments,
    pagination,
    filters,
    loading,
    error,
    lastFetched,
    fetch,
    refresh,
    updateFilters,
    resetFilters,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    cancelAppointment,
    updateInList,
    removeFromList,
  };
};

// ─── useAppointmentDetail ─────────────────────────────────────────────────────
// For pages that read or act on a single appointment — clinical sub-pages,
// detail dialogs, and the sidebar appointment card.
//
// Does NOT auto-fetch. Callers decide when to call fetchById(), which skips
// the network if a fresh cache entry exists (see DETAIL_CACHE_TTL in the slice).
//
// Usage:
//   const { currentAppointment, fetchById } = useAppointmentDetail();
//   useEffect(() => { if (id) fetchById(id); }, [id]);
export const useAppointmentDetail = () => {
  const dispatch = useDispatch();

  const currentAppointment    = useSelector(selectCurrentAppointment);
  const selectedAppointmentId = useSelector(selectSelectedAppointmentId);
  const loading               = useSelector(selectAppointmentDetailLoading);

  // Fetch by ID, using the detail cache to skip redundant network calls.
  const fetchById = useCallback((id) => {
    return dispatch(fetchAppointmentById(id));
  }, [dispatch]);

  // Set the active appointment from an already-loaded object — no network call.
  // Use this when the object is already in the list (e.g. clicking a grid card).
  const setAppointment = useCallback((appt) => {
    dispatch(setCurrentAppointment(appt));
  }, [dispatch]);

  // Set only the selected ID when navigating via a link that only has the ID.
  // The destination page is then responsible for calling fetchById().
  const selectById = useCallback((id) => {
    dispatch(setSelectedAppointmentId(id));
  }, [dispatch]);

  // Clear the active appointment and conflicts — dispatched by clinical pages
  // on unmount and by clinicalExamSessionSlice when a session ends.
  const clear = useCallback(() => {
    dispatch(clearCurrentAppointment());
  }, [dispatch]);

  // Evict the cache entry so the next fetchById() bypasses the TTL and hits
  // the network — use after an external update (e.g. a WebSocket event).
  const invalidate = useCallback((id) => {
    dispatch(invalidateAppointmentDetail(id));
  }, [dispatch]);

  return {
    currentAppointment,
    selectedAppointmentId,
    loading,
    fetchById,
    setAppointment,
    selectById,
    clear,
    invalidate,
  };
};

// ─── useScheduleState ─────────────────────────────────────────────────────────
// Manages the operatory schedule page's shared UI state — calendar view/date,
// conflict windows, and the pending tray.
//
// Stored in Redux (not local component state) so ScheduleGridHeader,
// ScheduleCalendar, and LeftPanel can all read and mutate the same state
// without prop drilling through the page component.
//
// Usage:
//   const { selectedDate, setSelectedDate, pendingItems } = useScheduleState();
export const useScheduleState = () => {
  const dispatch = useDispatch();

  const calendarView = useSelector(selectCalendarView);
  const selectedDate = useSelector(selectSelectedDate);
  const conflicts    = useSelector(selectConflicts);
  const pendingItems = useSelector(selectPendingItems);

  return {
    // ── Calendar UI ──────────────────────────────────────────────────────────
    // selectedDate is stored as an ISO string; convert to/from dayjs at the boundary.
    calendarView,
    selectedDate,
    setCalendarView:  useCallback((v) => dispatch(setCalendarView(v)), [dispatch]),
    setSelectedDate:  useCallback((d) => dispatch(setSelectedDate(d)), [dispatch]),

    // ── Conflict detection ────────────────────────────────────────────────────
    // Populated by the booking form when the chosen slot overlaps an existing
    // appointment; cleared when the form dialog closes.
    conflicts,
    setConflicts:   useCallback((c) => dispatch(setConflicts(c)), [dispatch]),
    clearConflicts: useCallback(() => dispatch(clearConflicts()), [dispatch]),

    // ── Pending tray ──────────────────────────────────────────────────────────
    // Items the user has dragged off the schedule grid into the hold area.
    // addPendingItem is idempotent — duplicate IDs are silently ignored.
    pendingItems,
    addPendingItem:    useCallback((item) => dispatch(addPendingItem(item)), [dispatch]),
    removePendingItem: useCallback((id) => dispatch(removePendingItem(id)), [dispatch]),
    clearPendingItems: useCallback(() => dispatch(clearPendingItems()), [dispatch]),
  };
};
