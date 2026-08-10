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
  },

  /**
   * Get patient report data by name
   * @param {string} reportName 
   * @param {Object} params - Query params like date, range
   */
  async getPatientReport(reportName, params = {}) {
    const response = await apiClient.get(`/reports/patient/${reportName}`, { params });
    return response.data.data;
  },

  /**
   * Get clinical report data by name
   * @param {string} reportName - e.g. 'recare', 'unsigned-progress-notes', 'rx'
   * @param {Object} params - Query params like startDate, endDate, range
   */
  async getClinicalReport(reportName, params = {}) {
    const response = await apiClient.get(`/reports/clinical/${reportName}`, { params });
    return response.data.data;
  },

  /**
   * Get others report data by name (e.g. login, audit)
   * @param {string} reportName
   * @param {Object} params
   */
  async getOthersReport(reportName, params = {}) {
    const response = await apiClient.get(`/reports/others/${reportName}`, { params });
    return response.data.data;
  },

  /**
   * Archive a report snapshot
   * @param {string} type - Report type (e.g. 'aging')
   * @param {Object} data - The JSON report data
   */
  async archiveReport(type, data) {
    const response = await apiClient.post('/reports/archive', { type, data });
    return response.data.data;
  },

  /**
   * Get all archived reports
   */
  async getArchivedReports() {
    const response = await apiClient.get('/reports/archive');
    return response.data.data;
  },

  /**
   * Get archived report by ID
   * @param {string} id 
   */
  async getArchivedReportById(id) {
    const response = await apiClient.get(`/reports/archive/${id}`);
    return response.data.data;
  },

  /**
   * Get dashboard metrics and graph data
   * @param {Object} params - Query params: { date, range, providerId, startDate, endDate }
   */
  async getDashboardMetrics(params = {}) {
    const response = await apiClient.get('/reports/dashboard/metrics', { params });
    return response.data.data;
  },

  /**
   * Get dashboard target goals settings
   */
  async getDashboardGoals() {
    const response = await apiClient.get('/reports/dashboard/goals');
    return response.data.data;
  },

  /**
   * Update dashboard target goals settings
   * @param {Object} goals - Partial dashboard goals object
   */
  async updateDashboardGoals(goals) {
    const response = await apiClient.put('/reports/dashboard/goals', goals);
    return response.data.data;
  },

  /**
   * Get patient reviews report
   */
  async getPatientReviewsReport(params = {}) {
    const response = await apiClient.get('/reports/patient/review', { params });
    return response.data.data;
  },

  /**
   * Get patient notifications report
   */
  async getPatientNotificationsReport(params = {}) {
    const response = await apiClient.get('/reports/patient/notifications', { params });
    return response.data.data;
  },

  /**
   * Get patient procedures report
   */
  async getPatientProceduresReport(params = {}) {
    const response = await apiClient.get('/reports/patient/procedures', { params });
    return response.data.data;
  },

  /**
   * Get patient trackers report
   */
  async getPatientTrackersReport(params = {}) {
    const response = await apiClient.get('/reports/patient/trackers', { params });
    return response.data.data;
  }
};
