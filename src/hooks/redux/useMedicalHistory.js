import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMedicalHistoryThunk,
  updateMedicalHistoryThunk,
  uploadMedicalDocumentThunk,
  selectCurrentMedicalHistory,
  selectMedicalHistoryLoading,
  selectMedicalHistoryError,
} from '../../store/slices/patientSlice';

/**
 * useMedicalHistory - hook for patient medical history
 * 
 * Usage:
 * const { medicalHistory, loading, error, fetch, update, uploadDocument } = useMedicalHistory();
 */
export const useMedicalHistory = () => {
  const dispatch = useDispatch();
  const medicalHistory = useSelector(selectCurrentMedicalHistory);
  const loading = useSelector(selectMedicalHistoryLoading);
  const error = useSelector(selectMedicalHistoryError);

  const fetch = useCallback((patientId) => {
    return dispatch(fetchMedicalHistoryThunk(patientId));
  }, [dispatch]);

  const update = useCallback((patientId, payload) => {
    return dispatch(updateMedicalHistoryThunk({ patientId, payload }));
  }, [dispatch]);

  const uploadDocument = useCallback((formData) => {
    return dispatch(uploadMedicalDocumentThunk(formData));
  }, [dispatch]);

  return {
    medicalHistory,
    loading,
    error,
    fetch,
    update,
    uploadDocument,
  };
};
