import apiClient from '../config/api';

/**
 * Audience Service
 * Handles saved audience segments
 */
export const audienceService = {
  /**
   * Get all saved audience segments
   */
  async getAllAudiences() {
    const response = await apiClient.get('/audiences');
    return response.data.data;
  },

  /**
   * Save a new audience segment
   * @param {Object} data - { name, kind, filters }
   */
  async saveAudience(data) {
    const response = await apiClient.post('/audiences', data);
    return response.data.data;
  },

  /**
   * Delete an audience segment
   * @param {string} audienceId
   */
  async deleteAudience(audienceId) {
    const response = await apiClient.delete(`/audiences/${audienceId}`);
    return response.data.data;
  }
};
