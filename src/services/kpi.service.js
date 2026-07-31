import apiClient from '../config/api';

/**
 * KPI Service
 * Handles API calls for the KPI Dashboard
 */
export const kpiService = {
  /**
   * Get all main KPI metrics (12 months rolling)
   * @param {Object} params - Query params like startDate, endDate
   */
  async getMainKpis(params = {}) {
    const response = await apiClient.get('/kpis', { params });
    return response.data.data;
  },

  /**
   * Get provider KPI metrics (12 months rolling)
   * @param {Object} params - Query params like startDate, endDate
   */
  async getProviderKpis(params = {}) {
    const response = await apiClient.get('/kpis/providers', { params });
    return response.data.data;
  },

  /**
   * Get KPI summary metrics (Top Cards)
   */
  async getKpiSummary() {
    const response = await apiClient.get('/kpis/summary');
    return response.data.data;
  }
};
