import apiClient from '../config/api';

/**
 * ERA/EOB Service
 * Handles Electronic Remittance Advice (ERA) and Explanation of Benefits (EOB) processing
 */

export const eraService = {
  /**
   * Import ERA/EOB file
   * @param {FormData} formData - File upload form data
   * @returns {Promise<Object>} Import result
   */
  async importERAFile(formData) {
    const response = await apiClient.post('/era/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Get all ERA records
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} ERA records with pagination
   */
  async getAllERAs(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      startDate = '',
      endDate = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/era?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get ERA by ID
   * @param {string} eraId - ERA ID
   * @returns {Promise<Object>} ERA data
   */
  async getERAById(eraId) {
    const response = await apiClient.get(`/era/${eraId}`);
    return response.data.data.era;
  },

  /**
   * Get ERA items (payment lines) for an ERA
   * @param {string} eraId - ERA ID
   * @returns {Promise<Object>} { items }
   */
  async getERAItems(eraId) {
    const response = await apiClient.get(`/era/${eraId}/items`);
    return response.data.data.items || [];
  },

  /**
   * Auto-post payments from ERA
   * @param {string} eraId - ERA ID
   * @returns {Promise<Object>} Posting result
   */
  async autoPostPayments(eraId) {
    const response = await apiClient.post(`/era/${eraId}/auto-post`);
    return response.data.data;
  },

  /**
   * Get unmatched ERA items
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Unmatched items with pagination
   */
  async getUnmatchedItems(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      startDate = '',
      endDate = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/era/unmatched?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Manually match ERA item to claim/invoice
   * @param {string} eraItemId - ERA item ID
   * @param {string} claimId - Claim ID (optional)
   * @param {string} invoiceId - Invoice ID (optional)
   * @returns {Promise<Object>} Match result
   */
  async matchERAItem(eraItemId, claimId = null, invoiceId = null) {
    const response = await apiClient.post(`/era/items/${eraItemId}/match`, {
      claimId,
      invoiceId,
    });
    return response.data.data;
  },
};
