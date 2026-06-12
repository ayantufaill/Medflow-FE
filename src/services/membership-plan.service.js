import apiClient from '../config/api';

/**
 * Membership Plan Service
 * Handles membership plan APIs
 */

export const membershipPlanService = {
  /**
   * Get all membership plans
   * @returns {Promise<Object>} Array of membership plans
   */
  async getMembershipPlans() {
    const response = await apiClient.get('/membership-plans');
    return response.data.data;
  },

  /**
   * Create membership plan
   * @param {Object} payload - Membership plan data
   * @returns {Promise<Object>} Created membership plan data
   */
  async createMembershipPlan(payload) {
    const response = await apiClient.post('/membership-plans', payload);
    return response.data.data;
  },

  /**
   * Update membership plan
   * @param {string} id - Membership Plan ID
   * @param {Object} updates - Membership plan update data
   * @returns {Promise<Object>} Updated membership plan data
   */
  async updateMembershipPlan(id, updates) {
    const response = await apiClient.put(`/membership-plans/${id}`, updates);
    return response.data.data;
  },

  /**
   * Delete membership plan
   * @param {string} id - Membership Plan ID
   * @returns {Promise<Object>} Success message
   */
  async deleteMembershipPlan(id) {
    const response = await apiClient.delete(`/membership-plans/${id}`);
    return response.data.data;
  },
};
