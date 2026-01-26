import apiClient from '../config/api';

/**
 * Insurance Company Service
 * Handles insurance company master data APIs
 */

export const insuranceCompanyService = {
  /**
   * Get all insurance companies with pagination, search, and status filter
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @param {string} search - Search term
   * @param {string} status - Status filter ('active', 'inactive', or '')
   * @returns {Promise<Object>} Object with companies array and pagination info
   */
  async getAllInsuranceCompanies(page = 1, limit = 10, search = '', status = '') {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) {
      params.append('search', search);
    }
    if (status === 'active') {
      params.append('isActive', 'true');
    } else if (status === 'inactive') {
      params.append('isActive', 'false');
    }

    const response = await apiClient.get(`/insurance-companies?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get insurance company by ID
   * @param {string} insuranceCompanyId - Insurance Company ID
   * @returns {Promise<Object>} Insurance company data
   */
  async getInsuranceCompanyById(insuranceCompanyId) {
    const response = await apiClient.get(`/insurance-companies/${insuranceCompanyId}`);
    return response.data.data.company;
  },

  /**
   * Create insurance company
   * @param {Object} payload - Insurance company data
   * @returns {Promise<Object>} Created insurance company data
   */
  async createInsuranceCompany(payload) {
    const response = await apiClient.post('/insurance-companies', payload);
    return response.data.data.company;
  },

  /**
   * Update insurance company
   * @param {string} insuranceCompanyId - Insurance Company ID
   * @param {Object} updates - Insurance company update data
   * @returns {Promise<Object>} Updated insurance company data
   */
  async updateInsuranceCompany(insuranceCompanyId, updates) {
    const response = await apiClient.put(
      `/insurance-companies/${insuranceCompanyId}`,
      updates
    );
    return response.data.data.company;
  },

  /**
   * Delete insurance company
   * @param {string} insuranceCompanyId - Insurance Company ID
   * @returns {Promise<Object>} Success message
   */
  async deleteInsuranceCompany(insuranceCompanyId) {
    const response = await apiClient.delete(`/insurance-companies/${insuranceCompanyId}`);
    return response.data.data;
  },
};

