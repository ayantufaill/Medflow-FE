import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPatientInsurances,
  createPatientInsuranceThunk,
  updatePatientInsuranceThunk,
  deletePatientInsuranceThunk,
  selectPatientInsurancesCache,
} from '../../store/slices/patientSlice';

export const usePatientInsurance = (patientId) => {
  const dispatch = useDispatch();
  
  const cache = useSelector(selectPatientInsurancesCache);
  const insurances = cache[patientId]?.data || [];

  const fetch = useCallback((activeOnly = false, force = true) => {
    if (!patientId) return;
    return dispatch(fetchPatientInsurances({ patientId, activeOnly, force }));
  }, [dispatch, patientId]);

  const create = useCallback((payload) => {
    if (!patientId) return;
    return dispatch(createPatientInsuranceThunk({ patientId, payload }));
  }, [dispatch, patientId]);

  const update = useCallback((insuranceId, payload) => {
    if (!patientId) return;
    return dispatch(updatePatientInsuranceThunk({ patientId, insuranceId, payload }));
  }, [dispatch, patientId]);

  const remove = useCallback((insuranceId) => {
    if (!patientId) return;
    return dispatch(deletePatientInsuranceThunk({ patientId, insuranceId }));
  }, [dispatch, patientId]);

  return {
    insurances,
    fetch,
    create,
    update,
    remove,
  };
};
