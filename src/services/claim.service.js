import apiClient from '../config/api';

/**
 * Claim Service
 * Handles all insurance claim-related API calls
 */

export const claimService = {
  /**
   * Get all claims with pagination and filters
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Claims data with pagination
   */
  async getAllClaims(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      patientId = '',
      invoiceId = '',
      insuranceCompanyId = '',
      insuranceType = '',
      startDate = '',
      endDate = '',
      deniedOnly = false,
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (patientId) params.append('patientId', patientId);
    if (invoiceId) params.append('invoiceId', invoiceId);
    if (insuranceCompanyId) params.append('insuranceCompanyId', insuranceCompanyId);
    if (insuranceType) params.append('insuranceType', insuranceType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (deniedOnly) params.append('deniedOnly', 'true');

    const response = await apiClient.get(`/claims?${params.toString()}`);
    const data = response.data.data;

    // Normalize claims - prefer patient object over patientId string
    if (data.claims) {
      data.claims = data.claims.map((claim) => {
        const patientObj = (claim.patient && typeof claim.patient === 'object') ? claim.patient
          : (claim.patientId && typeof claim.patientId === 'object') ? claim.patientId
          : (claim.invoiceId?.patientId && typeof claim.invoiceId.patientId === 'object') ? claim.invoiceId.patientId
          : null;
        return {
          ...claim,
          id: claim._id || claim.id,
          patient: patientObj || claim.patient,
          invoice: claim.invoiceId || claim.invoice,
          insuranceCompany: claim.insuranceCompanyId || claim.insuranceCompany,
        };
      });
    }

    return data;
  },

  /**
   * Get claim by ID
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Claim data
   */
  async getClaimById(claimId) {
    const response = await apiClient.get(`/claims/${claimId}`);
    const claim = response.data.data.claim;
    const patientObj = (claim.patient && typeof claim.patient === 'object') ? claim.patient
      : (claim.patientId && typeof claim.patientId === 'object') ? claim.patientId
      : (claim.invoiceId?.patientId && typeof claim.invoiceId.patientId === 'object') ? claim.invoiceId.patientId
      : (claim.invoice?.patientId && typeof claim.invoice.patientId === 'object') ? claim.invoice.patientId
      : null;
    return {
      ...claim,
      id: claim._id || claim.id,
      patient: patientObj || claim.patient,
      invoice: claim.invoiceId || claim.invoice,
      insuranceCompany: claim.insuranceCompanyId || claim.insuranceCompany,
    };
  },

  /**
   * Get denied claims only
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Denied claims data
   */
  async getDeniedClaims(options = {}) {
    return this.getAllClaims({ ...options, deniedOnly: true, status: 'denied' });
  },

  /**
   * Create claim from invoice
   * @param {string} invoiceId - Invoice ID
   * @param {Object} claimData - Claim data
   * @returns {Promise<Object>} Created claim
   */
  async createClaimFromInvoice(invoiceId, claimData) {
    const response = await apiClient.post(`/claims/from-invoice/${invoiceId}`, claimData);
    return response.data.data.claim;
  },

  /**
   * Update claim
   * @param {string} claimId - Claim ID
   * @param {Object} updates - Claim updates
   * @returns {Promise<Object>} Updated claim
   */
  async updateClaim(claimId, updates) {
    const response = await apiClient.patch(`/claims/${claimId}`, updates);
    return response.data.data.claim;
  },

  /**
   * Validate claim for errors before submission
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Validation result with errors/warnings
   */
  async validateClaim(claimId) {
    const response = await apiClient.post(`/claims/${claimId}/validate`);
    return response.data.data;
  },

  /**
   * Submit claim electronically
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Submission result
   */
  async submitClaim(claimId) {
    const response = await apiClient.post(`/claims/${claimId}/submit`);
    return response.data.data;
  },

  /**
   * Get claim status history
   * @param {string} claimId - Claim ID
   * @returns {Promise<Array>} Status history
   */
  async getClaimStatusHistory(claimId) {
    const response = await apiClient.get(`/claims/${claimId}/status-history`);
    return response.data.data.statusHistory || [];
  },

  /**
   * Resubmit denied claim
   * @param {string} claimId - Claim ID
   * @param {Object} corrections - Correction data
   * @returns {Promise<Object>} Resubmitted claim
   */
  async resubmitClaim(claimId, corrections = {}) {
    const response = await apiClient.post(`/claims/${claimId}/resubmit`, corrections);
    return response.data.data.claim;
  },

  /**
   * Attach document to claim
   * @param {string} claimId - Claim ID
   * @param {FormData} formData - Document form data
   * @returns {Promise<Object>} Attached document
   */
  async attachDocument(claimId, formData) {
    const response = await apiClient.post(`/claims/${claimId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.document;
  },

  /**
   * Get documents attached to claim
   * @param {string} claimId - Claim ID
   * @returns {Promise<Array>} Attached documents
   */
  async getClaimDocuments(claimId) {
    const response = await apiClient.get(`/claims/${claimId}/documents`);
    return response.data.data.documents || [];
  },

  /**
   * Remove document from claim
   * @param {string} claimId - Claim ID
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Success message
   */
  async removeClaimDocument(claimId, documentId) {
    const response = await apiClient.delete(`/claims/${claimId}/documents/${documentId}`);
    return response.data.data;
  },
};
