import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treatmentPlanService } from '../../services/treatment-plan.service';

export const treatmentPlanKeys = {
  all: ['treatmentPlans'],
  lists: () => [...treatmentPlanKeys.all, 'list'],
  list: (patientId) => [...treatmentPlanKeys.lists(), { patientId }],
  details: () => [...treatmentPlanKeys.all, 'detail'],
  detail: (id) => [...treatmentPlanKeys.details(), id],
};

/**
 * Hook to fetch treatment plans, optionally filtered by patientId
 */
export const useTreatmentPlansQuery = (patientId) => {
  return useQuery({
    queryKey: treatmentPlanKeys.list(patientId),
    queryFn: () => treatmentPlanService.getAll({ patientId }),
    enabled: !!patientId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch a single treatment plan by ID
 */
export const useTreatmentPlanDetailsQuery = (id) => {
  return useQuery({
    queryKey: treatmentPlanKeys.detail(id),
    queryFn: () => treatmentPlanService.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to create a treatment plan
 */
export const useCreateTreatmentPlan = (patientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => treatmentPlanService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: treatmentPlanKeys.list(patientId),
      });
    },
  });
};

/**
 * Hook to update an existing treatment plan
 */
export const useUpdateTreatmentPlan = (patientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => treatmentPlanService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: treatmentPlanKeys.list(patientId),
      });
      queryClient.invalidateQueries({
        queryKey: treatmentPlanKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to delete a treatment plan
 */
export const useDeleteTreatmentPlan = (patientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => treatmentPlanService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: treatmentPlanKeys.list(patientId),
      });
    },
  });
};
