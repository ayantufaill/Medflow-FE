import { useQuery } from '@tanstack/react-query';
import { appointmentTypeService } from '../../services/appointment-type.service';

export const appointmentTypeKeys = {
  all: ['appointmentTypes'],
  lists: () => [...appointmentTypeKeys.all, 'list'],
  list: (filters) => [...appointmentTypeKeys.lists(), { filters }],
  details: () => [...appointmentTypeKeys.all, 'detail'],
  detail: (id) => [...appointmentTypeKeys.details(), id],
};

/**
 * Fetch appointment types with pagination, search, and status filter.
 * @param {Object} options
 * @param {number}        options.page
 * @param {number}        options.limit
 * @param {string}        options.search
 * @param {boolean|null}  options.isActive  — true = active only, false = inactive only, null = all
 */
export const useAppointmentTypes = (options = {}) => {
  const { page = 1, limit = 100, search = '', isActive = null } = options;

  return useQuery({
    queryKey: appointmentTypeKeys.list({ page, limit, search, isActive }),
    queryFn: () =>
      appointmentTypeService.getAllAppointmentTypes(page, limit, search, isActive),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAppointmentType = (appointmentTypeId) => {
  return useQuery({
    queryKey: appointmentTypeKeys.detail(appointmentTypeId),
    queryFn: () => appointmentTypeService.getAppointmentTypeById(appointmentTypeId),
    enabled: !!appointmentTypeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
