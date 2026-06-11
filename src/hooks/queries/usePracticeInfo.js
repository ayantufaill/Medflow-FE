import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { practiceInfoService } from '../../services/practice-info.service';

export const practiceKeys = {
  all: ['practiceInfo'],
  current: () => [...practiceKeys.all, 'current'],
  details: () => [...practiceKeys.all, 'detail'],
  detail: (id) => [...practiceKeys.details(), id],
};

export const usePracticeInfo = (options = {}) => {
  return useQuery({
    queryKey: practiceKeys.current(),
    queryFn: () => practiceInfoService.getCurrentPracticeInfo(),
    staleTime: 5 * 60 * 1000, // Practice info rarely changes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreatePracticeInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => practiceInfoService.createPracticeInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.all });
    },
  });
};

export const useUpdatePracticeInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ practiceId, updates }) => practiceInfoService.updatePracticeInfo(practiceId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.all });
    },
  });
};
