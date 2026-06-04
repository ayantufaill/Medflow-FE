import apiClient from '../config/api';

export const kpiService = {
  /**
   * Fetch rolling 12-month consolidated KPI metrics
   */
  async getMainKpis() {
    try {
      const response = await apiClient.get('/kpis');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch main KPIs:', error);
      throw error;
    }
  },

  /**
   * Fetch provider-level 12-month metrics
   */
  async getProviderKpis() {
    try {
      const response = await apiClient.get('/kpis/providers');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch provider KPIs:', error);
      throw error;
    }
  }
};
