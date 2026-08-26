import apiClient from '../config/api';

/**
 * Task Service
 * Handles all task-related API calls for the Task Management page.
 */
export const taskService = {
  /**
   * Get all tasks with filters, pagination, and sorting
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Tasks data with pagination
   */
  async getAllTasks({
    status = '',
    taskListNum = '',
    assignedTo = '',
    createdDateFrom = '',
    createdDateTo = '',
    page = 1,
    limit = 25,
    sortBy = 'DateTimeEntry',
    sortOrder = 'desc',
    search = '',
  } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    if (taskListNum) params.append('taskListNum', taskListNum);
    if (assignedTo) params.append('assignedTo', assignedTo);
    if (createdDateFrom) params.append('createdDateFrom', createdDateFrom);
    if (createdDateTo) params.append('createdDateTo', createdDateTo);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/tasks?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get task by ID
   * @param {string|number} taskId - Task ID
   * @returns {Promise<Object>} Task data
   */
  async getTaskById(taskId) {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data.data;
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task creation data
   * @returns {Promise<Object>} Created task data
   */
  async createTask(taskData) {
    const response = await apiClient.post('/tasks', taskData);
    return response.data.data;
  },

  /**
   * Update an existing task
   * @param {string|number} taskId - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated task data
   */
  async updateTask(taskId, updates) {
    const response = await apiClient.put(`/tasks/${taskId}`, updates);
    return response.data.data;
  },

  /**
   * Delete a task
   * @param {string|number} taskId - Task ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteTask(taskId) {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data.data;
  },

  /**
   * Add a comment to a task
   * @param {string|number} taskId - Task ID
   * @param {string} text - Comment text
   * @returns {Promise<Object>} Created comment data
   */
  async addComment(taskId, text) {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, { text });
    return response.data.data;
  },

  /**
   * Update task status
   * @param {string|number} taskId - Task ID
   * @param {number} status - New status (0=New, 1=Done, 2=InProgress)
   * @returns {Promise<Object>} Updated task data
   */
  async updateTaskStatus(taskId, status) {
    const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
    return response.data.data;
  },

  /**
   * Get task lists (groups) for the Assign-to-group dropdown
   * @returns {Promise<Array>} List of task lists
   */
  async getTaskLists() {
    const response = await apiClient.get('/tasks/lists');
    return response.data.data;
  },
};
