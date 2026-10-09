import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBranch } from '../redux/useBranch';
import { patientService } from '../../services/patient.service';
import { practiceInfoService } from '../../services/practice-info.service';
import { resolveHistoryTimeZone } from '../../utils/dateUtils';
import { selectHistoryEvents } from '../../utils/patientHistoryTimeline';

export const patientHistoryTimelineKey = (patientId) => ['patientHistoryTimeline', String(patientId)];

export function usePatientHistoryTimeline(patientId, section) {
  const queryClient = useQueryClient();
  const { currentBranchId } = useBranch();
  const query = useQuery({
    queryKey: patientHistoryTimelineKey(patientId),
    queryFn: () => patientService.getPatientAuditHistory(patientId, { strict: true }),
    enabled: !!patientId,
    staleTime: 0,
  });
  const practice = useQuery({
    queryKey: ['historyTimelinePractice', currentBranchId || 'current'],
    queryFn: () => practiceInfoService.getCurrentPracticeInfo(currentBranchId || undefined),
    enabled: !!patientId,
    staleTime: 0,
    retry: false,
  });
  const timeZone = resolveHistoryTimeZone(practice.data?.timezone);
  return {
    ...query,
    events: selectHistoryEvents(query.data || [], patientId, section),
    timeZone: timeZone || 'UTC',
    timeZoneFallback: !timeZone,
    refresh: () => queryClient.invalidateQueries({ queryKey: patientHistoryTimelineKey(patientId) }),
  };
}
