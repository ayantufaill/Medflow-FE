import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../services/patient.service';

export const patientKeys = {
  all: ['patients'],
  lists: () => [...patientKeys.all, 'list'],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, 'detail'],
  detail: (id) => [...patientKeys.details(), id],
};

export const usePatients = (options = {}) => {
  const { page = 1, limit = 100, search = '', status = 'active', enabled = true } = options;

  return useQuery({
    queryKey: patientKeys.list({ page, limit, search, status }),
    queryFn: async () => {
      const result = await patientService.getAllPatients(page, limit, search, status);
      return result.patients || [];
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePatient = (patientId) => {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => patientService.getPatientById(patientId),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
