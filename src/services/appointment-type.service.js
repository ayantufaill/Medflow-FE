import apiClient from '../config/api';

/**
 * Appointment Type Service
 * Handles all appointment type-related API calls
 */

export const appointmentTypeService = {
  /**
   * Get all appointment types with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @param {boolean} isActive - Filter by active status
   * @returns {Promise<Object>} Appointment types data with pagination
   */
  async getAllAppointmentTypes(
    page = 1,
    limit = 10,
    search = '',
    isActive = null
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (isActive !== null && isActive !== undefined) {
      params.append('isActive', isActive ? 'true' : 'false');
    }

    const response = await apiClient.get(
      `/appointment-types?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get appointment type by ID
   * @param {string} appointmentTypeId - Appointment Type ID
   * @returns {Promise<Object>} Appointment type data
   */
  async getAppointmentTypeById(appointmentTypeId) {
    const response = await apiClient.get(
      `/appointment-types/${appointmentTypeId}`
    );
    return response.data.data.appointmentType;
  },

  /**
   * Create appointment type
   * @param {Object} appointmentTypeData - Appointment type data
   * @returns {Promise<Object>} Created appointment type data
   */
  async createAppointmentType(appointmentTypeData) {
    const response = await apiClient.post(
      '/appointment-types',
      appointmentTypeData
    );
    return response.data.data.appointmentType;
  },

  /**
   * Update appointment type
   * @param {string} appointmentTypeId - Appointment Type ID
   * @param {Object} updates - Appointment type update data
   * @returns {Promise<Object>} Updated appointment type data
   */
  async updateAppointmentType(appointmentTypeId, updates) {
    const response = await apiClient.put(
      `/appointment-types/${appointmentTypeId}`,
      updates
    );
    return response.data.data.appointmentType;
  },

  /**
   * Delete appointment type
   * @param {string} appointmentTypeId - Appointment Type ID
   * @returns {Promise<Object>} Success message
   */
  async deleteAppointmentType(appointmentTypeId) {
    const response = await apiClient.delete(
      `/appointment-types/${appointmentTypeId}`
    );
    return response.data.data;
  },
};
