import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAppointments,
  fetchAppointmentById,
  selectAppointmentList,
  selectAppointmentPagination,
  selectAppointmentFilters,
  selectAppointmentListLoading,
  selectAppointmentListError,
  selectAppointmentLastFetched,
  selectCurrentAppointment,
  selectSelectedAppointmentId,
  selectAppointmentDetailLoading,
  selectCalendarView,
  selectSelectedDate,
  selectConflicts,
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
} from '../../store/slices/appointmentSlice';

/**
 * useAppointments - hook for appointment list
 */
export const useAppointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointmentList);
  const pagination = useSelector(selectAppointmentPagination);
  const filters = useSelector(selectAppointmentFilters);
  const loading = useSelector(selectAppointmentListLoading);
  const error = useSelector(selectAppointmentListError);
  const lastFetched = useSelector(selectAppointmentLastFetched);

  const fetch = useCallback((params = {}) => {
    return dispatch(fetchAppointments(params));
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(invalidateAppointments());
    return dispatch(fetchAppointments({
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const updateInList = useCallback((appointment) => {
    dispatch(updateAppointmentInList(appointment));
  }, [dispatch]);

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
    refetch,
    updateFilters,
    resetFilters,
    updateInList,
    removeFromList,
  };
};

/**
 * useAppointment - hook for single appointment + calendar state
 */
export const useAppointment = () => {
  const dispatch = useDispatch();
  const currentAppointment = useSelector(selectCurrentAppointment);
  const selectedAppointmentId = useSelector(selectSelectedAppointmentId);
  const loading = useSelector(selectAppointmentDetailLoading);
  const calendarView = useSelector(selectCalendarView);
  const selectedDate = useSelector(selectSelectedDate);
  const conflicts = useSelector(selectConflicts);

  const fetchById = useCallback((id) => {
    return dispatch(fetchAppointmentById(id));
  }, [dispatch]);

  const setAppointment = useCallback((appt) => {
    dispatch(setCurrentAppointment(appt));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearCurrentAppointment());
  }, [dispatch]);

  const invalidate = useCallback((id) => {
    dispatch(invalidateAppointmentDetail(id));
  }, [dispatch]);

  return {
    currentAppointment,
    selectedAppointmentId,
    loading,
    calendarView,
    selectedDate,
    conflicts,
    fetchById,
    setAppointment,
    clear,
    invalidate,
    setCalendarView: (v) => dispatch(setCalendarView(v)),
    setSelectedDate: (d) => dispatch(setSelectedDate(d)),
    setConflicts: (c) => dispatch(setConflicts(c)),
    clearConflicts: () => dispatch(clearConflicts()),
  };
};
