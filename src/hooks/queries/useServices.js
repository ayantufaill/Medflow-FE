import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceCatalogService } from '../../services/service-catalog.service';

export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (options) => [...serviceKeys.lists(), options],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id) => [...serviceKeys.details(), id],
  categories: () => [...serviceKeys.all, 'categories'],
};

// Task 4.H.3 requires explicit export of ServiceQueryKeys alias
export const ServiceQueryKeys = serviceKeys;

export const useServices = (options = {}, queryOptions = {}) => {
  return useQuery({
    queryKey: serviceKeys.list(options),
    queryFn: () => serviceCatalogService.getAllServices(options),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
};

export const useService = (serviceId, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => serviceCatalogService.getServiceById(serviceId),
    enabled: enabled && !!serviceId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useServiceCategories = () => {
  return useQuery({
    queryKey: serviceKeys.categories(),
    queryFn: () => serviceCatalogService.getCategories(),
    staleTime: 10 * 60 * 1000, // Categories don't change often
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => serviceCatalogService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, updates }) => serviceCatalogService.updateService(serviceId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(data.id) });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId) => serviceCatalogService.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
};

export const useToggleServiceActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId) => serviceCatalogService.toggleServiceStatus(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
};
