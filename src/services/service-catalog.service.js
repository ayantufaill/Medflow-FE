import apiClient from '../config/api';

/**
 * Service Catalog Service
 * Handles all service/procedure catalog API calls
 */

export const serviceCatalogService = {
  /**
   * Get all services with pagination and search
   */
  async getAllServices(options = {}) {
    const { page = 1, limit = 10, search = '', category = '', isActive } = options;
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (isActive !== undefined && isActive !== null) {
      params.append('isActive', isActive);
    }
    const response = await apiClient.get(`/services?${params.toString()}`);
    const data = response.data.data;
    // Normalize services to ensure 'id' field exists (backend uses '_id')
    if (data.services) {
      data.services = data.services.map(service => {
        // Ensure _id is preserved and id is set correctly
        const serviceId = service._id || service.id;
        return {
          ...service,
          _id: serviceId, // Preserve original _id
          id: serviceId, // Set id for frontend compatibility
          price: service.defaultPrice, // Map backend field names
          duration: service.durationMinutes,
        };
      });
    }
    return data;
  },

  /**
   * Get service by ID
   */
  async getServiceById(serviceId) {
    const response = await apiClient.get(`/services/${serviceId}`);
    const service = response.data.data.service;
    // Normalize field names
    return {
      ...service,
      id: service._id || service.id,
      price: service.defaultPrice,
      duration: service.durationMinutes,
    };
  },

  /**
   * Create service
   */
  async createService(serviceData) {
    const response = await apiClient.post('/services', serviceData);
    const service = response.data.data.service;
    return {
      ...service,
      id: service._id || service.id,
    };
  },

  /**
   * Update service
   */
  async updateService(serviceId, updates) {
    const response = await apiClient.put(`/services/${serviceId}`, updates);
    const service = response.data.data.service;
    return {
      ...service,
      id: service._id || service.id,
    };
  },

  /**
   * Delete service
   */
  async deleteService(serviceId) {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data.data;
  },

  /**
   * Activate service
   */
  async activateService(serviceId) {
    const response = await apiClient.patch(`/services/${serviceId}/activate`);
    return response.data.data;
  },

  /**
   * Deactivate service
   */
  async deactivateService(serviceId) {
    const response = await apiClient.patch(`/services/${serviceId}/deactivate`);
    return response.data.data;
  },

  /**
   * Get service categories
   */
  async getCategories() {
    const response = await apiClient.get('/services/categories');
    return response.data.data;
  },
};
