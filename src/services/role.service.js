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
      console.error("Roles fetch error:", error);
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

  /**
   * Create a new role
   * @param {Object} roleData - Role data (name, description, defaultRole)
   * @returns {Promise<Object>} Created role object
   */
  async createRole(roleData) {
    const response = await apiClient.post('/roles', roleData);
    return response.data.data.role || response.data.data;
  },

  /**
   * Update an existing role
   * @param {string} roleId - Role ID to update
   * @param {Object} roleData - Updated role data
   * @returns {Promise<Object>} Updated role object
   */
  async updateRole(roleId, roleData) {
    const response = await apiClient.put(`/roles/${roleId}`, roleData);
    return response.data.data.role || response.data.data;
  },

  /**
   * Delete a role
   * @param {string} roleId - Role ID to delete
   * @returns {Promise<Object>} Response data
   */
  async deleteRole(roleId) {
    const response = await apiClient.delete(`/roles/${roleId}`);
    return response.data;
  },
};

