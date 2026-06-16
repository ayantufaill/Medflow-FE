import apiClient from '../config/api';

/**
 * Schedule Block Service
 * Handles all schedule block-related API calls (calendar blocking)
 */
export const scheduleBlockService = {
  /**
   * Get all schedule blocks for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} List of schedule blocks
   */
  async getBlocksForDate(date) {
    const response = await apiClient.get(`/schedule-blocks?date=${date}`);
    return response.data.data;
  },

  /**
   * Create a schedule block
   * @param {Object} blockData - Block data (roomId, date, startTime, endTime, notes, color)
   * @returns {Promise<Object>} Created block data
   */
  async createBlock(blockData) {
    const response = await apiClient.post('/schedule-blocks', blockData);
    return response.data.data;
  },

  /**
   * Delete a schedule block
   * @param {string} blockId - Block ID
   * @returns {Promise<Object>} Response message
   */
  async deleteBlock(blockId) {
    const response = await apiClient.delete(`/schedule-blocks/${blockId}`);
    return response.data;
  },
};
export default scheduleBlockService;
