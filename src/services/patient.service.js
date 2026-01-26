import apiClient from '../config/api';

/**
 * Patient Service
 * Handles all patient-related API calls
 */

export const patientService = {
  /**
   * Get all patients with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query (searches name, email, phone, patientCode)
   * @param {string} status - Filter by status ('active' or 'inactive')
   * @param {string} dobStart - Date of birth start date (YYYY-MM-DD)
   * @param {string} dobEnd - Date of birth end date (YYYY-MM-DD)
   * @returns {Promise<Object>} Patients data with pagination
   */
  async getAllPatients(page = 1, limit = 10, search = '', status = '', dobStart = '', dobEnd = '') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (dobStart) params.append('dobStart', dobStart);
    if (dobEnd) params.append('dobEnd', dobEnd);

    const response = await apiClient.get(`/patients?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get patient by ID
   * @param {string} patientId - Patient ID
   * @param {boolean} includeSSN - Include SSN in response (default: false)
   * @returns {Promise<Object>} Patient data
   */
  async getPatientById(patientId, includeSSN = false) {
    const params = new URLSearchParams();
    if (includeSSN) params.append('includeSSN', 'true');

    const query = params.toString();
    const url = query ? `/patients/${patientId}?${query}` : `/patients/${patientId}`;

    const response = await apiClient.get(url);
    return response.data.data.patient;
  },

  /**
   * Check for duplicate patients
   * @param {Object} data - Patient data (firstName, lastName, dateOfBirth)
   * @returns {Promise<Array>} Array of duplicate patients
   */
  async checkDuplicates(data) {
    const response = await apiClient.post('/patients/check-duplicates', data);
    return response.data.data.duplicates || [];
  },

  /**
   * Create patient
   * @param {Object} patientData - Patient data
   * @returns {Promise<Object>} Created patient data
   */
  async createPatient(patientData) {
    const response = await apiClient.post('/patients', patientData);
    return response.data.data.patient;
  },

  /**
   * Update patient
   * @param {string} patientId - Patient ID
   * @param {Object} updates - Patient update data
   * @returns {Promise<Object>} Updated patient data
   */
  async updatePatient(patientId, updates) {
    const response = await apiClient.put(`/patients/${patientId}`, updates);
    return response.data.data.patient;
  },

  /**
   * Delete (deactivate) patient
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Success message
   */
  async deletePatient(patientId) {
    const response = await apiClient.delete(`/patients/${patientId}`);
    return response.data.data;
  },

  // ---------------- Patient Insurance ----------------

  /**
   * Get all insurances for a patient
   * @param {string} patientId - Patient ID
   * @param {boolean} isActive - Filter by active status
   * @returns {Promise<Array>} Array of patient insurances
   */
  async getPatientInsurances(patientId, isActive) {
    const params = new URLSearchParams();
    if (isActive !== undefined && isActive !== null) {
      params.append('isActive', isActive ? 'true' : 'false');
    }
    const query = params.toString();
    const url = query
      ? `/patients/${patientId}/insurance?${query}`
      : `/patients/${patientId}/insurance`;

    const response = await apiClient.get(url);
    return response.data.data.insurances || [];
  },

  /**
   * Get patient insurance by ID
   * @param {string} patientId - Patient ID
   * @param {string} patientInsuranceId - Patient Insurance ID
   * @returns {Promise<Object>} Patient insurance data
   */
  async getPatientInsuranceById(patientId, patientInsuranceId) {
    const response = await apiClient.get(
      `/patients/${patientId}/insurance/${patientInsuranceId}`
    );
    return response.data.data.insurance;
  },

  /**
   * Create patient insurance
   * @param {string} patientId - Patient ID
   * @param {Object} payload - Insurance data
   * @returns {Promise<Object>} Created insurance data
   */
  async createPatientInsurance(patientId, payload) {
    const response = await apiClient.post(`/patients/${patientId}/insurance`, payload);
    return response.data.data.insurance;
  },

  /**
   * Update patient insurance
   * @param {string} patientId - Patient ID
   * @param {string} patientInsuranceId - Patient Insurance ID
   * @param {Object} updates - Insurance update data
   * @returns {Promise<Object>} Updated insurance data
   */
  async updatePatientInsurance(patientId, patientInsuranceId, updates) {
    const response = await apiClient.put(
      `/patients/${patientId}/insurance/${patientInsuranceId}`,
      updates
    );
    return response.data.data.insurance;
  },

  /**
   * Delete patient insurance
   * @param {string} patientId - Patient ID
   * @param {string} patientInsuranceId - Patient Insurance ID
   * @returns {Promise<Object>} Success message
   */
  async deletePatientInsurance(patientId, patientInsuranceId) {
    const response = await apiClient.delete(
      `/patients/${patientId}/insurance/${patientInsuranceId}`
    );
    return response.data.data;
  },

  // ---------------- Patient Allergies ----------------

  /**
   * Get all allergies for a patient
   * @param {string} patientId - Patient ID
   * @param {boolean} isActive - Filter by active status
   * @returns {Promise<Array>} Array of patient allergies
   */
  async getPatientAllergies(patientId, isActive = true) {
    const params = new URLSearchParams();
    if (typeof isActive === 'boolean') {
      params.append('isActive', isActive ? 'true' : 'false');
    }
    const query = params.toString();
    const url = query
      ? `/patients/${patientId}/allergies?${query}`
      : `/patients/${patientId}/allergies`;

    const response = await apiClient.get(url);
    return response.data.data.allergies || [];
  },

  /**
   * Get allergy by ID
   * @param {string} patientId - Patient ID
   * @param {string} allergyId - Allergy ID
   * @returns {Promise<Object>} Allergy data
   */
  async getAllergyById(patientId, allergyId) {
    const response = await apiClient.get(`/patients/${patientId}/allergies/${allergyId}`);
    return response.data.data.allergy;
  },

  /**
   * Create patient allergy
   * @param {string} patientId - Patient ID
   * @param {Object} payload - Allergy data
   * @returns {Promise<Object>} Created allergy data
   */
  async createPatientAllergy(patientId, payload) {
    const response = await apiClient.post(`/patients/${patientId}/allergies`, payload);
    return response.data.data.allergy;
  },

  /**
   * Update patient allergy
   * @param {string} patientId - Patient ID
   * @param {string} allergyId - Allergy ID
   * @param {Object} updates - Allergy update data
   * @returns {Promise<Object>} Updated allergy data
   */
  async updatePatientAllergy(patientId, allergyId, updates) {
    const response = await apiClient.put(
      `/patients/${patientId}/allergies/${allergyId}`,
      updates
    );
    return response.data.data.allergy;
  },

  /**
   * Delete patient allergy
   * @param {string} patientId - Patient ID
   * @param {string} allergyId - Allergy ID
   * @returns {Promise<Object>} Success message
   */
  async deletePatientAllergy(patientId, allergyId) {
    const response = await apiClient.delete(
      `/patients/${patientId}/allergies/${allergyId}`
    );
    return response.data.data;
  },
};

