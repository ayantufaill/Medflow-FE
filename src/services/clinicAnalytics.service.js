import apiClient from '../config/api';

/**
 * Clinic Analytics Service
 * Handles API calls for appointment metrics (Clinic Analytics page + the header
 * popover's Analytics preview).
 */
export const clinicAnalyticsService = {
  /**
   * @param {string} [branchId='all'] - a branch id from branchService.getBranches(), or 'all'
   * @param {Object} [range] - optional { startDate, endDate } (ISO date strings).
   *   Backend defaults to the current calendar year when both are omitted.
   */
  async getClinicAnalytics(branchId = 'all', { startDate, endDate } = {}) {
    const params = {};
    if (branchId && branchId !== 'all') params.branchId = branchId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get('/branches/analytics', { params });
    return response.data.data;
  },
};
