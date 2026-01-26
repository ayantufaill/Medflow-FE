import apiClient from '../config/api';

/**
 * Role Service
 * Handles all role-related API calls
 */

export const roleService = {
  /**
   * Get all roles
   * @returns {Promise<Array>} Array of role objects
   */
  async getAllRoles() {
    try {
      const response = await apiClient.get('/roles');
      return response.data.data.roles || response.data.data || [];
    } catch (error) {
      // If the endpoint requires authentication and user is not logged in,
      // we'll return an empty array and handle it in the component
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Roles endpoint requires authentication. Returning empty array.');
        return [];
      }
      throw error;
    }
  },

  /**
   * Get role by ID
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Role object
   */
  async getRoleById(roleId) {
    const response = await apiClient.get(`/roles/${roleId}`);
    return response.data.data.role || response.data.data;
  },
};

