import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { patientService } from '../../services/patient.service';

export const patientKeys = {
  all: ['patients'],
  lists: () => [...patientKeys.all, 'list'],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, 'detail'],
  detail: (id) => [...patientKeys.details(), id],
};

// Task 4.H.2 requires explicit export of PatientQueryKeys alias
export const PatientQueryKeys = patientKeys;

export const usePatients = (options = {}) => {
  const { page = 1, limit = 100, search = '', status = 'active', enabled = true } = options;

  return useQuery({
    queryKey: patientKeys.list({ page, limit, search, status }),
    queryFn: async () => {
      const result = await patientService.getAllPatients(page, limit, search, status);
      return result.patients || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePatient = (patientId, { includeSsn = false } = {}) => {
  return useQuery({
    queryKey: includeSsn
      ? [...patientKeys.detail(patientId), 'with-ssn']
      : patientKeys.detail(patientId),
    queryFn: () => patientService.getPatientById(patientId, includeSsn),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => patientService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, updates }) => patientService.updatePatient(patientId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.patientId) });
    },
  });
};

export const useInvalidatePatients = () => {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.invalidateQueries({ queryKey: patientKeys.all }), [queryClient]);
};
