import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAppointments,
  invalidateAppointments,
  selectAppointmentList,
  selectAppointmentListLoading,
  selectAppointmentListError,
  createAppointmentThunk,
  updateAppointmentThunk,
} from '../../store/slices/appointmentSlice';

export const useAppointments = (filters = {}) => {
  const dispatch = useDispatch();
  
  const appointments = useSelector(selectAppointmentList);
  const loading = useSelector(selectAppointmentListLoading);
  const error = useSelector(selectAppointmentListError);

  const fetch = useCallback((overrideFilters = {}) => {
    return dispatch(fetchAppointments({ ...filters, ...overrideFilters }));
  }, [dispatch, JSON.stringify(filters)]);

  const refresh = useCallback((overrideFilters = {}) => {
    dispatch(invalidateAppointments());
    return dispatch(fetchAppointments({ ...filters, ...overrideFilters }));
  }, [dispatch, JSON.stringify(filters)]);

  // Auto-fetch on mount if filters are provided (and conditions in thunk allow it)
  useEffect(() => {
    fetch();
  }, [fetch]);

  const createAppointment = useCallback((payload) => {
    return dispatch(createAppointmentThunk(payload));
  }, [dispatch]);

  const updateAppointment = useCallback((appointmentId, payload) => {
    return dispatch(updateAppointmentThunk({ appointmentId, payload }));
  }, [dispatch]);

  return {
    appointments,
    loading,
    error,
    fetch,
    refresh,
    createAppointment,
    updateAppointment,
  };
};
