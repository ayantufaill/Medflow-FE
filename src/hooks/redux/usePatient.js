/**
 * usePatient Hook - Redux + React Query Integration
 * 
 * Purpose:
 * Combines Redux state (current patient) with React Query (patient data fetching)
 * 
 * Architecture Pattern:
 * - Redux: Manages current patient selection and filters
 * - React Query: Fetches and caches patient data from API
 * - This hook: Bridges both for seamless component usage
 * 
 * Why this pattern:
 * - Redux manages which patient is selected (application state)
 * - React Query manages patient data fetching (server state)
 * - Components get both in one hook
 * 
 * @author Senior Software Engineer
 */

import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  selectCurrentPatient,
  selectSelectedPatientId,
  selectPatientFilters,
  setCurrentPatient,
  setSelectedPatientId,
} from '../../store/slices/patientSlice';
import { patientService } from '../../services/patient.service';

/**
 * Patient query keys
 */
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (filters) => [...patientKeys.lists(), { filters }] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id) => [...patientKeys.details(), id] as const,
};

/**
 * Hook for managing current patient
 * 
 * Returns:
 * - currentPatient: Patient from Redux (if already loaded)
 * - patientData: Patient from React Query (fresh from API)
 * - isLoading: Loading state
 * - error: Error state
 * - setPatient: Function to set current patient
 * 
 * Usage:
 * const { currentPatient, patientData, isLoading, setPatient } = usePatient();
 */
export const usePatient = () => {
  const dispatch = useDispatch();
  
  // Get current patient from Redux
  const currentPatient = useSelector(selectCurrentPatient);
  const selectedPatientId = useSelector(selectSelectedPatientId);
  const filters = useSelector(selectPatientFilters);
  
  // Fetch patient data using React Query
  const {
    data: patientData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: patientKeys.detail(selectedPatientId),
    queryFn: async () => {
      if (!selectedPatientId) return null;
      const patient = await patientService.getPatientById(selectedPatientId);
      return patient;
    },
    enabled: !!selectedPatientId, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Set patient in Redux
  const setPatient = (patient) => {
    dispatch(setCurrentPatient(patient));
    if (patient?._id || patient?.id) {
      dispatch(setSelectedPatientId(patient._id || patient.id));
    }
  };
  
  // Set patient ID (triggers React Query fetch)
  const setPatientId = (patientId) => {
    dispatch(setSelectedPatientId(patientId));
  };
  
  return {
    // Use patientData from React Query if available, fallback to Redux
    currentPatient: patientData || currentPatient,
    patientData,
    selectedPatientId,
    filters,
    isLoading,
    error,
    setPatient,
    setPatientId,
    refetch,
  };
};
