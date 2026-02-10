import apiClient from '../config/api';

/**
 * Estimate Service
 * Handles all treatment estimate/cost estimate API calls
 */

export const estimateService = {
  /**
   * Get all estimates with pagination and filters
   */
  async getAllEstimates(options = {}) {
    const { page = 1, limit = 10, search = '', status = '', patientId = '' } = options;
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (patientId) params.append('patientId', patientId);
    const response = await apiClient.get(`/estimates?${params.toString()}`);
    const data = response.data.data;
    // Normalize estimates to ensure 'id' field exists
    if (data.estimates) {
      data.estimates = data.estimates.map(estimate => ({
        ...estimate,
        id: estimate._id || estimate.id,
      }));
    }
    return data;
  },

  /**
   * Get estimate by ID
   */
  async getEstimateById(estimateId) {
    const response = await apiClient.get(`/estimates/${estimateId}`);
    const estimate = response.data.data.estimate;
    return {
      ...estimate,
      id: estimate._id || estimate.id,
    };
  },

  /**
   * Get estimates by patient
   */
  async getEstimatesByPatient(patientId) {
    const response = await apiClient.get(`/estimates/patient/${patientId}`);
    return response.data.data;
  },

  /**
   * Create estimate
   */
  async createEstimate(estimateData) {
    const response = await apiClient.post('/estimates', estimateData);
    const estimate = response.data.data.estimate;
    return {
      ...estimate,
      id: estimate._id || estimate.id,
    };
  },

  /**
   * Delete estimate
   */
  async deleteEstimate(estimateId) {
    const response = await apiClient.delete(`/estimates/${estimateId}`);
    return response.data.data;
  },

  /**
   * Update estimate
   */
  async updateEstimate(estimateId, updates) {
    const response = await apiClient.patch(`/estimates/${estimateId}`, updates);
    return response.data.data.estimate;
  },

  /**
   * Send estimate to patient by email (draft only). Sets status to 'sent'.
   * @param {string} estimateId
   */
  async sendToPatient(estimateId) {
    const response = await apiClient.post(`/estimates/${estimateId}/send`);
    return response.data.data?.estimate ?? response.data.data;
  },

  /**
   * Convert estimate to invoice
   * @param {string} estimateId
   * @param {Object} data - { appointmentId, dueDate (ISO string) }
   */
  async convertToInvoice(estimateId, data = {}) {
    const response = await apiClient.post(`/estimates/${estimateId}/convert`, data);
    return response.data.data;
  },

  /**
   * Mark estimate as accepted
   */
  async acceptEstimate(estimateId) {
    const response = await apiClient.patch(`/estimates/${estimateId}/accept`);
    return response.data.data;
  },

  /**
   * Mark estimate as declined
   */
  async declineEstimate(estimateId, reason) {
    const response = await apiClient.patch(`/estimates/${estimateId}/decline`, { reason });
    return response.data.data;
  },

  /**
   * Expire estimate
   */
  async expireEstimate(estimateId) {
    const response = await apiClient.patch(`/estimates/${estimateId}/expire`);
    return response.data.data;
  },
};
