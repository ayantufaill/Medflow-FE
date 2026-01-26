import apiClient from '../config/api';

/**
 * Practice Info Service
 * Handles all practice info-related API calls
 */

export const practiceInfoService = {
  /**
   * Get all practice info records (Admin only)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @returns {Promise<Object>} Practice info data with pagination
   */
  async getAllPracticeInfo(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/practice-info?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get current practice info (most recent)
   * @returns {Promise<Object>} Practice info data
   */
  async getCurrentPracticeInfo() {
    const response = await apiClient.get('/practice-info/current');
    return response.data.data.practiceInfo;
  },

  /**
   * Get practice info by ID
   * @param {string} practiceInfoId - Practice info ID
   * @returns {Promise<Object>} Practice info data
   */
  async getPracticeInfoById(practiceInfoId) {
    const response = await apiClient.get(`/practice-info/${practiceInfoId}`);
    return response.data.data.practiceInfo;
  },

  /**
   * Create practice info
   * @param {Object} practiceInfoData - Practice info data (may include logo file)
   * @returns {Promise<Object>} Created practice info data
   */
  async createPracticeInfo(practiceInfoData) {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(practiceInfoData).forEach((key) => {
      if (key === 'logo' && practiceInfoData[key] instanceof File) {
        // Append logo file
        formData.append('logo', practiceInfoData[key]);
      } else if (key === 'address' || key === 'businessHours') {
        // Stringify nested objects
        formData.append(key, JSON.stringify(practiceInfoData[key]));
      } else if (practiceInfoData[key] !== null && practiceInfoData[key] !== undefined) {
        formData.append(key, practiceInfoData[key]);
      }
    });

    const response = await apiClient.post('/practice-info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.practiceInfo;
  },

  /**
   * Update practice info
   * @param {string} practiceInfoId - Practice info ID
   * @param {Object} updates - Practice info update data (may include logo file)
   * @returns {Promise<Object>} Updated practice info data
   */
  async updatePracticeInfo(practiceInfoId, updates) {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(updates).forEach((key) => {
      if (key === 'logo' && updates[key] instanceof File) {
        // Append logo file
        formData.append('logo', updates[key]);
      } else if (key === 'address' || key === 'businessHours') {
        // Stringify nested objects
        formData.append(key, JSON.stringify(updates[key]));
      } else if (updates[key] !== null && updates[key] !== undefined) {
        formData.append(key, updates[key]);
      }
    });

    const response = await apiClient.put(`/practice-info/${practiceInfoId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.practiceInfo;
  },

  /**
   * Delete practice info
   * @param {string} practiceInfoId - Practice info ID
   * @returns {Promise<Object>} Success message
   */
  async deletePracticeInfo(practiceInfoId) {
    const response = await apiClient.delete(`/practice-info/${practiceInfoId}`);
    return response.data.data;
  },
};

