import apiClient from '../config/api';

/**
 * Fee Service
 * Handles fee schedules, procedure codes, and bulk fee updates
 */
export const feeService = {
  /**
   * List all fee schedules
   */
  async getFeeSchedules() {
    const response = await apiClient.get('/fee-management/guides');
    return response.data.data;
  },

  /**
   * Create a new fee schedule
   */
  async createFeeSchedule(name) {
    const response = await apiClient.post('/fee-management/guides', { description: name });
    return response.data.data;
  },

  /**
   * Update a fee schedule
   */
  async updateFeeSchedule(id, name) {
    const response = await apiClient.put(`/fee-management/guides/${id}`, { description: name });
    return response.data.data;
  },

  /**
   * Delete a fee schedule
   */
  async deleteFeeSchedule(id) {
    const response = await apiClient.delete(`/fee-management/guides/${id}`);
    return response.data.data;
  },

  /**
   * Copy a fee schedule
   */
  async copyFeeSchedule(sourceId, newName) {
    const response = await apiClient.post(`/fee-management/guides/${sourceId}/copy`, { description: newName });
    return response.data.data;
  },

  /**
   * Get fees for a specific fee schedule with optional filters
   * @param {string} id
   * @param {Object} params - { search, category, page, limit }
   */
  async getFeeScheduleFees(id, params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const response = await apiClient.get(`/fee-management/guides/${id}/fees?${query.toString()}`);
    return response.data; // Returns { total, page, limit, data }
  },

  /**
   * Update fees for a specific fee schedule
   * @param {string} id
   * @param {Array} fees - Array of { procCode, amount }
   */
  async updateFeeScheduleFees(id, fees) {
    const response = await apiClient.put(`/fee-management/guides/${id}/fees`, { fees });
    return response.data.data;
  },

  /**
   * Round all fees in a fee schedule to the nearest specified amount
   * @param {string} id
   * @param {number} toNearest
   */
  async roundFeeScheduleFees(id, toNearest) {
    const response = await apiClient.post(`/fee-management/guides/${id}/round`, { toNearest });
    return response.data.data;
  },

  /**
   * List dental procedure codes with optional search/filters

   * @param {Object} params - { search, category, page, limit }
   */
  async getProcedureCodes(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const response = await apiClient.get(`/fee-management/codes?${query.toString()}`);
    return response.data; // Returns { total, page, limit, data }
  },

  /**
   * Get fees for a specific procedure across all guides
   * @param {string} procCode
   */
  async getProcedureFees(procCode) {
    const response = await apiClient.get(`/fee-management/codes/${procCode}/fees`);
    return response.data.data;
  },

  /**
   * Update fees for a procedure (Bulk)
   * @param {string} procCode
   * @param {Array} fees - Array of { feeSchedNum, amount }
   */
  async updateProcedureFees(procCode, fees) {
    const response = await apiClient.put(`/fee-management/codes/${procCode}/fees`, { fees });
    return response.data.data;
  },

  /**
   * Reestimate treatment plans
   */
  async reestimateTPlans() {
    const response = await apiClient.post('/fee-management/tools/reestimate');
    return response.data.data;
  },

  /**
   * Clear locked fees
   */
  async clearLockedFees() {
    const response = await apiClient.post('/fee-management/tools/clear-locked');
    return response.data.data;
  },

  /**
   * Reset treatment plans to default fee guide
   * @param {Array} patientIds - Optional array of patient IDs to reset
   */
  async resetTPlans(patientIds = []) {
    const response = await apiClient.post('/fee-management/tools/reset-tplans', { patientIds });
    return response.data.data;
  }
};
