import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalSignService } from '../../services/vital-sign.service';

export const vitalSignKeys = {
  all: ['vitalSigns'],
  lists: () => [...vitalSignKeys.all, 'list'],
  list: (page, limit, filters) => [...vitalSignKeys.lists(), { page, limit, ...filters }],
  byPatient: (patientId, page, limit, filters) => [
    ...vitalSignKeys.lists(),
    'patient',
    patientId,
    { page, limit, ...filters },
  ],
  latest: (patientId) => [...vitalSignKeys.all, 'latest', patientId],
  trend: (patientId, days) => [...vitalSignKeys.all, 'trend', patientId, { days }],
  details: () => [...vitalSignKeys.all, 'detail'],
  detail: (id) => [...vitalSignKeys.details(), id],
  normalRanges: () => [...vitalSignKeys.all, 'normalRanges'],
};

export const useVitalSigns = (page, limit, filters) => {
  return useQuery({
    queryKey: vitalSignKeys.list(page, limit, filters),
    queryFn: () => vitalSignService.getAllVitalSigns(page, limit, filters),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePatientVitalSigns = (patientId, page, limit, filters = {}) => {
  return useQuery({
    queryKey: vitalSignKeys.byPatient(patientId, page, limit, filters),
    queryFn: () => vitalSignService.getVitalSignsByPatient(patientId, page, limit, filters),
    enabled: !!patientId,
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLatestPatientVitals = (patientId) => {
  return useQuery({
    queryKey: vitalSignKeys.latest(patientId),
    queryFn: () => vitalSignService.getLatestVitalsByPatient(patientId),
    enabled: !!patientId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePatientVitalsTrend = (patientId, days) => {
  return useQuery({
    queryKey: vitalSignKeys.trend(patientId, days),
    queryFn: () => vitalSignService.getVitalsTrend(patientId, days),
    enabled: !!patientId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVitalNormalRanges = () => {
  return useQuery({
    queryKey: vitalSignKeys.normalRanges(),
    queryFn: () => vitalSignService.getNormalRanges(),
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateVitalSign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vitalSignService.createVitalSign(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vitalSignKeys.lists() });
      if (variables.patientId) {
        queryClient.invalidateQueries({
          queryKey: vitalSignKeys.latest(variables.patientId),
        });
        queryClient.invalidateQueries({
          queryKey: vitalSignKeys.trend(variables.patientId),
        });
      }
    },
  });
};

export const useDeleteVitalSign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vitalSignId) => vitalSignService.deleteVitalSign(vitalSignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vitalSignKeys.lists() });
    },
  });
};
