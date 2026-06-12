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
  }
};
