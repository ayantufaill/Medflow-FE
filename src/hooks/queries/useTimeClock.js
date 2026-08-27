import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeClockService } from '../../services/timeclock.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

export const timeClockKeys = {
  all: ['timeclock'],
  timesheets: () => [...timeClockKeys.all, 'timesheets'],
  timesheetList: (filters) => [...timeClockKeys.timesheets(), filters],
};

export const useTimesheets = (dateRange, startDate, endDate, options = {}) => {
  return useQuery({
    queryKey: timeClockKeys.timesheetList({ dateRange, startDate, endDate }),
    queryFn: async () => {
      return await timeClockService.getTimesheets(dateRange, startDate, endDate);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options
  });
};

export const useAddTimeClockRecord = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload) => timeClockService.addTimeClockRecord(payload),
    onSuccess: () => {
      showSnackbar('Time clock record added successfully', 'success');
      queryClient.invalidateQueries({ queryKey: timeClockKeys.timesheets() });
    },
    onError: (error) => {
      showSnackbar(error.response?.data?.error?.message || 'Failed to add time clock record', 'error');
    },
  });
};
