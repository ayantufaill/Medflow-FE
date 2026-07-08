import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services/appointment.service';

export const patientAppointmentKeys = {
  all: ['patientAppointments'],
  list: (patientId, limit) => [...patientAppointmentKeys.all, patientId, { limit }],
};

/**
 * A patient's own appointment history — drives the Medical History page's
 * visit timeline (each node = one real appointment, not a generic
 * "documented clinical activity" date).
 */
export const usePatientAppointments = (patientId, limit = 20) => {
  return useQuery({
    queryKey: patientAppointmentKeys.list(patientId, limit),
    queryFn: () => appointmentService.getPatientAppointments(patientId, limit),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
