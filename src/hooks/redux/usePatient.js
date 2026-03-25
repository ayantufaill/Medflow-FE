import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPatients,
  fetchPatientById,
  fetchPatientInsurances,
  selectPatientList,
  selectPatientPagination,
  selectPatientFilters,
  selectPatientListLoading,
  selectPatientListError,
  selectCurrentPatient,
  selectSelectedPatientId,
  selectPatientDetailLoading,
  selectPatientDetailError,
  selectPatientLastFetched,
  selectPatientInsurancesCache,
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
} from '../../store/slices/patientSlice';

/**
 * usePatients - hook for patient list with caching
 * 
 * Usage:
 * const { patients, pagination, loading, error, fetch, refetch } = usePatients();
 */
export const usePatients = () => {
  const dispatch = useDispatch();
  const patients = useSelector(selectPatientList);
  const pagination = useSelector(selectPatientPagination);
  const filters = useSelector(selectPatientFilters);
  const loading = useSelector(selectPatientListLoading);
  const error = useSelector(selectPatientListError);
  const lastFetched = useSelector(selectPatientLastFetched);

  const fetch = useCallback((params = {}) => {
    return dispatch(fetchPatients(params));
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(invalidatePatients());
    return dispatch(fetchPatients({
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

  const updateInList = useCallback((patient) => {
    dispatch(updatePatientInList(patient));
  }, [dispatch]);

  const removeFromList = useCallback((patientId) => {
    dispatch(removePatientFromList(patientId));
  }, [dispatch]);

  return {
    patients,
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
 * usePatient - hook for single patient with caching
 * 
 * Usage:
 * const { patient, loading, error, setPatient } = usePatient();
 */
export const usePatient = () => {
  const dispatch = useDispatch();
  const currentPatient = useSelector(selectCurrentPatient);
  const selectedPatientId = useSelector(selectSelectedPatientId);
  const loading = useSelector(selectPatientDetailLoading);
  const error = useSelector(selectPatientDetailError);

  const fetchById = useCallback((patientId) => {
    return dispatch(fetchPatientById(patientId));
  }, [dispatch]);

  const setPatient = useCallback((patient) => {
    dispatch(setCurrentPatient(patient));
  }, [dispatch]);

  const setPatientId = useCallback((id) => {
    dispatch(setSelectedPatientId(id));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearCurrentPatient());
  }, [dispatch]);

  const invalidate = useCallback((patientId) => {
    dispatch(invalidatePatientDetail(patientId));
  }, [dispatch]);

  return {
    currentPatient,
    selectedPatientId,
    loading,
    error,
    fetchById,
    setPatient,
    setPatientId,
    clear,
    invalidate,
  };
};

/**
 * usePatientInsurances - hook for patient insurances with caching
 */
export const usePatientInsurances = () => {
  const dispatch = useDispatch();
  const cache = useSelector(selectPatientInsurancesCache);

  const fetchInsurances = useCallback((patientId, activeOnly = false) => {
    return dispatch(fetchPatientInsurances({ patientId, activeOnly }));
  }, [dispatch]);

  const getInsurances = useCallback((patientId) => {
    const cached = cache[patientId];
    if (!cached) return null;
    if ((Date.now() - cached.timestamp) > 5 * 60 * 1000) return null; // Expired
    return cached.data;
  }, [cache]);

  const invalidate = useCallback((patientId) => {
    dispatch(invalidatePatientInsurances(patientId));
  }, [dispatch]);

  return { fetchInsurances, getInsurances, invalidate, cache };
};
