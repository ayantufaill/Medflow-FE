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
      const value = practiceInfoData[key];
      if (key === 'logo' && value instanceof File) {
        // Append logo file
        formData.append('logo', value);
      } else if (value && typeof value === 'object' && !(value instanceof File)) {
        // Stringify nested objects (address, businessHours, practiceSettings, etc.)
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
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
      const value = updates[key];
      if (key === 'logo' && value instanceof File) {
        // Append logo file
        formData.append('logo', value);
      } else if (value && typeof value === 'object' && !(value instanceof File)) {
        // Stringify nested objects (address, businessHours, practiceSettings, etc.)
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
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

  // Practice Setup Patch APIs
  async updateOfficeTimings(practiceInfoId, officeTimingsData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/office-timings`, { officeTimings: officeTimingsData });
    return response.data.data;
  },

  async updateOnlineSchedule(practiceInfoId, onlineScheduleData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/online-schedule`, { onlineSchedule: onlineScheduleData });
    return response.data.data;
  },

  async updatePatientFlags(practiceInfoId, patientFlagsData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/patient-flags`, { patientFlags: patientFlagsData });
    return response.data.data;
  },

  async updateDocumentCategories(practiceInfoId, documentCategoriesData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/document-categories`, { documentCategories: documentCategoriesData });
    return response.data.data;
  },

  async updateScheduleConfig(practiceInfoId, scheduleConfigData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/schedule-config`, { scheduleConfig: scheduleConfigData });
    return response.data.data;
  },

  async updatePracticeSettings(practiceInfoId, practiceSettingsData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/practice-settings`, { practiceSettings: practiceSettingsData });
    return response.data.data;
  },

  async updateKioskSettings(practiceInfoId, kioskSettingsData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/kiosk-settings`, { kioskSettings: kioskSettingsData });
    return response.data.data;
  },

  async updateMyChartSettings(practiceInfoId, mychartSettingsData) {
    const response = await apiClient.patch(`/practice-info/${practiceInfoId}/mychart-settings`, { mychartSettings: mychartSettingsData });
    return response.data.data;
  },
};

