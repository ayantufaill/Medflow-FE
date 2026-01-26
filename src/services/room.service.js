import apiClient from '../config/api';

/**
 * Room Service
 * Handles all room-related API calls
 */

export const roomService = {
  /**
   * Get all rooms with pagination and search
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @param {boolean} isActive - Filter by active status
   * @returns {Promise<Object>} Rooms data with pagination
   */
  async getAllRooms(
    page = 1,
    limit = 10,
    search = '',
    isActive = null
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (isActive !== null && isActive !== undefined) {
      params.append('isActive', isActive ? 'true' : 'false');
    }

    const response = await apiClient.get(
      `/rooms?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get room by ID
   * @param {string} roomId - Room ID
   * @returns {Promise<Object>} Room data
   */
  async getRoomById(roomId) {
    const response = await apiClient.get(
      `/rooms/${roomId}`
    );
    return response.data.data.room;
  },

  /**
   * Create room
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} Created room data
   */
  async createRoom(roomData) {
    const response = await apiClient.post(
      '/rooms',
      roomData
    );
    return response.data.data.room;
  },

  /**
   * Update room
   * @param {string} roomId - Room ID
   * @param {Object} updates - Room update data
   * @returns {Promise<Object>} Updated room data
   */
  async updateRoom(roomId, updates) {
    const response = await apiClient.put(
      `/rooms/${roomId}`,
      updates
    );
    return response.data.data.room;
  },

  /**
   * Delete room
   * @param {string} roomId - Room ID
   * @returns {Promise<Object>} Success message
   */
  async deleteRoom(roomId) {
    const response = await apiClient.delete(
      `/rooms/${roomId}`
    );
    return response.data.data;
  },
};

