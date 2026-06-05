import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDentalHistoryThunk,
  updateDentalHistoryThunk,
  selectCurrentDentalHistory,
  selectDentalHistoryLoading,
  selectDentalHistoryError,
} from '../../store/slices/patientSlice';

/**
 * useDentalHistory - hook for patient dental history
 * 
 * Usage:
 * const { dentalHistory, loading, error, fetch, update } = useDentalHistory();
 */
export const useDentalHistory = () => {
  const dispatch = useDispatch();
  const dentalHistory = useSelector(selectCurrentDentalHistory);
  const loading = useSelector(selectDentalHistoryLoading);
  const error = useSelector(selectDentalHistoryError);

  const fetch = useCallback((patientId) => {
    return dispatch(fetchDentalHistoryThunk(patientId));
  }, [dispatch]);

  const update = useCallback((patientId, payload) => {
    return dispatch(updateDentalHistoryThunk({ patientId, payload }));
  }, [dispatch]);

  return {
    dentalHistory,
    loading,
    error,
    fetch,
    update,
  };
};
