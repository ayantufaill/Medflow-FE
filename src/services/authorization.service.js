import apiClient from '../config/api';

/**
 * Authorization Service
 * Handles insurance authorization requests and tracking
 */

export const authorizationService = {
  /**
   * Get all authorizations
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Authorizations with pagination
   */
  async getAllAuthorizations(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      patientId = '',
      insuranceCompanyId = '',
      startDate = '',
      endDate = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (patientId) params.append('patientId', patientId);
    if (insuranceCompanyId) params.append('insuranceCompanyId', insuranceCompanyId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/authorizations?${params.toString()}`);
    const data = response.data.data;

    // Normalize authorizations
    if (data.authorizations) {
      data.authorizations = data.authorizations.map((auth) => ({
        ...auth,
        id: auth._id || auth.id,
        patient: auth.patientId || auth.patient,
        insuranceCompany: auth.insuranceCompanyId || auth.insuranceCompany,
        service: auth.serviceId || auth.service,
      }));
    }

    return data;
  },

  /**
   * Get authorization by ID
   * @param {string} authorizationId - Authorization ID
   * @returns {Promise<Object>} Authorization data
   */
  async getAuthorizationById(authorizationId) {
    const response = await apiClient.get(`/authorizations/${authorizationId}`);
    const auth = response.data.data.authorization;
    return {
      ...auth,
      id: auth._id || auth.id,
      patient: auth.patientId || auth.patient,
      insuranceCompany: auth.insuranceCompanyId || auth.insuranceCompany,
      service: auth.serviceId || auth.service,
    };
  },

  /**
   * Request new authorization
   * @param {Object} authorizationData - Authorization request data
   * @returns {Promise<Object>} Created authorization
   */
  async requestAuthorization(authorizationData) {
    const response = await apiClient.post('/authorizations', authorizationData);
    return response.data.data.authorization;
  },

  /**
   * Update authorization
   * @param {string} authorizationId - Authorization ID
   * @param {Object} updates - Authorization updates
   * @returns {Promise<Object>} Updated authorization
   */
  async updateAuthorization(authorizationId, updates) {
    const response = await apiClient.patch(`/authorizations/${authorizationId}`, updates);
    return response.data.data.authorization;
  },

  /**
   * Get authorization status history
   * @param {string} authorizationId - Authorization ID
   * @returns {Promise<Array>} Status history
   */
  async getAuthorizationStatusHistory(authorizationId) {
    const response = await apiClient.get(`/authorizations/${authorizationId}/status-history`);
    return response.data.data.statusHistory || [];
  },

  /**
   * Generate authorization form PDF
   * @param {string} authorizationId - Authorization ID
   * @returns {Promise<Blob>} PDF file
   */
  async printAuthorizationForm(authorizationId) {
    const response = await apiClient.get(`/authorizations/${authorizationId}/print`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
