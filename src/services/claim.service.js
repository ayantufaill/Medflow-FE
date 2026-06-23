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
   * Create a manual claim from selected line items
   * @param {Object} claimData - Manual claim payload
   * @returns {Promise<Object>} Created claim
   */
  async createManualClaim(claimData) {
    const response = await apiClient.post(`/claims/manual`, claimData);
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

  /**
   * Get claims statistics and counts for tabs
   * @returns {Promise<Object>} Tab summary counts
   */
  async getTabSummary() {
    const response = await apiClient.get('/claims/tab-summary');
    return response.data.data;
  },

  /**
   * Get outstanding claims (aging report)
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Outstanding claims data
   */
  async getOutstandingClaims(options = {}) {
    const {
      page = 1,
      limit = 10,
      dateRange = 'none',
      groupBy = 'none',
      search = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (dateRange && dateRange !== 'none') params.append('dateRange', dateRange);
    if (groupBy && groupBy !== 'none') params.append('groupBy', groupBy);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/claims/outstanding?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get outstanding claims list specifically formatted for payment check allocation dropdowns
   * @param {string} search - Search query
   * @returns {Promise<Object>} Outstanding claims for allocation
   */
  async getOutstandingClaimsForAllocation(search = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const response = await apiClient.get(`/claims/outstanding-for-allocation?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get predetermination claims (PreAuth)
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Predetermination claims data
   */
  async getPredeterminations(options = {}) {
    const {
      page = 1,
      limit = 10,
      patientId = '',
      search = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (patientId) params.append('patientId', patientId);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/claims/predeterminations`);
    return response.data.data;
  },

  /**
   * Get Dentical remittance and eligibility reports
   * @returns {Promise<Array>} Dentical reports
   */
  async getDenticalReports() {
    const response = await apiClient.get('/claims/dentical-reports');
    return response.data.data;
  },

  /**
   * Get ERA reports
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} ERA reports list
   */
  async getEraReports(options = {}) {
    const {
      page = 1,
      limit = 10,
      eraTab = 'active',
      search = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (eraTab) params.append('eraTab', eraTab);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/claims/era-reports?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get procedures pending claim creation grouped by patient
   * @returns {Promise<Array>} Pending procedures
   */
  async getPendingProcedures() {
    const response = await apiClient.get('/claims/pending-procedures');
    return response.data.data;
  },

  /**
   * Submit multiple claims in a batch
   * @param {Array<string>} claimIds - Array of claim IDs to submit
   * @param {string} submissionType - 'electronic' or 'paper'
   * @returns {Promise<Object>} Batch submission results
   */
  async batchSubmitClaims(claimIds, submissionType = 'electronic') {
    const response = await apiClient.post('/claims/batch-submit', {
      claimIds,
      submissionType,
    });
    return response.data.data;
  },

  /**
   * Record a batch payment check or EFT from insurance carrier
   * @param {Object} paymentData - Payment and allocations details
   * @returns {Promise<Object>} Recorded payment details
   */
  async recordBatchPayment(paymentData) {
    const response = await apiClient.post('/claims/batch-payment', paymentData);
    return response.data.data;
  },

  /**
   * Get batch payments recorded
   * @param {Object} options - Pagination and search filters
   * @returns {Promise<Object>} Batch payments list
   */
  async getBatchPayments(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
    } = options;

    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/claims/batch-payments?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Upload EOB document for a batch payment
   * @param {string} paymentId - Payment ID
   * @param {FormData} formData - Document file form data
   * @returns {Promise<Object>} EOB upload response
   */
  async uploadEOB(paymentId, formData) {
    const response = await apiClient.post(`/claims/batch-payment/${paymentId}/eob`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Generate batch statements/invoices for patients
   * @param {Array<string>} patientIds - Array of patient IDs
   * @param {string} deliveryPreference - Delivery method
   * @returns {Promise<Object>} Batch statements generation result
   */
  async generateBatchInvoices(patientIds, deliveryPreference) {
    const response = await apiClient.post('/claims/batch-invoices', {
      patientIds,
      deliveryPreference,
    });
    return response.data.data;
  },

  /**
   * Revert multiple completed procedures back to treatment-planned status
   * @param {Array<string>} procedureIds - Procedure IDs
   * @returns {Promise<Object>} Uncompleted procedures results
   */
  async uncompleteProcedures(procedureIds) {
    const response = await apiClient.post('/claims/procedures/uncomplete', {
      procedureIds,
    });
    return response.data.data;
  },

  /**
   * Get clearinghouse transmission status for a claim
   * @param {string} claimId - Claim ID
   * @returns {Promise<Object>} Clearinghouse details
   */
  async getClearinghouseStatus(claimId) {
    const response = await apiClient.get(`/claims/${claimId}/clearinghouse`);
    return response.data.data;
  },

  /**
   * Quick status update for a claim with a tracking note
   * @param {string} claimId - Claim ID
   * @param {string} status - New claim status
   * @param {string} note - Status note
   * @returns {Promise<Object>} Updated claim
   */
  async quickStatusUpdate(claimId, status, note) {
    const response = await apiClient.post(`/claims/${claimId}/quick-status`, {
      status,
      note,
    });
    return response.data.data.claim;
  },
};
