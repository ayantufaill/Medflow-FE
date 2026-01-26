/**
 * useProviders Hook - React Query
 * 
 * Purpose:
 * Fetches and caches providers data using React Query
 * 
 * Why React Query:
 * - Providers are fetched in 11+ different components
 * - React Query automatically deduplicates these requests
 * - Automatic caching prevents redundant API calls
 * - Background refetching keeps data fresh
 * 
 * Usage:
 * const { data: providers, isLoading } = useProviders({ activeOnly: true });
 * 
 * @author Senior Software Engineer
 */

import { useQuery } from '@tanstack/react-query';
import { providerService } from '../../services/provider.service';

/**
 * Query key factory for providers
 */
export const providerKeys = {
  all: ['providers'] as const,
  lists: () => [...providerKeys.all, 'list'] as const,
  list: (filters) => [...providerKeys.lists(), { filters }] as const,
  details: () => [...providerKeys.all, 'detail'] as const,
  detail: (id) => [...providerKeys.details(), id] as const,
};

/**
 * Fetch providers with optional filters
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 100)
 * @param {string} options.search - Search query
 * @param {boolean} options.activeOnly - Only active providers
 * @param {boolean} options.enabled - Whether query should run (default: true)
 */
export const useProviders = (options = {}) => {
  const { 
    page = 1, 
    limit = 100, 
    search = '', 
    activeOnly = false,
    enabled = true 
  } = options;

  return useQuery({
    queryKey: providerKeys.list({ page, limit, search, activeOnly }),
    queryFn: async () => {
      const result = await providerService.getAllProviders(
        page,
        limit,
        search,
        activeOnly
      );
      return result;
    },
    enabled, // Allow disabling query
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch provider by ID
 */
export const useProvider = (providerId) => {
  return useQuery({
    queryKey: providerKeys.detail(providerId),
    queryFn: async () => {
      if (!providerId) return null;
      const provider = await providerService.getProviderById(providerId);
      return provider;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
  });
};
