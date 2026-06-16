import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicalExamService } from '../../services/clinical-exam.service';

export const clinicalExamKeys = {
  all: ['clinicalExams'],
  details: () => [...clinicalExamKeys.all, 'detail'],
  detail: (examType, appointmentId) => [...clinicalExamKeys.details(), examType, appointmentId],
};

/**
 * Hook to fetch clinical exam findings
 */
export const useClinicalExamQuery = (examType, appointmentId) => {
  return useQuery({
    queryKey: clinicalExamKeys.detail(examType, appointmentId),
    queryFn: () => clinicalExamService.getExam(examType, appointmentId),
    enabled: !!examType && !!appointmentId,
    staleTime: 30 * 1000, // cache for 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry if record doesn't exist
  });
};

/**
 * Hook to upsert (create/update) clinical exam findings
 */
export const useUpsertClinicalExam = (examType, appointmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => clinicalExamService.upsertExam(examType, appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: clinicalExamKeys.detail(examType, appointmentId),
      });
    },
  });
};

/**
 * Hook to sign/lock clinical exam
 */
export const useSignClinicalExam = (examType, appointmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clinicalExamService.signExam(examType, appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: clinicalExamKeys.detail(examType, appointmentId),
      });
    },
  });
};
