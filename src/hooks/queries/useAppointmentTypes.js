/**
 * useAppointmentTypes Hook - React Query
 * 
 * Purpose:
 * Fetches and caches appointment types data
 * 
 * Why React Query:
 * - Appointment types are used in multiple forms and pages
 * - Static data that benefits from caching
 * - Automatic request deduplication
 * 
 * @author Senior Software Engineer
 */

import { useQuery } from '@tanstack/react-query';
import { appointmentTypeService } from '../../services/appointment-type.service';

/**
 * Query key factory for appointment types
 */
export const appointmentTypeKeys = {
  all: ['appointmentTypes'] as const,
  lists: () => [...appointmentTypeKeys.all, 'list'] as const,
  list: (filters) => [...appointmentTypeKeys.lists(), { filters }] as const,
  details: () => [...appointmentTypeKeys.all, 'detail'] as const,
  detail: (id) => [...appointmentTypeKeys.details(), id] as const,
};

/**
 * Fetch all appointment types
 */
export const useAppointmentTypes = (options = {}) => {
  const { page = 1, limit = 100, search = '', activeOnly = false } = options;

  return useQuery({
    queryKey: appointmentTypeKeys.list({ page, limit, search, activeOnly }),
    queryFn: async () => {
      const result = await appointmentTypeService.getAllAppointmentTypes(
        page,
        limit,
        search,
        activeOnly
      );
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (appointment types rarely change)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Fetch appointment type by ID
 */
export const useAppointmentType = (appointmentTypeId) => {
  return useQuery({
    queryKey: appointmentTypeKeys.detail(appointmentTypeId),
    queryFn: async () => {
      if (!appointmentTypeId) return null;
      const appointmentType = await appointmentTypeService.getAppointmentTypeById(
        appointmentTypeId
      );
      return appointmentType;
    },
    enabled: !!appointmentTypeId,
    staleTime: 10 * 60 * 1000,
  });
};
