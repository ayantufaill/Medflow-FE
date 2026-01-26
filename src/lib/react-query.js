/**
 * React Query Configuration
 * 
 * Architecture Decision:
 * - Using React Query (TanStack Query) for server state management
 * - Handles API data fetching, caching, and synchronization
 * - Eliminates redundant API calls through automatic request deduplication
 * - Provides background refetching, optimistic updates, and error handling
 * 
 * Why React Query for API Data:
 * 1. Automatic caching - No manual cache management needed
 * 2. Request deduplication - Multiple components calling same query = one API call
 * 3. Background refetching - Keeps data fresh automatically
 * 4. Optimistic updates - Better UX for mutations
 * 5. Built-in loading/error states - Reduces boilerplate
 * 
 * Separation of Concerns:
 * - Redux: Application state (complex interactions, shared state)
 * - React Query: Server state (API data, caching)
 * - Context API: Simple global state (auth, notifications)
 * 
 * @author Senior Software Engineer
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient Configuration
 * 
 * Default options optimized for healthcare application:
 * - Stale time: 5 minutes (data considered fresh for 5 min)
 * - Cache time: 10 minutes (data kept in cache for 10 min after unused)
 * - Retry: 1 time for failed requests (healthcare data should fail fast)
 * - Refetch on window focus: false (prevents unnecessary refetches)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      // Prevents unnecessary refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Data kept in cache for 10 minutes after last use
      // Allows instant display when navigating back
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry failed requests once
      // Healthcare apps should fail fast, not retry indefinitely
      retry: 1,
      
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus
      // Prevents unnecessary API calls when user switches tabs
      refetchOnWindowFocus: false,
      
      // Don't refetch on reconnect
      // Prevents API spam when network reconnects
      refetchOnReconnect: false,
      
      // Refetch on mount if data is stale
      // Ensures fresh data when component mounts
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

export default queryClient;
