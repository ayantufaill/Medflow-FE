import apiClient from '../config/api';

/**
 * Provider Service
 * Handles all provider-related API calls
 */

export const providerService = {
  /**
   * Get all providers with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @param {boolean} isActive - Filter by active status
   * @returns {Promise<Object>} Providers data with pagination
   */
  async getAllProviders(
    page = 1,
    limit = 10,
    search = '',
    isActive = null,
    specialty = ''
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (specialty) params.append('specialty', specialty);
    if (isActive !== null && isActive !== undefined) {
      params.append('isActive', isActive ? 'true' : 'false');
    }

    const response = await apiClient.get(`/providers?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get provider by ID
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Provider data
   */
  async getProviderById(providerId) {
    const response = await apiClient.get(`/providers/${providerId}`);
    return response.data.data.provider;
  },

  /**
   * Create provider
   * @param {Object} providerData - Provider data
   * @returns {Promise<Object>} Created provider data
   */
  async createProvider(providerData) {
    const response = await apiClient.post('/providers', providerData);
    return response.data.data.provider;
  },

  /**
   * Update provider
   * @param {string} providerId - Provider ID
   * @param {Object} updates - Provider update data
   * @returns {Promise<Object>} Updated provider data
   */
  async updateProvider(providerId, updates) {
    const response = await apiClient.put(`/providers/${providerId}`, updates);
    return response.data.data.provider;
  },

  /**
   * Activate provider
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Updated provider data
   */
  async activateProvider(providerId) {
    const response = await apiClient.patch(`/providers/${providerId}/activate`);
    return response.data.data;
  },

  /**
   * Deactivate provider
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Updated provider data
   */
  async deactivateProvider(providerId) {
    const response = await apiClient.patch(`/providers/${providerId}/deactivate`);
    return response.data.data;
  },

  /**
   * Delete provider permanently
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Success message
   */
  async deleteProvider(providerId) {
    const response = await apiClient.delete(`/providers/${providerId}`);
    return response.data.data;
  },

  async getSpecialties() {
    const response = await apiClient.get('/providers/specialties');
    return response.data.data;
  },
};
