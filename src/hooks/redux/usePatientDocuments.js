import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPatientDocumentsThunk,
  deleteDocumentThunk,
  selectPatientDocumentsCache,
  selectPatientDocumentsLoading,
  selectPatientDocumentsError,
} from '../../store/slices/documentSlice';

export const usePatientDocuments = (patientId) => {
  const dispatch = useDispatch();
  
  const cache = useSelector(selectPatientDocumentsCache);
  const documents = cache[patientId]?.data || [];
  
  const loading = useSelector(selectPatientDocumentsLoading);
  const error = useSelector(selectPatientDocumentsError);

  const fetch = useCallback((page = 1, limit = 50) => {
    if (!patientId) return;
    return dispatch(fetchPatientDocumentsThunk({ patientId, page, limit }));
  }, [dispatch, patientId]);

  const remove = useCallback((documentId) => {
    if (!patientId || !documentId) return;
    return dispatch(deleteDocumentThunk({ documentId, patientId }));
  }, [dispatch, patientId]);

  return {
    documents,
    loading,
    error,
    fetch,
    remove,
  };
};
