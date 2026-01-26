import apiClient from '../config/api';

/**
 * Allergy Service
 * Handles all allergy-related API calls
 */

export const allergyService = {
  /**
   * Create a new allergy
   * @param {Object} allergyData - Allergy data
   * @param {string} allergyData.patientId - Patient ID
   * @param {string} allergyData.allergen - Allergen name
   * @param {string} allergyData.reaction - Reaction description
   * @param {string} allergyData.severity - Severity (mild, moderate, severe)
   * @param {string} allergyData.documentedDate - Documented date (ISO string)
   * @param {boolean} [allergyData.isActive] - Is active (default: true)
   * @returns {Promise<Object>} Allergy data
   */
  async createAllergy(allergyData) {
    const response = await apiClient.post('/allergies', allergyData);
    return response.data.data.allergy;
  },

  /**
   * Get all allergies for a patient
   * @param {string} patientId - Patient ID
   * @returns {Promise<Array>} Array of allergies
   */
  async getAllergies(patientId) {
    const response = await apiClient.get(`/allergies?patient_id=${patientId}`);
    return response.data.data.allergies || [];
  },

  /**
   * Get allergy by ID
   * @param {string} allergyId - Allergy ID
   * @returns {Promise<Object>} Allergy data
   */
  async getAllergyById(allergyId) {
    const response = await apiClient.get(`/allergies/${allergyId}`);
    return response.data.data.allergy;
  },

  /**
   * Update allergy
   * @param {string} allergyId - Allergy ID
   * @param {Object} updates - Allergy update data
   * @returns {Promise<Object>} Updated allergy data
   */
  async updateAllergy(allergyId, updates) {
    const response = await apiClient.put(`/allergies/${allergyId}`, updates);
    return response.data.data.allergy;
  },

  /**
   * Delete allergy (soft delete)
   * @param {string} allergyId - Allergy ID
   * @returns {Promise<Object>} Success message
   */
  async deleteAllergy(allergyId) {
    const response = await apiClient.delete(`/allergies/${allergyId}`);
    return response.data.data;
  },
};

