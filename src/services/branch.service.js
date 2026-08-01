import apiClient from '../config/api';

/**
 * Branch Service
 * Handles API calls for the practice's branches/locations.
 * GET /branches is scoped server-side to whatever branches the caller's token
 * grants access to (branchAccess middleware) — the frontend doesn't filter further.
 */
export const branchService = {
  async getBranches() {
    const response = await apiClient.get('/branches');
    return response.data.data;
  },

  /**
   * Persists the caller's active branch server-side (their user-preferences blob),
   * so it can follow them across devices. Best-effort — the local/localStorage value
   * in branchSlice.js is already the source of truth for the current session.
   */
  async setCurrentBranch(branchId) {
    const response = await apiClient.patch('/users/me/branch', { branchId });
    return response.data.data;
  },
};
