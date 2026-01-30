/**
 * useUsers Hook - React Query
 * 
 * Purpose:
 * Fetches and caches users data using React Query
 * 
 * Why React Query:
 * - Users are fetched in multiple components
 * - React Query automatically deduplicates requests
 * - Automatic caching prevents redundant API calls
 * - Background refetching keeps data fresh
 * 
 * Usage:
 * const { data: users, isLoading } = useUsersByRole('Doctor', { excludeWithProvider: true });
 * 
 * @author Senior Software Engineer
 */

import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';

/**
 * Query key factory for users
 */
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  byRole: (roleName, filters) => [...userKeys.all, 'byRole', roleName, filters],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

/**
 * Fetch users by role name
 * 
 * @param {string} roleName - Role name (e.g., 'Doctor', 'Admin')
 * @param {Object} options - Query options
 * @param {number} options.limit - Items per page (default: 500)
 * @param {string} options.status - Filter by status ('active' or 'inactive', default: 'active')
 * @param {boolean} options.excludeWithProvider - Exclude users who already have providers (default: false)
 * @param {boolean} options.enabled - Whether query should run (default: true)
 * 
 * Caching strategy:
 * - Stale time: 2 minutes (users can change, but not frequently)
 * - Cache time: 5 minutes (keep in cache for quick access)
 */
export const useUsersByRole = (roleName, options = {}) => {
  const {
    limit = 500,
    status = 'active',
    excludeWithProvider = false,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: userKeys.byRole(roleName, { limit, status, excludeWithProvider }),
    queryFn: async () => {
      const result = await userService.getUsersByRoleName(
        roleName,
        1,
        limit,
        status,
        excludeWithProvider
      );
      return result.users || [];
    },
    enabled: enabled && !!roleName,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    // Don't refetch on window focus for better performance
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch all users with filters
 */
export const useUsers = (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    roleId = '',
    status = '',
    enabled = true,
  } = options;

  return useQuery({
    queryKey: userKeys.list({ page, limit, search, roleId, status }),
    queryFn: async () => {
      const result = await userService.getAllUsers(page, limit, search, roleId, status);
      return result;
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
