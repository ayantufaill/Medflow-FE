import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { appointmentService } from '../../services/appointment.service';

export const appointmentKeys = {
  all: ['appointments'],
  lists: () => [...appointmentKeys.all, 'list'],
  list: (params) => [...appointmentKeys.lists(), params],
  calendar: (startDate, endDate, providerIds) => [...appointmentKeys.all, 'calendar', { startDate, endDate, providerIds }],
  details: () => [...appointmentKeys.all, 'detail'],
  detail: (id) => [...appointmentKeys.details(), id],
  byPatient: (patientId) => [...appointmentKeys.all, 'byPatient', patientId],
};

export const useAppointments = (options = {}) => {
  const {
    page = 1,
    limit = 10,
    providerId = '',
    patientId = '',
    status = '',
    startDate = '',
    endDate = '',
    appointmentTypeId = '',
    search = '',
    enabled = true
  } = options;

  return useQuery({
    queryKey: appointmentKeys.list({ page, limit, providerId, patientId, status, startDate, endDate, appointmentTypeId, search }),
    queryFn: () => appointmentService.getAllAppointments(
      page,
      limit,
      providerId,
      patientId,
      status,
      startDate,
      endDate,
      appointmentTypeId,
      search
    ),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAppointmentCalendar = (startDate, endDate, providerIds = [], options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: appointmentKeys.calendar(startDate, endDate, providerIds),
    queryFn: () => appointmentService.getCalendarSchedule(startDate, endDate, providerIds),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAppointmentDetails = (appointmentId, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => appointmentService.getAppointmentById(appointmentId),
    enabled: enabled && !!appointmentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePatientAppointments = (patientId, options = {}) => {
  const { page = 1, limit = 50, enabled = true } = options;
  return useQuery({
    queryKey: [...appointmentKeys.byPatient(patientId), { page, limit }],
    queryFn: () => appointmentService.getAppointmentsByPatient(patientId, page, limit),
    enabled: enabled && !!patientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, updates }) => appointmentService.updateAppointment(appointmentId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data._id || data.id) });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId) => appointmentService.deleteAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, reason }) => appointmentService.cancelAppointment(appointmentId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data._id || data.id) });
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, data }) => appointmentService.rescheduleAppointment(appointmentId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data._id || data.id) });
    },
  });
};

export const useCheckInAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId) => appointmentService.checkInAppointment(appointmentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data._id || data.id) });
    },
  });
};

export const useInvalidateAppointments = () => {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }), [queryClient]);
};
