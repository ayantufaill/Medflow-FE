import apiClient from '../config/api';

/**
 * Reporting Service
 * Handles dynamic report execution and definition management
 */
export const reportingService = {
  /**
   * Get all saved report definitions
   */
  async getSavedReports() {
    const response = await apiClient.get('/reports/definitions');
    return response.data.data;
  },

  /**
   * Save a new report definition
   * @param {Object} data - { name, kind, filters, columns }
   */
  async saveReport(data) {
    const response = await apiClient.post('/reports/definitions', data);
    return response.data.data;
  },

  /**
   * Delete a saved report
   * @param {string} reportId
   */
  async deleteReport(reportId) {
    const response = await apiClient.delete(`/reports/definitions/${reportId}`);
    return response.data.data;
  },

  /**
   * Run a dynamic report
   * @param {Object} options - { kind, filters, columns, page, limit }
   */
  async runReport(options) {
    const response = await apiClient.post('/reports/run', options);
    return response.data.data;
  },

  /**
   * Get financial report data by name
   * @param {string} reportName 
   * @param {Object} params - Query params like date, range
   */
  async getFinancialReport(reportName, params = {}) {
    const response = await apiClient.get(`/reports/financial/${reportName}`, { params });
    return response.data.data;
  }
};
