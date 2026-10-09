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
    const { page = 1, limit = 10, search = '', status = '', patientId = '', startDate = '', endDate = '', includeItems = false } = options;
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (patientId) params.append('patientId', patientId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (includeItems) params.append('includeItems', 'true');
    const response = await apiClient.get(`/invoices?${params.toString()}`);
    const data = response.data.data;
    // Normalize invoices: map backend fields to frontend expected fields
    if (data.invoices) {
      data.invoices = data.invoices.map(invoice => ({
        ...invoice,
        id: invoice._id || invoice.id,
        // If backend returned items inline, map them to lineItems
        lineItems: invoice.lineItems || invoice.items?.map(item => ({
          ...item,
          id: item._id || item.id,
          total: item.totalPrice,
        })) || undefined,
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
      insuranceCompany: invoice.insuranceCompany ?? null,
      secondaryInsuranceCompany: invoice.secondaryInsuranceCompany ?? null,
      // The patient's active coverages, ordinal-ordered. This is what the
      // estimator actually priced the lines against, so it is the reliable
      // source for carrier names — the invoice's own insuranceCompany is only
      // set when the invoice was created from an appointment with a carrier
      // attached, and is null otherwise.
      coverages: invoice.coverages ?? [],
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
    return {
      ...invoice,
      id: invoice._id || invoice.id,
    };
  },

  /**
   * Create standalone invoice directly with items
   */
  async createStandaloneInvoice(invoiceData) {
    const response = await apiClient.post('/invoices', invoiceData);
    const invoice = response.data.data;
    return {
      ...invoice,
      id: invoice._id || invoice.id,
    };
  },

  /**
   * Apply a late fee to one or more of a patient's overdue invoices.
   *
   * Ages, tier buckets, balances and the one-fee-per-invoice-per-tier rule are
   * all recomputed server-side; invoices that turn out to be ineligible come
   * back under `rejected` rather than being charged.
   */
  async applyLateFee({ patientId, tier, invoiceIds, mode, rate, basis, branchId }) {
    const response = await apiClient.post('/invoices/late-fee', {
      patientId,
      tier,
      invoiceIds,
      mode,
      rate,
      basis,
      branchId,
    });
    return response.data.data;
  },

  /**
   * Invoices eligible for a late-fee tier.
   *
   * Server-computed so the dialog and the charge always agree on tier buckets
   * and on which invoices already carry a fee for this tier.
   */
  async getLateFeeEligibility(patientId, tier) {
    const response = await apiClient.get(
      `/invoices/patient/${patientId}/late-fee-eligibility`,
      { params: { tier } },
    );
    return response.data.data;
  },

  /**
   * Update invoice
   */
  async updateInvoice(invoiceId, updates) {
    const response = await apiClient.patch(`/invoices/${invoiceId}`, updates);
    return response.data.data.invoice;
  },

  /**
   * Void a single procedure on an invoice. The row is kept (flagged voided)
   * rather than deleted, so the invoice can still list it.
   */
  async voidInvoiceItem(invoiceId, itemId, reason) {
    const response = await apiClient.patch(`/invoices/${invoiceId}/items/${itemId}/void`, { reason });
    return response.data.data;
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
   * Mark a line item as (partially) paid — stores paidAmount in BillingNote
   */
  async markItemPaid(invoiceId, itemId, amount) {
    const response = await apiClient.patch(`/invoices/${invoiceId}/items/${itemId}/paid`, { amount });
    return response.data;
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
    const response = await apiClient.post(`/invoices/${invoiceId}/recalculate`, {});
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

  /**
   * Get patient composite ledger (invoices, adjustments, payments, claims)
   */
  async getPatientCompositeLedger(patientId) {
    // Invoices are the ledger's backbone — if that call fails there is genuinely
    // nothing to render, so it is the only one allowed to reject.
    const invoicesResult = await this.getAllInvoices({ patientId, limit: 1000 });

    // Adjustments / payments / claims only *enrich* the invoice rows. They are
    // fetched with allSettled rather than Promise.all because each sits behind
    // its own permission (`adjustments.read`, `payments.read`, `claims.read`):
    // with Promise.all a single 403 — e.g. a Biller whose role is missing
    // `adjustments.read` — rejected the whole thunk and the ledger rendered
    // completely empty, hiding invoices the user had just created. Degrade one
    // panel at a time instead of blanking the page.
    const [adjustmentsResult, paymentsResult, claimsResult] = await Promise.allSettled([
      apiClient.get(`/adjustments?patientId=${patientId}&limit=1000`),
      apiClient.get(`/payments/patient/${patientId}?limit=1000`),
      apiClient.get(`/claims?patientId=${patientId}&limit=1000`),
    ]);

    // Unwrap an allSettled entry, logging why a section came back empty so a
    // silent 403 is still traceable in the console.
    const settledRows = (settled, key) => {
      if (settled.status === 'fulfilled') {
        return settled.value.data?.data?.[key] || [];
      }
      console.warn(
        `Composite ledger: could not load ${key} for patient ${patientId} — ` +
          `rendering the ledger without them.`,
        settled.reason?.response?.status,
        settled.reason?.response?.data?.error?.message || settled.reason?.message
      );
      return [];
    };

    const invoices = invoicesResult.invoices || [];
    // Pre-fetch details (line items) for all invoices in parallel
    const enrichedInvoices = await Promise.all(
      invoices.map(async (inv) => {
        try {
          const detail = await this.getInvoiceById(inv._id || inv.id);
          return {
            ...inv,
            ...detail,
            lineItems: detail.lineItems,
          };
        } catch (e) {
          return inv;
        }
      })
    );

    return {
      invoices: enrichedInvoices,
      adjustments: settledRows(adjustmentsResult, 'adjustments'),
      payments: settledRows(paymentsResult, 'payments'),
      claims: settledRows(claimsResult, 'claims'),
    };
  },

  /**
   * Estimate insurance and patient portions for invoice items
   */
  async estimateInvoiceItems(patientId, items) {
    const response = await apiClient.post('/invoices/estimate', { patientId, items });
    return response.data.data;
  },

  /**
   * Reject a claim and transfer its expected amount to patient balance
   */
  async transferRejectedClaim(invoiceId, claimId) {
    const url = invoiceId && invoiceId !== 'undefined'
      ? `/invoices/${invoiceId}/transfer-rejected-claim`
      : `/invoices/transfer-rejected-claim`;
    const response = await apiClient.post(url, { claimId, invoiceId });
    return response.data.data;
  },
};


