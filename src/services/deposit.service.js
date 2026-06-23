import apiClient from '../config/api';

/**
 * Deposit Service
 * Handles all deposit and deposit slip-related API calls
 */
export const depositService = {
  /**
   * Get all deposit slips with pagination
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Object>} Deposit slips list
   */
  async getAllDepositSlips(page = 1, limit = 10) {
    const response = await apiClient.get(`/deposits/slips?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  /**
   * Get all un-deposited patient and insurance payments
   * @returns {Promise<Object>} Un-deposited payments
   */
  async getUnDepositedPayments() {
    const response = await apiClient.get('/deposits/slips/un-deposited');
    return response.data.data;
  },

  /**
   * Create a new deposit slip
   * @param {Object} data - Deposit slip details
   * @returns {Promise<Object>} Created deposit slip
   */
  async createDepositSlip(data) {
    const response = await apiClient.post('/deposits/slips', data);
    return response.data.data;
  }
};
