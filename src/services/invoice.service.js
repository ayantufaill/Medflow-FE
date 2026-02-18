import apiClient from '../config/api';

/**
 * Invoice Service
 * Handles all invoice-related API calls
 */

export const invoiceService = {
  /**
   * Get all invoices with pagination and filters
   */
  async getAllInvoices(options = {}) {
    const { page = 1, limit = 10, search = '', status = '', patientId = '', startDate = '', endDate = '' } = options;
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (patientId) params.append('patientId', patientId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await apiClient.get(`/invoices?${params.toString()}`);
    const data = response.data.data;
    // Normalize invoices: map backend fields to frontend expected fields
    if (data.invoices) {
      data.invoices = data.invoices.map(invoice => ({
        ...invoice,
        id: invoice._id || invoice.id,
        // Prefer populated nested objects from backend; fallback only when id field itself is an object.
        patient:
          invoice.patient ||
          (invoice.patientId && typeof invoice.patientId === 'object' ? invoice.patientId : null),
        appointment:
          invoice.appointment ||
          (invoice.appointmentId && typeof invoice.appointmentId === 'object'
            ? invoice.appointmentId
            : null),
      }));
    }
    return data;
  },

  /**
   * Get invoice by ID (includes line items)
   */
  async getInvoiceById(invoiceId) {
    const response = await apiClient.get(`/invoices/${invoiceId}`);
    const { invoice, items } = response.data.data;
    return {
      ...invoice,
      id: invoice._id || invoice.id,
      // Map items to lineItems for frontend display
      lineItems: items?.map(item => ({
        ...item,
        id: item._id || item.id,
        total: item.totalPrice, // Map totalPrice to total for frontend
      })) || [],
    };
  },

  /**
   * Get invoices by patient
   */
  async getInvoicesByPatient(patientId) {
    const response = await apiClient.get(`/invoices/patient/${patientId}`);
    return response.data.data;
  },

  /**
   * Create invoice from appointment
   * NOTE: Backend only supports creating invoices from appointments
   */
  async createInvoiceFromAppointment(appointmentId, invoiceData) {
    const response = await apiClient.post(`/invoices/from-appointment/${appointmentId}`, invoiceData);
    const invoice = response.data.data.invoice;
    // Normalize to ensure 'id' field exists
    return {
      ...invoice,
      id: invoice._id || invoice.id,
    };
  },

  /**
   * Update invoice
   */
  async updateInvoice(invoiceId, updates) {
    const response = await apiClient.patch(`/invoices/${invoiceId}`, updates);
    return response.data.data.invoice;
  },

  /**
   * Delete invoice (only draft invoices can be deleted)
   */
  async deleteInvoice(invoiceId) {
    const response = await apiClient.delete(`/invoices/${invoiceId}`);
    return response.data.data;
  },

  /**
   * Add item to invoice
   */
  async addInvoiceItem(invoiceId, itemData) {
    const response = await apiClient.post(`/invoices/${invoiceId}/items`, itemData);
    return response.data.data;
  },

  /**
   * Update invoice item
   */
  async updateInvoiceItem(invoiceId, itemId, updates) {
    const response = await apiClient.patch(`/invoices/${invoiceId}/items/${itemId}`, updates);
    return response.data.data;
  },

  /**
   * Delete invoice item
   */
  async deleteInvoiceItem(invoiceId, itemId) {
    const response = await apiClient.delete(`/invoices/${invoiceId}/items/${itemId}`);
    return response.data.data;
  },

  /**
   * Recalculate invoice totals
   */
  async recalculateInvoice(invoiceId) {
    const response = await apiClient.post(`/invoices/${invoiceId}/recalculate`);
    return response.data.data;
  },

  /**
   * Generate invoice from appointment
   */
  async generateFromAppointment(appointmentId) {
    const response = await apiClient.post(`/invoices/from-appointment/${appointmentId}`);
    return response.data.data.invoice;
  },

  /**
   * Finalize invoice (change from draft to pending)
   */
  async finalizeInvoice(invoiceId) {
    const response = await apiClient.patch(`/invoices/${invoiceId}/finalize`);
    return response.data.data;
  },

  /**
   * Void invoice
   */
  async voidInvoice(invoiceId, reason) {
    const response = await apiClient.patch(`/invoices/${invoiceId}/void`, { reason });
    return response.data.data;
  },

  /**
   * Get patient account balance
   */
  async getPatientBalance(patientId) {
    const response = await apiClient.get(`/invoices/patient/${patientId}/balance`);
    return response.data.data;
  },
};
