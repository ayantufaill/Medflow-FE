import apiClient from '../config/api';

/**
 * Waitlist Service
 * Handles all waitlist-related API calls
 */

export const waitlistService = {
  /**
   * Get all waitlist entries with pagination and filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} providerId - Filter by provider ID
   * @param {string} patientId - Filter by patient ID
   * @param {string} status - Filter by status
   * @param {string} priority - Filter by priority
   * @returns {Promise<Object>} Waitlist entries data with pagination
   */
  async getAllWaitlistEntries(
    page = 1,
    limit = 10,
    providerId = '',
    patientId = '',
    status = '',
    priority = '',
    search = '',
    dateFrom = '',
    dateTo = ''
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (providerId) params.append('providerId', providerId);
    if (patientId) params.append('patientId', patientId);
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await apiClient.get(`/waitlist?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get waitlist entry by ID
   * @param {string} waitlistEntryId - Waitlist Entry ID
   * @returns {Promise<Object>} Waitlist entry data
   */
  async getWaitlistEntryById(waitlistEntryId) {
    const response = await apiClient.get(`/waitlist/${waitlistEntryId}`);
    return response.data.data.waitlistEntry;
  },

  /**
   * Create waitlist entry
   * @param {Object} waitlistEntryData - Waitlist entry data
   * @returns {Promise<Object>} Created waitlist entry data
   */
  async createWaitlistEntry(waitlistEntryData) {
    const response = await apiClient.post('/waitlist', waitlistEntryData);
    return response.data.data.waitlistEntry;
  },

  /**
   * Update waitlist entry
   * @param {string} waitlistEntryId - Waitlist Entry ID
   * @param {Object} updates - Waitlist entry update data
   * @returns {Promise<Object>} Updated waitlist entry data
   */
  async updateWaitlistEntry(waitlistEntryId, updates) {
    const response = await apiClient.put(
      `/waitlist/${waitlistEntryId}`,
      updates
    );
    return response.data.data.waitlistEntry;
  },

  /**
   * Mark waitlist entry as called
   * @param {string} waitlistEntryId - Waitlist Entry ID
   * @returns {Promise<Object>} Updated waitlist entry data
   */
  async markAsCalled(waitlistEntryId) {
    const response = await apiClient.post(
      `/waitlist/${waitlistEntryId}/called`
    );
    return response.data.data.waitlistEntry;
  },

  /**
   * Mark waitlist entry as scheduled
   * @param {string} waitlistEntryId - Waitlist Entry ID
   * @returns {Promise<Object>} Updated waitlist entry data
   */
  async markAsScheduled(waitlistEntryId) {
    const response = await apiClient.post(
      `/waitlist/${waitlistEntryId}/scheduled`
    );
    return response.data.data.waitlistEntry;
  },

  /**
   * Convert waitlist entry to appointment
   * @param {string} waitlistEntryId - Waitlist Entry ID
   * @param {Object} appointmentData - Appointment data (appointmentDate, startTime, endTime, etc.)
   * @returns {Promise<Object>} Created appointment and updated waitlist entry
   */
  async convertToAppointment(waitlistEntryId, appointmentData) {
    const response = await apiClient.post(
      `/waitlist/${waitlistEntryId}/convert-to-appointment`,
      appointmentData
    );
    return response.data.data;
  },

  /**
   * Delete waitlist entry
   * @param {string} waitlistEntryId - Waitlist Entry ID
   * @returns {Promise<Object>} Success message
   */
  async deleteWaitlistEntry(waitlistEntryId) {
    const response = await apiClient.delete(`/waitlist/${waitlistEntryId}`);
    return response.data.data;
  },
};
