import { useQuery } from '@tanstack/react-query';
import { patientReportService } from '../../services/patient-report.service';

export const usePatientReport = (patientId, appointmentId) => {
  return useQuery({
    queryKey: ['patientReport', patientId, appointmentId],
    queryFn: async () => {
      console.log('[usePatientReport] Fetching report for patientId:', patientId, 'appointmentId:', appointmentId);
      try {
        const data = await patientReportService.getReport(patientId, appointmentId);
        console.log('[usePatientReport] Report data received:', data);
        return data;
      } catch (error) {
        console.error('[usePatientReport] API error:', error?.response?.status, error?.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
