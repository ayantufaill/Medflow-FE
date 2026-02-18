import apiClient from '../config/api';

/**
 * Payment Service
 * Handles all payment-related API calls
 */

export const paymentService = {
  /**
   * Get all payments with pagination and filters
   */
  async getAllPayments(options = {}) {
    const { page = 1, limit = 10, search = '', patientId = '', paymentMethod = '', startDate = '', endDate = '' } = options;
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (patientId) params.append('patientId', patientId);
    if (paymentMethod) params.append('paymentMethod', paymentMethod);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await apiClient.get(`/payments?${params.toString()}`);
    const data = response.data.data;
    // Normalize payments: map backend fields to frontend expected fields
    if (data.payments) {
      data.payments = data.payments.map(payment => ({
        ...payment,
        id: payment._id || payment.id,
        receiptNumber: payment.receiptNumber || payment.paymentCode || payment.referenceNumber || payment._id || payment.id,
        paymentCode: payment.paymentCode || payment.receiptNumber || payment.referenceNumber || payment._id || payment.id,
        patient:
          payment.patient ||
          (payment.patientId && typeof payment.patientId === 'object' ? payment.patientId : null),
        invoice:
          payment.invoice ||
          (payment.invoiceId && typeof payment.invoiceId === 'object' ? payment.invoiceId : null),
        paymentMethod: payment.paymentMethod || payment.method || null,
      }));
    }
    return data;
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId) {
    const response = await apiClient.get(`/payments/${paymentId}`);
    const payment = response.data.data.payment;
    return {
      ...payment,
      id: payment._id || payment.id,
      receiptNumber: payment.receiptNumber || payment.paymentCode || payment.referenceNumber || payment._id || payment.id,
      paymentCode: payment.paymentCode || payment.receiptNumber || payment.referenceNumber || payment._id || payment.id,
      patient:
        payment.patient ||
        (payment.patientId && typeof payment.patientId === 'object' ? payment.patientId : null),
      invoice:
        payment.invoice ||
        (payment.invoiceId && typeof payment.invoiceId === 'object' ? payment.invoiceId : null),
      paymentMethod: payment.paymentMethod || payment.method || null,
    };
  },

  /**
   * Get payments by patient
   */
  async getPaymentsByPatient(patientId) {
    const response = await apiClient.get(`/payments/patient/${patientId}`);
    return response.data.data;
  },

  /**
   * Get payments by invoice
   */
  async getPaymentsByInvoice(invoiceId) {
    const response = await apiClient.get(`/payments/invoice/${invoiceId}`);
    return response.data.data;
  },

  /**
   * Record payment
   */
  async recordPayment(paymentData) {
    const response = await apiClient.post('/payments', paymentData);
    const payment = response.data.data.payment;
    return {
      ...payment,
      id: payment._id || payment.id,
      receiptNumber: payment.receiptNumber || payment.paymentCode || payment.referenceNumber || payment._id || payment.id,
      paymentCode: payment.paymentCode || payment.receiptNumber || payment.referenceNumber || payment._id || payment.id,
      patient:
        payment.patient ||
        (payment.patientId && typeof payment.patientId === 'object' ? payment.patientId : null),
      invoice:
        payment.invoice ||
        (payment.invoiceId && typeof payment.invoiceId === 'object' ? payment.invoiceId : null),
      paymentMethod: payment.paymentMethod || payment.method || null,
    };
  },

  /**
   * Create payment (alias for recordPayment)
   */
  async createPayment(paymentData) {
    return this.recordPayment(paymentData);
  },

  /**
   * Apply payment to invoice
   */
  async applyPayment(paymentId, invoiceId, amount) {
    const response = await apiClient.post(`/payments/${paymentId}/apply`, { invoiceId, amount });
    return response.data.data;
  },

  /**
   * Void payment
   */
  async voidPayment(paymentId, reason) {
    const response = await apiClient.patch(`/payments/${paymentId}/void`, { reason });
    return response.data.data;
  },

  /**
   * Get payment methods
   */
  getPaymentMethods() {
    return [
      { value: 'cash', label: 'Cash', icon: '💵' },
      { value: 'credit_card', label: 'Credit Card', icon: '💳' },
      { value: 'debit_card', label: 'Debit Card', icon: '💳' },
      { value: 'check', label: 'Check', icon: '📝' },
      { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
      { value: 'other', label: 'Other', icon: '📱' },
    ];
  },
};
