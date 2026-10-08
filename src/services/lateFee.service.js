import apiClient from '../config/api';

/**
 * Late Fee Service
 * All late-fee admin + workflow calls. Amounts, terms and eligibility are
 * decided server-side; these helpers just carry values between the screen and
 * the API so the UI can never disagree with what the backend will apply.
 */
export const lateFeeService = {
  /**
   * Active policy + version history for a clinic.
   * GET /late-fee/clinics/:clinicId/late-fee-policy
   */
  async getPolicy(clinicId) {
    const response = await apiClient.get(`/late-fee/clinics/${clinicId}/late-fee-policy`);
    return response.data.data;
  },

  /**
   * Create the first policy version for a clinic.
   * POST /late-fee/clinics/:clinicId/late-fee-policy
   */
  async createPolicy(clinicId, data) {
    const response = await apiClient.post(`/late-fee/clinics/${clinicId}/late-fee-policy`, {
      clinicId,
      ...data,
    });
    return response.data.data;
  },

  /**
   * Create a new immutable version based on an existing one.
   * PATCH /late-fee/clinics/:clinicId/late-fee-policy/:version
   */
  async updatePolicy(clinicId, version, data) {
    const response = await apiClient.patch(`/late-fee/clinics/${clinicId}/late-fee-policy/${version}`, data);
    return response.data.data;
  },

  /**
   * Activate an existing version.
   * POST /late-fee/clinics/:clinicId/late-fee-policy/:version/activate
   */
  async activatePolicy(clinicId, version) {
    const response = await apiClient.post(`/late-fee/clinics/${clinicId}/late-fee-policy/${version}/activate`);
    return response.data.data;
  },

  /**
   * Per-clinic master switch (clinic.features.lateFee.enabled).
   * GET /late-fee/clinics/:clinicId/settings
   */
  async getSettings(clinicId) {
    const response = await apiClient.get(`/late-fee/clinics/${clinicId}/settings`);
    return response.data.data;
  },

  /**
   * Flip the per-clinic master switch.
   * PATCH /late-fee/clinics/:clinicId/settings
   */
  async updateSettings(clinicId, enabled) {
    const response = await apiClient.patch(`/late-fee/clinics/${clinicId}/settings`, { enabled });
    return response.data.data;
  },

  /**
   * Applied late-fee applications, filterable by patient/clinic/status.
   * GET /late-fee/applications
   */
  async getApplications({ patientId, clinicId, status, page, limit } = {}) {
    const response = await apiClient.get('/late-fee/applications', {
      params: { patientId, clinicId, status, page, limit },
    });
    return response.data;
  },

  /**
   * Waive a fee on an application.
   * POST /late-fee/applications/:applicationId/waive
   */
  async waiveFee(applicationId, { waivedAmount, reasonCode, reasonNote }) {
    const response = await apiClient.post(`/late-fee/applications/${applicationId}/waive`, {
      waivedAmount,
      reasonCode,
      reasonNote,
    });
    return response.data.data;
  },

  /**
   * Waiver report (already-waived fees, filterable by staff/date/reason).
   * GET /late-fee/reports/late-fee-waivers
   */
  async getWaiverReport({ staffId, from, to, reasonCode, page, limit } = {}) {
    const response = await apiClient.get('/late-fee/reports/late-fee-waivers', {
      params: { staffId, from, to, reasonCode, page, limit },
    });
    return response.data;
  },

  /**
   * Record that a patient accepted the active policy terms.
   * POST /late-fee/patients/:patientId/late-fee-acceptance
   */
  async recordAcceptance({ policyVersionId, patientId, channel, acceptedBy }) {
    const response = await apiClient.post(`/late-fee/patients/${patientId}/late-fee-acceptance`, {
      policyVersionId,
      patientId,
      channel,
      acceptedBy: acceptedBy || undefined,
    });
    return response.data.data;
  },

  /**
   * Acceptance history for a patient (newest first).
   * GET /late-fee/patients/:patientId/late-fee-acceptance
   */
  async getAcceptanceHistory(patientId) {
    const response = await apiClient.get(`/late-fee/patients/${patientId}/late-fee-acceptance`);
    return response.data.data;
  },

  /**
   * Manually trigger the daily late-fee job (admin/test).
   * POST /late-fee/run-job
   */
  async runJob() {
    const response = await apiClient.post('/late-fee/run-job');
    return response.data.data;
  },
};

export default lateFeeService;