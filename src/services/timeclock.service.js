import apiClient from '../config/api';

/**
 * Time Clock Service
 * Handles all time clock-related API calls
 */

export const timeClockService = {
  /**
   * Get timesheets aggregated per employee within date range
   * @param {string} dateRange - The predefined date range string (e.g. 'This Week')
   * @param {string} startDate - Optional custom start date
   * @param {string} endDate - Optional custom end date
   * @returns {Promise<Object>} Timesheets data
   */
  async getTimesheets(dateRange, startDate, endDate) {
    const params = new URLSearchParams();
    if (dateRange) params.append('dateRange', dateRange);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/timeclock/timesheets?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Add a new Time Clock record
   * @param {Object} payload - Record data
   * @param {string} payload.user - User ID
   * @param {string} payload.date - Date of record
   * @param {string} payload.time - Time of record
   * @param {string} payload.recordType - 'Clock In' or 'Clock Out'
   * @param {string} payload.note - Optional note
   * @returns {Promise<Object>} Created record
   */
  async addTimeClockRecord(payload) {
    const response = await apiClient.post('/timeclock/record', payload);
    return response.data.data;
  }
};
