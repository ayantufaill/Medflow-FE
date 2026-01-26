import apiClient from '../config/api';

/**
 * Recurring Appointment Service
 * Handles all recurring appointment-related API calls
 */

export const recurringAppointmentService = {
  /**
   * Get all recurring appointments with pagination and filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} providerId - Filter by provider ID
   * @param {string} patientId - Filter by patient ID
   * @param {boolean} isActive - Filter by active status
   * @returns {Promise<Object>} Recurring appointments data with pagination
   */
  async getAllRecurringAppointments(
    page = 1,
    limit = 10,
    providerId = '',
    patientId = '',
    isActive = null,
    search = '',
    startDateFrom = '',
    startDateTo = ''
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (providerId) params.append('providerId', providerId);
    if (patientId) params.append('patientId', patientId);
    if (isActive !== null && isActive !== undefined) {
      params.append('isActive', isActive ? 'true' : 'false');
    }
    if (search) params.append('search', encodeURIComponent(search));
    if (startDateFrom) params.append('startDateFrom', startDateFrom);
    if (startDateTo) params.append('startDateTo', startDateTo);

    const response = await apiClient.get(
      `/recurring-appointments?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get recurring appointment by ID
   * @param {string} recurringAppointmentId - Recurring Appointment ID
   * @returns {Promise<Object>} Recurring appointment data
   */
  async getRecurringAppointmentById(recurringAppointmentId) {
    const response = await apiClient.get(
      `/recurring-appointments/${recurringAppointmentId}`
    );
    return response.data.data.recurringAppointment;
  },

  /**
   * Preview recurring appointment dates/times without creating them
   * @param {Object} recurringAppointmentData - Recurring appointment data
   * @returns {Promise<Object>} Preview data with proposed dates and conflicts
   */
  async previewRecurringAppointments(recurringAppointmentData) {
    const response = await apiClient.post(
      '/recurring-appointments/preview',
      recurringAppointmentData
    );
    return response.data.data;
  },

  /**
   * Create recurring appointment
   * @param {Object} recurringAppointmentData - Recurring appointment data
   * @returns {Promise<Object>} Created recurring appointment data
   */
  async createRecurringAppointment(recurringAppointmentData) {
    const response = await apiClient.post(
      '/recurring-appointments',
      recurringAppointmentData
    );
    return response.data.data;
  },

  /**
   * Create recurring appointment with conflict resolution
   * @param {Object} recurringAppointmentData - Recurring appointment data with overrides
   * @param {Array} recurringAppointmentData.appointmentOverrides - Array of overrides for conflicted slots
   * @returns {Promise<Object>} Created recurring appointment data with created/skipped info
   */
  async createRecurringAppointmentWithResolution(recurringAppointmentData) {
    const response = await apiClient.post(
      '/recurring-appointments/with-resolution',
      recurringAppointmentData
    );
    return response.data.data;
  },

  /**
   * Generate appointments from recurring series
   * @param {string} recurringAppointmentId - Recurring Appointment ID
   * @param {number} count - Number of appointments to generate
   * @returns {Promise<Object>} Generated appointments data
   */
  async generateAppointments(recurringAppointmentId, count = 5) {
    const response = await apiClient.post(
      `/recurring-appointments/${recurringAppointmentId}/generate`,
      { count }
    );
    return response.data.data;
  },

  /**
   * Update recurring appointment
   * @param {string} recurringAppointmentId - Recurring Appointment ID
   * @param {Object} updates - Recurring appointment update data
   * @returns {Promise<Object>} Updated recurring appointment data
   */
  async updateRecurringAppointment(recurringAppointmentId, updates) {
    const response = await apiClient.put(
      `/recurring-appointments/${recurringAppointmentId}`,
      updates
    );
    return response.data.data.recurringAppointment;
  },

  /**
   * Delete recurring appointment and all associated appointments
   * @param {string} recurringAppointmentId - Recurring Appointment ID
   * @returns {Promise<Object>} Success message with deleted appointments count
   */
  async deleteRecurringAppointment(recurringAppointmentId) {
    const response = await apiClient.delete(
      `/recurring-appointments/${recurringAppointmentId}`
    );
    return response.data;
  },

  /**
   * Get all actual appointments linked to a recurring appointment
   * @param {string} recurringAppointmentId - Recurring Appointment ID
   * @returns {Promise<Object>} Linked appointments data
   */
  async getLinkedAppointments(recurringAppointmentId) {
    const response = await apiClient.get(
      `/recurring-appointments/${recurringAppointmentId}/appointments`
    );
    return response.data.data;
  },
};
