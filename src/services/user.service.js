import apiClient from '../config/api';

/**
 * User Service
 * Handles all user-related API calls
 */

export const userService = {
  /**
   * Get all users (Admin only)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query (searches email, firstName, lastName, phone)
   * @param {string} roleId - Filter by role ID
   * @param {string} status - Filter by status ('active' or 'inactive')
   * @returns {Promise<Object>} Users data with pagination
   */
  async getAllUsers(
    page = 1,
    limit = 10,
    search = '',
    roleId = '',
    status = ''
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (roleId) params.append('roleId', roleId);
    if (status) params.append('status', status);

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get users by role name (Admin only)
   * @param {string} roleName - Role name (e.g., 'Doctor', 'Admin')
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Filter by status ('active' or 'inactive')
   * @param {boolean} excludeWithProvider - If true, exclude users who already have provider records
   * @returns {Promise<Object>} Users data with pagination
   */
  async getUsersByRoleName(roleName, page = 1, limit = 100, status = 'active', excludeWithProvider = false) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    if (excludeWithProvider) params.append('excludeWithProvider', 'true');

    const response = await apiClient.get(
      `/users/by-role/${encodeURIComponent(roleName)}?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data.user;
  },

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updates - User update data
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, updates) {
    const response = await apiClient.put(`/users/${userId}`, updates);
    return response.data.data.user;
  },

  /**
   * Update own profile
   * @param {Object} updates - Profile update data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(updates) {
    const response = await apiClient.put('/users/profile/me', updates);
    return response.data.data.user;
  },

  /**
   * Assign role to user (Admin only)
   * @param {string} userId - User ID
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Updated user data
   */
  async assignRole(userId, roleId) {
    const response = await apiClient.post(`/users/${userId}/roles`, { roleId });
    return response.data.data.user;
  },

  /**
   * Remove role from user (Admin only)
   * @param {string} userId - User ID
   * @param {string} roleId - Role ID
   * @returns {Promise<Object>} Success message
   */
  async removeRole(userId, roleId) {
    const response = await apiClient.delete(`/users/${userId}/roles/${roleId}`);
    return response.data.data;
  },

  /**
   * Delete user (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message
   */
  async deleteUser(userId) {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data.data;
  },

  /**
   * Get user roles
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of roles
   */
  async getUserRoles(userId) {
    const response = await apiClient.get(`/users/${userId}/roles`);
    return response.data.data.roles || [];
  },

  /**
   * Create user (Admin only) - creates inactive user and sends verification link
   * @param {Object} userData - User data (without password)
   * @param {string} userData.email - User email
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @param {string} [userData.phone] - User phone number (optional)
   * @param {string} [userData.preferredLanguage] - Preferred language (optional)
   * @param {string[]} [userData.roleIds] - Array of Role IDs (optional)
   * @returns {Promise<Object>} User data and success message
   */
  async createUser(userData) {
    const response = await apiClient.post('/users', userData);
    return response.data.data;
  },

  /**
   * Activate user (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message and user data
   */
  async activateUser(userId) {
    const response = await apiClient.patch(`/users/${userId}/activate`);
    return response.data.data;
  },

  /**
   * Deactivate user (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message and user data
   */
  async deactivateUser(userId) {
    const response = await apiClient.patch(`/users/${userId}/deactivate`);
    return response.data.data;
  },

  /**
   * Get user activity logs (Admin only)
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Activities data with pagination
   */
  async getUserActivity(
    userId,
    { page = 1, limit = 20, search, startDate, endDate } = {}
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(
      `/users/${userId}/activity?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get user login history (Admin only)
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Login history data with pagination
   */
  async getUserLoginHistory(
    userId,
    { page = 1, limit = 20, search, startDate, endDate } = {}
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(
      `/users/${userId}/login-history?${params.toString()}`
    );
    return response.data.data;
  },
};
