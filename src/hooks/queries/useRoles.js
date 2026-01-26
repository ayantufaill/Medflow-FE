/**
 * useRoles Hook - React Query
 * 
 * Purpose:
 * Fetches and caches roles data using React Query
 * 
 * Why React Query instead of Redux:
 * - Roles are server data that needs caching
 * - Multiple components need roles (UsersListPage, CreateUserPage, etc.)
 * - React Query automatically deduplicates requests
 * - No need for complex state management - just cache the API response
 * 
 * Usage:
 * const { data: roles, isLoading, error } = useRoles();
 * 
 * @author Senior Software Engineer
 */

import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services/role.service';

/**
 * Query key factory for roles
 * Centralized query keys prevent typos and enable easy invalidation
 */
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters) => [...roleKeys.lists(), { filters }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id) => [...roleKeys.details(), id] as const,
};

/**
 * Fetch all roles
 * 
 * Caching strategy:
 * - Stale time: 10 minutes (roles rarely change)
 * - Cache time: 30 minutes (keep in cache longer)
 * - Refetch on mount: Only if stale
 */
export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.all,
    queryFn: async () => {
      const roles = await roleService.getAllRoles();
      return roles;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (roles don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Fetch role by ID
 */
export const useRole = (roleId) => {
  return useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: async () => {
      if (!roleId) return null;
      const role = await roleService.getRoleById(roleId);
      return role;
    },
    enabled: !!roleId, // Only fetch if roleId is provided
    staleTime: 10 * 60 * 1000,
  });
};
