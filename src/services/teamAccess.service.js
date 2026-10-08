import apiClient from '../config/api';

/**
 * Team Access Service
 * Per-user module access set by a group_admin / branch_admin for their team.
 *
 * Overrides only: `moduleAccess` { [moduleKey]: 'none' | 'view' | 'full' } and the
 * narrower `featureAccess` { [featureKey]: true | false }, which wins over the module.
 * Anything left out follows the user's role.
 */
export const teamAccessService = {
  async getTeamMembers(branchId = '') {
    const params = new URLSearchParams({ page: 1, limit: 100, status: 'active' });
    if (branchId) params.append('branchId', branchId);
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data.data?.users || [];
  },

  /**
   * { moduleAccess, featureAccess, modules: [{ key, label, description, levels,
   *   roleDefault, roleDefaultLevel, maxLevel, features: [{ key, label, kind, roleDefault, canGrant }] }] }
   */
  async getModuleAccess(userId) {
    const response = await apiClient.get(`/users/${userId}/module-access`);
    return response.data.data;
  },

  /** Replaces both maps; returns the saved { moduleAccess, featureAccess }. */
  async updateModuleAccess(userId, { moduleAccess, featureAccess }) {
    const response = await apiClient.put(`/users/${userId}/module-access`, { moduleAccess, featureAccess });
    return response.data.data;
  },
};
