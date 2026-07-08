import apiClient from '../config/api';

/**
 * Shortlist Service
 * Handles all shortlist-related API calls
 */

export const shortlistService = {
  /**
   * Get all shortlist items
   * @returns {Promise<Object>} Shortlist data
   */
  getShortlistItems: async () => {
    const response = await apiClient.get('/shortlist');
    return response.data;
  },

  /**
   * Create a new shortlist item
   * @param {Object} itemData - Shortlist item data
   * @returns {Promise<Object>} Created shortlist item
   */
  createShortlistItem: async (itemData) => {
    const response = await apiClient.post('/shortlist', itemData);
    return response.data;
  },

  /**
   * Delete a shortlist item
   * @param {string} id - Shortlist item ID
   * @returns {Promise<Object>} Response data
   */
  deleteShortlistItem: async (id) => {
    const response = await apiClient.delete(`/shortlist/${id}`);
    return response.data;
  }
};
