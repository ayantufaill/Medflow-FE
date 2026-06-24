/**
 * Billing Slice - Redux State Management
 * 
 * Purpose:
 * Manages billing and revenue cycle state:
 * - Current invoice being processed
 * - Claim status tracking
 * - Payment plan management
 * - A/R aging calculations
 * 
 * Why Redux instead of local state:
 * - Invoice state affects multiple billing pages
 * - Claim status needs to be tracked across modules
 * - Payment plans need to be accessible from patient and billing modules
 * - Complex calculations (A/R aging) benefit from centralized state
 * - Financial data requires predictable state updates (audit compliance)
 * 
 * @author Senior Software Engineer
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/api';
import { invoiceService } from '../../services/invoice.service';
import { claimService } from '../../services/claim.service';
import { paymentService } from '../../services/payment.service';
import { reportingService } from '../../services/reporting.service';
import dayjs from 'dayjs';

/**
 * Inline concurrency limiter — runs at most `concurrency` promises at a time.
 * Prevents N+1 waterfall of individual invoice detail requests.
 */
function withConcurrency(concurrency, tasks) {
  return new Promise((resolve) => {
    const results = new Array(tasks.length);
    let started = 0;
    let finished = 0;
    function runNext() {
      if (started === tasks.length) return;
      const idx = started++;
      Promise.resolve()
        .then(() => tasks[idx]())
        .then((r) => { results[idx] = r; })
        .catch(() => { results[idx] = null; })
        .finally(() => {
          finished++;
          if (finished === tasks.length) resolve(results);
          else runNext();
        });
    }
    for (let i = 0; i < Math.min(concurrency, tasks.length); i++) runNext();
    if (tasks.length === 0) resolve(results);
  });
}

export const createInvoice = createAsyncThunk(
  'billing/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const result = await invoiceService.createStandaloneInvoice(invoiceData);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create invoice');
    }
  }
);

// ---------------------------------------------------------------------------
// Ledger thunks
// ---------------------------------------------------------------------------

/**
 * Fetch invoices + adjustments for a patient and merge them into a sorted
 * ledger list. Result is cached by patientId.
 */
export const fetchLedgerItems = createAsyncThunk(
  'billing/fetchLedgerItems',
  async (patientId, { rejectWithValue }) => {
    try {
      const composite = await invoiceService.getPatientCompositeLedger(patientId);
      const { invoices = [], adjustments = [], payments = [], claims = [] } = composite;

      const mappedInvoices = invoices.map((invoice) => {
        // Reconstruct the original total charge. The backend may update totalAmount to
        // reflect the remaining balance (not the original charge) after a payment is recorded.
        // The only reliable source is: paidAmount + balanceDue when a payment exists.
        const rawTotal = Number(invoice.totalAmount || 0);
        const rawPaid  = Number(invoice.paidAmount   || 0);
        const rawBal   = Number(invoice.balanceDue   || 0);
        const rawPt    = Number(invoice.patientPortion   || 0);
        const rawIns   = Number(invoice.insurancePortion || 0);
        const originalTotal = rawPaid > 0
          ? rawPaid + rawBal          // payment exists → paidAmount + remaining = original charge
          : rawTotal > 0 ? rawTotal   // no payment yet, backend still has original totalAmount
          : rawPt + rawIns;           // last resort: sum of portions

        // Map payments and claims associated with this invoice
        const invoicePms = payments.filter((p) => String(p.invoiceId) === String(invoice._id || invoice.id));
        const invoiceClaims = claims.filter((c) => 
          String(c.invoiceRefId) === String(invoice._id || invoice.id) || 
          String(c.invoice?._id || c.invoice?.id || '') === String(invoice._id || invoice.id) ||
          (c.selectedItems && c.selectedItems.some((item) => String(item.invoiceId) === String(invoice._id || invoice.id)))
        );

        let totalPaidAmt = 0;
        let runningBalance = originalTotal;
        const paymentsMapped = invoicePms.map((payment) => {
          const paymentAmt = Number(payment.amount || 0);
          totalPaidAmt += paymentAmt;
          runningBalance -= paymentAmt;
          return {
            id: payment._id || payment.id,
            title: `Pt Payment #${payment.receiptNumber || payment.paymentCode || payment.id} with: ${payment.paymentMethod || 'Patient Check'} : $${paymentAmt.toFixed(2)} / $${paymentAmt.toFixed(2)}`,
            amount: `$${Math.max(0, runningBalance).toFixed(2)}`,
            isPayment: true,
          };
        });

        const claimsMapped = invoiceClaims.map((claim) => ({
          id: claim.id || claim._id,
          title: `Ins Claim #${claim.claimNumber || claim.id} (${claim.statusDisplay || claim.status}) with: ${claim.insuranceCompany?.name || 'Insurance'}`,
          amount: `$${Number(claim.totalAmount || 0).toFixed(2)}`,
          isClaim: true,
          isPayment: false,
        }));

        let detailsMapped = [];
        if (invoice.lineItems?.length > 0) {
          const combinedTitle = invoice.lineItems
            .map((l) => l.description || 'Procedure')
            .join(', ');
          const totalAmount = invoice.lineItems.reduce(
            (sum, line) => sum + Number(line.total || line.totalPrice || 0),
            0
          );
          detailsMapped = [{
            id: invoice.invoiceNumber || invoice._id || invoice.id,
            title: combinedTitle,
            amount: `$${totalAmount.toFixed(2)}`,
            isGrouped: true,
            isPayment: false,
          }];
        }

        return {
          id: invoice._id || invoice.id,
          invoiceNumber: invoice.invoiceNumber || invoice._id || invoice.id,
          date: invoice.invoiceDate ? dayjs(invoice.invoiceDate).format('MM/DD/YYYY') : 'N/A',
          rawDate: invoice.invoiceDate || '',
          method: 'Invoice',
          amount: `$${originalTotal.toFixed(2)}`,
          totalAmount: `$${originalTotal.toFixed(2)}`,
          color: '#5c6bc0',
          isAdjustment: false,
          initials: 'STAFF',
          success:
            String(invoice.status || '').toLowerCase() !== 'draft' &&
            String(invoice.status || '').toLowerCase() !== 'voided' &&
            String(invoice.status || '').toLowerCase() !== 'void',
          summary: {
            insWo:    '$0.00',
            ptBal:    `$${rawPt.toFixed(2)}`,
            insBal:   `$${rawIns.toFixed(2)}`,
            invBal:   `$${rawBal.toFixed(2)}`,
            appliedWo:'$0.00',
            ptPaid:   `$${(totalPaidAmt || rawPaid).toFixed(2)}`,
            insPaid:  '$0.00',
          },
          details: [...paymentsMapped, ...claimsMapped, ...detailsMapped],
        };
      });

      const mappedAdjustments = adjustments.map((adj) => {
        const amt = Number(adj.amount || 0);
        return {
          id: adj._id || adj.id,
          invoiceNumber: `Adj #${adj._id || adj.id}`,
          date: adj.date ? dayjs(adj.date).format('MM/DD/YYYY') : 'N/A',
          rawDate: adj.date || '',
          method: 'Adjustment',
          amount: `$${Math.abs(amt).toFixed(2)}`,
          color: '#7e57c2',
          isAdjustment: true,
          useCheckmark: false,
          initials: 'STAFF',
          success: true,
          summary: {
            insWo:     '$0.00',
            ptBal:     `$${amt.toFixed(2)}`,
            insBal:    '$0.00',
            invBal:    `$${amt.toFixed(2)}`,
            appliedWo: '$0.00',
            ptPaid:    '$0.00',
            insPaid:   '$0.00',
          },
          details: [
            {
              id: adj._id || adj.id,
              title: adj.notes || 'Patient Account Adjustment',
              amount: `$${amt.toFixed(2)}`,
            },
          ],
        };
      });

      const combined = [...mappedInvoices, ...mappedAdjustments];
      combined.sort((a, b) => {
        const dateA = a.rawDate ? new Date(a.rawDate).getTime() : 0;
        const dateB = b.rawDate ? new Date(b.rawDate).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return String(b.id).localeCompare(String(a.id));
      });

      return { patientId, items: combined };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch ledger');
    }
  }
);

/**
 * Load full line-item details + payments for a single invoice row and merge
 * them back into the cached ledger list for a patient.
 */
export const fetchInvoiceDetails = createAsyncThunk(
  'billing/fetchInvoiceDetails',
  async ({ patientId, invoiceId }, { rejectWithValue }) => {
    try {
      const fullInvoice = await invoiceService.getInvoiceById(invoiceId);

      let totalPaidAmt  = 0;
      let paymentsMapped = [];
      try {
        const paymentsResponse = await paymentService.getPaymentsByInvoice(invoiceId);
        const payments = paymentsResponse?.payments || paymentsResponse || [];
        const invTotal  = Number(fullInvoice.totalAmount || 0);
        const invPaid   = Number(fullInvoice.paidAmount  || 0);
        const invBal    = Number(fullInvoice.balanceDue  || 0);
        const invPt     = Number(fullInvoice.patientPortion || 0);
        const trueTotal = invPaid > 0
          ? invPaid + invBal
          : invTotal > 0 ? invTotal
          : invPt > 0 ? invPt
          : invBal;
        let runningBalance = trueTotal;
        paymentsMapped = (Array.isArray(payments) ? payments : []).map((payment) => {
          const paymentAmt = Number(payment.amount || 0);
          totalPaidAmt += paymentAmt;
          runningBalance -= paymentAmt;
          return {
            id: payment._id || payment.id,
            title: `Pt Payment #${payment.receiptNumber || payment.paymentCode || payment.id} with: ${payment.paymentMethod || 'Patient Check'} : $${paymentAmt.toFixed(2)} / $${paymentAmt.toFixed(2)}`,
            amount: `$${Math.max(0, runningBalance).toFixed(2)}`,
            isPayment: true,
          };
        });
      } catch (e) {
        console.error('Failed to fetch payments for invoice', e);
      }

      let claimsMapped = [];
      try {
        const claimsResponse = await claimService.getAllClaims({ invoiceId });
        const claims = claimsResponse?.claims || claimsResponse || [];
        claimsMapped = (Array.isArray(claims) ? claims : []).map((claim) => ({
          id: claim.id || claim._id,
          title: `Ins Claim #${claim.claimNumber || claim.id} (${claim.statusDisplay || claim.status}) with: ${claim.insuranceCompany?.name || 'Insurance'}`,
          amount: `$${Number(claim.totalAmount || 0).toFixed(2)}`,
          isClaim: true,
          isPayment: false,
        }));
      } catch (e) {
        console.error('Failed to fetch claims for invoice', e);
      }

      let detailsMapped = [];
      if (fullInvoice.lineItems?.length > 0) {
        const combinedTitle = fullInvoice.lineItems
          .map((l) => l.description || 'Procedure')
          .join(', ');
        const totalAmount = fullInvoice.lineItems.reduce(
          (sum, line) => sum + Number(line.total || line.totalPrice || 0),
          0
        );
        detailsMapped = [{
          id: fullInvoice.invoiceNumber || fullInvoice._id || fullInvoice.id,
          title: combinedTitle,
          amount: `$${totalAmount.toFixed(2)}`,
          isGrouped: true,
          isPayment: false,
        }];
      }

      return {
        patientId,
        invoiceId,
        details: [...paymentsMapped, ...claimsMapped, ...detailsMapped],
        totalPaidAmt,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch invoice details');
    }
  },
  {
    condition: ({ patientId, invoiceId }, { getState }) => {
      const { billing } = getState();
      if (billing.detailsFetchingSet.includes(invoiceId)) return false;
      const items = billing.ledgerCache[patientId] || [];
      const cachedItem = items.find((i) => i.id === invoiceId);
      if (cachedItem && cachedItem.details && cachedItem.details.length > 0) return false;
      return true;
    },
  }
);

/**
 * Backdate an invoice or adjustment, then re-fetch the ledger.
 */
export const backdateTransaction = createAsyncThunk(
  'billing/backdateTransaction',
  async ({ patientId, itemId, date, isAdjustment }, { dispatch, rejectWithValue }) => {
    try {
      if (isAdjustment) {
        await apiClient.patch(`/adjustments/${itemId}`, { date: new Date(date) });
      } else {
        await invoiceService.updateInvoice(itemId, { dueDate: new Date(date) });
      }
      await dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to backdate transaction');
    }
  }
);

/**
 * Void (delete) an invoice item, a full invoice, or an adjustment.
 */
export const voidTransaction = createAsyncThunk(
  'billing/voidTransaction',
  async ({ patientId, invoiceId, itemId, isAdjustment, isGrouped }, { dispatch, rejectWithValue }) => {
    try {
      if (isAdjustment) {
        await apiClient.delete(`/adjustments/${invoiceId}`);
      } else if (isGrouped) {
        await apiClient.delete(`/admin-finance/invoices/${invoiceId}`);
      } else {
        await invoiceService.deleteInvoiceItem(invoiceId, itemId);
      }
      await dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to void transaction');
    }
  }
);

/**
 * Apply a courtesy credit adjustment for a procedure.
 */
export const applyCourtesyCredit = createAsyncThunk(
  'billing/applyCourtesyCredit',
  async ({ patientId, procedureId, invoiceId, adjustmentType, creditAmount }, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.post('/adjustments', {
        patientId,
        amount: -Math.abs(creditAmount),
        date: new Date(),
        notes: `${adjustmentType} applied to Procedure #${procedureId}`,
      });
      if (invoiceId) {
        await apiClient.post(`/invoices/${invoiceId}/recalculate`);
      }
      await dispatch(fetchLedgerItems(patientId));
      return { procedureId, invoiceId, adjustmentType };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to apply courtesy credit');
    }
  }
);

/**
 * Undo a courtesy credit by finding and deleting the matching adjustment.
 */
export const undoCourtesyCredit = createAsyncThunk(
  'billing/undoCourtesyCredit',
  async ({ patientId, procedureId, invoiceId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/adjustments?patientId=${patientId}&limit=1000`);
      const adjustments = response.data?.data?.adjustments || [];
      const target = adjustments.find(
        (adj) => adj.notes && adj.notes.includes(`Procedure #${procedureId}`)
      );
      if (target) {
        await apiClient.delete(`/adjustments/${target._id || target.id}`);
      }
      if (invoiceId) {
        await apiClient.post(`/invoices/${invoiceId}/recalculate`);
      }
      await dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to undo courtesy credit');
    }
  }
);

// ---------------------------------------------------------------------------
// AddPaymentDialog — draft invoices with per-item remaining balances
// ---------------------------------------------------------------------------

/**
 * Fetch draft invoices for payment allocation. Enriches each line item with
 * patient/insurance balance breakdowns and filters out fully-paid items.
 * Cached by patientId in `paymentInvoicesCache`.
 */
export const fetchPaymentDraftInvoices = createAsyncThunk(
  'billing/fetchPaymentDraftInvoices',
  async (patientId, { rejectWithValue }) => {
    try {
      const res = await invoiceService.getAllInvoices({ patientId, status: 'draft', limit: 1000, includeItems: true });
      const fetchedInvoices = res.invoices || [];

      // Skip individual detail fetches if backend returned items inline
      const needsDetailFetch = fetchedInvoices.some((inv) => !inv.lineItems);

      const rawInvoices = needsDetailFetch
        ? await withConcurrency(3, fetchedInvoices.map((inv) => async () => {
            if (inv.lineItems) return inv;
            try { return await invoiceService.getInvoiceById(inv._id || inv.id); }
            catch { return null; }
          }))
        : fetchedInvoices;

      const enrichedInvoices = rawInvoices
        .filter(Boolean)
        .map((fullInv) => ({
          ...fullInv,
          checked: false,
          lineItems: (fullInv.lineItems || []).map((item) => {
            const writeoff = Number(item.writeoff || item.writeoffAmount || 0);
            // Try all possible field names the backend might use for insurance/patient portions
            const ins = Number(
              item.insPortion      ||
              item.insurancePortion ||
              item.insAmt          ||
              item.insurance       ||
              0
            );
            const pt = Number(
              item.ptPortion    ||
              item.patientPortion ||
              item.ptAmt        ||
              0
            );
            const total = Number(item.total || item.totalPrice || item.amount || 0);
            const owed  = Math.max(0, total - writeoff);

            let patientBal, insBal;
            if (item.dbi === true) {
              // Direct Bill Insurance override: patient owes everything remaining
              patientBal = owed; insBal = 0;
            } else if (item.dbi === false) {
              // Explicitly not DBI: patient pays their ptPortion, insurance pays the rest
              patientBal = pt; insBal = Math.max(0, owed - pt);
            } else if (ins > 0 && pt > 0) {
              // Both portions set: use them directly
              patientBal = pt; insBal = ins;
            } else if (ins > 0 && pt === 0) {
              // Insurance-only procedure: patient owes nothing, insurance owes the balance
              patientBal = 0; insBal = owed;
            } else if (pt > 0 && ins === 0) {
              // Patient-only procedure
              patientBal = pt; insBal = 0;
            } else {
              // No portions set: full remaining goes to patient
              patientBal = owed; insBal = 0;
            }

            const alreadyPaid  = Number(item.paidAmount || 0);
            const remainingBal = Math.max(0, owed - alreadyPaid);
            return {
              ...item,
              checked: false,
              // payAmount = what the patient still owes on their share, capped at total remaining
              payAmount:       Math.min(Math.max(0, patientBal - alreadyPaid), remainingBal).toFixed(2),
              patientBalance:  patientBal,
              writeoffAmount:  writeoff,
              insuranceAmount: insBal,
              totalAmount:     total,
              remainingBal,
            };
          }),
        }));

      // Keep only invoices that still have items with remaining balances
      const result = enrichedInvoices
        .filter((inv) => (inv.lineItems || []).some((item) => Number(item.remainingBal) > 0))
        .map((inv) => ({
          ...inv,
          lineItems: (inv.lineItems || []).filter((item) => Number(item.remainingBal) > 0),
        }));

      return { patientId, invoices: result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch payment invoices');
    }
  },
  {
    /**
     * Skip if already fetching or already cached for this patient.
     */
    condition: (patientId, { getState }) => {
      const { billing } = getState();
      // Only block if a fetch is already in-flight for this patient
      if (billing.paymentInvoicesFetchingSet?.includes(patientId)) return false;
      return true;
    },
  }
);

export const fetchBillingConfiguration = createAsyncThunk(
  'billing/fetchConfiguration',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/billing_configuration', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.billingConfigLoading) return false;
    }
  }
);

export const saveBillingConfiguration = createAsyncThunk(
  'billing/saveConfiguration',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/billing_configuration', configData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchARAutomationConfig = createAsyncThunk(
  'billing/fetchARAutomationConfig',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/ar_automation_config', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.arAutomationLoading) return false;
    }
  }
);

export const saveARAutomationConfig = createAsyncThunk(
  'billing/saveARAutomationConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/ar_automation_config', configData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAdjustmentTypes = createAsyncThunk(
  'billing/fetchAdjustmentTypes',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/definitions/1', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.adjustmentTypesLoading || billing.adjustmentTypes.length > 0) return false;
      return true;
    }
  }
);

export const createAdjustmentType = createAsyncThunk(
  'billing/createAdjustmentType',
  async (adjustmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin-finance/definitions/1', adjustmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAdjustmentType = createAsyncThunk(
  'billing/updateAdjustmentType',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin-finance/definitions/item/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAdjustmentType = createAsyncThunk(
  'billing/deleteAdjustmentType',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/definitions/item/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentTypes = createAsyncThunk(
  'billing/fetchPaymentTypes',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/definitions/4', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTypesLoading || billing.paymentTypes.length > 0) return false;
      return true;
    }
  }
);

export const createPaymentType = createAsyncThunk(
  'billing/createPaymentType',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin-finance/definitions/4', paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePaymentType = createAsyncThunk(
  'billing/updatePaymentType',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin-finance/definitions/item/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePaymentType = createAsyncThunk(
  'billing/deletePaymentType',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/definitions/item/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentTypeDefaults = createAsyncThunk(
  'billing/fetchPaymentTypeDefaults',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/payment_types_defaults', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTypeDefaultsLoading) return false;
      return true;
    }
  }
);

export const savePaymentTypeDefaults = createAsyncThunk(
  'billing/savePaymentTypeDefaults',
  async (defaultsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/payment_types_defaults', defaultsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentTerminals = createAsyncThunk(
  'billing/fetchPaymentTerminals',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/payment_terminals', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTerminalsLoading) return false;
      return true;
    }
  }
);

export const savePaymentTerminals = createAsyncThunk(
  'billing/savePaymentTerminals',
  async (terminalsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/payment_terminals', terminalsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArAgingReport = createAsyncThunk(
  'billing/fetchArAgingReport',
  async (_, { rejectWithValue }) => {
    try {
      const data = await reportingService.getFinancialReport('aging');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.arAgingLoading || billing.arAging) return false;
      return true;
    }
  }
);

export const fetchPatientAgingReport = createAsyncThunk(
  'billing/fetchPatientAgingReport',
  async (_, { rejectWithValue }) => {
    try {
      const data = await reportingService.getFinancialReport('patient-aging');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.patientAgingLoading || billing.patientAging) return false;
      return true;
    }
  }
);

export const fetchModificationsReport = createAsyncThunk(
  'billing/fetchModificationsReport',
  async ({ date, range }, { rejectWithValue }) => {
    try {
      const data = await reportingService.getFinancialReport('modifications', { date, range });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPatientAccountNotes = createAsyncThunk(
  'billing/fetchPatientAccountNotes',
  async (patient, { rejectWithValue }) => {
    const patientId = typeof patient === 'object' ? (patient.id || patient.name) : patient;
    const patientName = typeof patient === 'object' ? patient.name : patient;
    try {
      const response = await apiClient.get(`/patients/${patientId}/account-notes`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to localStorage', error);
      const stored = localStorage.getItem(`account_notes_${patientName}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
      const seedNotes = [
        {
          id: 'seed-1',
          date: '06/14/2022',
          source: 'agingReport',
          text: 'This is an account note',
          remindMe: false,
          archived: false,
        }
      ];
      localStorage.setItem(`account_notes_${patientName}`, JSON.stringify(seedNotes));
      return seedNotes;
    }
  }
);

export const createPatientAccountNote = createAsyncThunk(
  'billing/createPatientAccountNote',
  async ({ patient, text }, { rejectWithValue }) => {
    const patientId = typeof patient === 'object' ? (patient.id || patient.name) : patient;
    const patientName = typeof patient === 'object' ? patient.name : patient;
    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US'),
      source: 'agingReport',
      text: text,
      remindMe: false,
      archived: false,
    };
    try {
      const response = await apiClient.post(`/patients/${patientId}/account-notes`, newNote);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, saving to localStorage', error);
      const stored = localStorage.getItem(`account_notes_${patientName}`);
      let notesList = [];
      if (stored) {
        try {
          notesList = JSON.parse(stored);
        } catch (e) {}
      }
      notesList.push(newNote);
      localStorage.setItem(`account_notes_${patientName}`, JSON.stringify(notesList));
      return notesList;
    }
  }
);

export const updatePatientAccountNote = createAsyncThunk(
  'billing/updatePatientAccountNote',
  async ({ patient, noteId, updates }, { rejectWithValue }) => {
    const patientId = typeof patient === 'object' ? (patient.id || patient.name) : patient;
    const patientName = typeof patient === 'object' ? patient.name : patient;
    try {
      const response = await apiClient.put(`/patients/${patientId}/account-notes/${noteId}`, updates);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, updating in localStorage', error);
      const stored = localStorage.getItem(`account_notes_${patientName}`);
      let notesList = [];
      if (stored) {
        try {
          notesList = JSON.parse(stored);
        } catch (e) {}
      }
      const updatedList = notesList.map(n => {
        if (n.id === noteId || String(n.id) === String(noteId)) {
          return { ...n, ...updates };
        }
        return n;
      });
      localStorage.setItem(`account_notes_${patientName}`, JSON.stringify(updatedList));
      return updatedList;
    }
  }
);

const initialState = {
  // Current invoice being viewed/edited
  currentInvoice: null,

  // Selected invoice ID
  selectedInvoiceId: null,

  // Claim status map (claimId -> status)
  claimStatus: {},

  // Payment plans
  paymentPlans: [],

  // A/R aging data
  arAging: null,
  arAgingLoading: false,

  // Patient aging data
  patientAging: null,
  patientAgingLoading: false,

  // Modifications Report
  modificationsData: [],
  modificationsLoading: false,
  modificationsError: null,
  
  // Billing Configuration
  billingConfiguration: null,
  billingConfigLoading: false,

  // AR Automation Configuration
  arAutomationConfig: null,
  arAutomationLoading: false,

  // Adjustment Types
  adjustmentTypes: [],
  adjustmentTypesLoading: false,

  // Payment Types
  paymentTypes: [],
  paymentTypesLoading: false,
  paymentTypeDefaults: { patient: 'Master Card', insurance: 'Master Card', family: '' },
  
  // Payment Terminals
  paymentTerminals: { openEdge: [], prosperipay: [], payrix: [] },
  paymentTerminalsLoading: false,

  // UI state
  loading: false,
  error: null,

  // Ledger state — per-patient ledger items
  ledgerCache: {},       // { [patientId]: LedgerItem[] }
  ledgerLoading: false,
  ledgerError: null,
  detailsFetchingSet: [], // invoice IDs currently being fetched — prevents duplicate requests

  // AddPaymentDialog — draft invoices for payment allocation
  paymentInvoicesCache: {},   // { [patientId]: Invoice[] }
  paymentInvoicesLoading: false,
  paymentInvoicesError: null,
  paymentInvoicesFetchingSet: [], // patientIds currently being fetched

  // Per-invoice adjustmentTypes map { [invoiceId-itemId]: string }
  adjustmentTypeMap: {},

  // Patient Account Notes state
  patientAccountNotes: [],
  patientAccountNotesLoading: false,
  patientAccountNotesError: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    /**
     * Set current invoice
     */
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
      state.selectedInvoiceId = action.payload?._id || action.payload?.id || null;
      state.error = null;
    },

    /**
     * Set selected invoice ID
     */
    setSelectedInvoiceId: (state, action) => {
      state.selectedInvoiceId = action.payload;
    },

    /**
     * Update claim status
     * Used for tracking claim processing across modules
     */
    updateClaimStatus: (state, action) => {
      const { claimId, status } = action.payload;
      state.claimStatus[claimId] = status;
    },

    /**
     * Set multiple claim statuses
     * Used when loading claim list
     */
    setClaimStatuses: (state, action) => {
      state.claimStatus = action.payload;
    },

    /**
     * Set payment plans
     */
    setPaymentPlans: (state, action) => {
      state.paymentPlans = action.payload;
    },

    /**
     * Add payment plan
     */
    addPaymentPlan: (state, action) => {
      state.paymentPlans.push(action.payload);
    },

    /**
     * Set A/R aging data
     */
    setArAging: (state, action) => {
      state.arAging = action.payload;
    },

    /**
     * Clear current invoice
     */
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
      state.selectedInvoiceId = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Set error state
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── AddPaymentDialog checkbox reducers ──────────────────────────────────

    /** Toggle an entire payment invoice's checked state (and all its line items). */
    togglePaymentInvoiceChecked: (state, action) => {
      const { patientId, invoiceId } = action.payload;
      const invoices = state.paymentInvoicesCache[patientId];
      if (!invoices) return;
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) return;
      inv.checked = !inv.checked;
      inv.lineItems.forEach((item) => { item.checked = inv.checked; });
    },

    /** Toggle a single payment line-item's checked state. */
    togglePaymentLineItemChecked: (state, action) => {
      const { patientId, invoiceId, itemId } = action.payload;
      const invoices = state.paymentInvoicesCache[patientId];
      if (!invoices) return;
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) return;
      const item = inv.lineItems.find((li) => li.id === itemId);
      if (item) item.checked = !item.checked;
      inv.checked = inv.lineItems.length > 0 && inv.lineItems.every((li) => li.checked);
    },

    /** Evict cached payment invoices for a patient. */
    invalidatePaymentInvoices: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.paymentInvoicesCache[patientId];
        state.paymentInvoicesFetchingSet = state.paymentInvoicesFetchingSet.filter((id) => id !== patientId);
      } else {
        state.paymentInvoicesCache = {};
        state.paymentInvoicesFetchingSet = [];
      }
    },

    /** Record the adjustment type applied to a procedure key (invoiceId-itemId). */
    setAdjustmentTypeForItem: (state, action) => {
      const { key, adjustmentType } = action.payload;
      state.adjustmentTypeMap[key] = adjustmentType;
    },

    /** Invalidate (clear) cached ledger for a patient to force re-fetch. */
    invalidateLedger: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.ledgerCache[patientId];
      } else {
        state.ledgerCache = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingConfiguration.pending, (state) => {
        state.billingConfigLoading = true;
      })
      .addCase(fetchBillingConfiguration.fulfilled, (state, action) => {
        state.billingConfigLoading = false;
        state.billingConfiguration = action.payload;
      })
      .addCase(fetchBillingConfiguration.rejected, (state, action) => {
        state.billingConfigLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(saveBillingConfiguration.pending, (state) => {
        state.billingConfigLoading = true;
      })
      .addCase(saveBillingConfiguration.fulfilled, (state, action) => {
        state.billingConfigLoading = false;
        state.billingConfiguration = action.payload;
      })
      .addCase(saveBillingConfiguration.rejected, (state, action) => {
        state.billingConfigLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchARAutomationConfig.pending, (state) => {
        state.arAutomationLoading = true;
      })
      .addCase(fetchARAutomationConfig.fulfilled, (state, action) => {
        state.arAutomationLoading = false;
        state.arAutomationConfig = action.payload;
      })
      .addCase(fetchARAutomationConfig.rejected, (state, action) => {
        state.arAutomationLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(saveARAutomationConfig.pending, (state) => {
        state.arAutomationLoading = true;
      })
      .addCase(saveARAutomationConfig.fulfilled, (state, action) => {
        state.arAutomationLoading = false;
        state.arAutomationConfig = action.payload;
      })
      .addCase(saveARAutomationConfig.rejected, (state, action) => {
        state.arAutomationLoading = false;
        state.error = action.payload;
      })
      // Adjustment Types
      .addCase(fetchAdjustmentTypes.pending, (state) => {
        state.adjustmentTypesLoading = true;
      })
      .addCase(fetchAdjustmentTypes.fulfilled, (state, action) => {
        state.adjustmentTypesLoading = false;
        state.adjustmentTypes = action.payload;
      })
      .addCase(fetchAdjustmentTypes.rejected, (state, action) => {
        state.adjustmentTypesLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdjustmentType.fulfilled, (state, action) => {
        state.adjustmentTypes.push(action.payload);
      })
      .addCase(updateAdjustmentType.fulfilled, (state, action) => {
        const index = state.adjustmentTypes.findIndex((adj) => adj.id === action.payload.id);
        if (index !== -1) {
          state.adjustmentTypes[index] = action.payload;
        }
      })
      .addCase(deleteAdjustmentType.fulfilled, (state, action) => {
        const index = state.adjustmentTypes.findIndex((adj) => adj.id === action.payload);
        if (index !== -1) {
          state.adjustmentTypes[index].isHidden = true;
        }
      })
      // Payment Types
      .addCase(fetchPaymentTypes.pending, (state) => {
        state.paymentTypesLoading = true;
      })
      .addCase(fetchPaymentTypes.fulfilled, (state, action) => {
        state.paymentTypesLoading = false;
        state.paymentTypes = action.payload.map(pt => {
          let cleanNote = pt.note;
          if (typeof cleanNote === 'string' && cleanNote.startsWith('{')) {
            try { cleanNote = JSON.parse(cleanNote).note || ''; } catch(e) {}
          }
          return { ...pt, note: cleanNote };
        });
      })
      .addCase(fetchPaymentTypes.rejected, (state, action) => {
        state.paymentTypesLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(createPaymentType.fulfilled, (state, action) => {
        const pt = action.payload;
        let cleanNote = pt.note;
        if (typeof cleanNote === 'string' && cleanNote.startsWith('{')) {
          try { cleanNote = JSON.parse(cleanNote).note || ''; } catch(e) {}
        }
        state.paymentTypes.push({ ...pt, note: cleanNote });
      })
      .addCase(updatePaymentType.fulfilled, (state, action) => {
        const pt = action.payload;
        let cleanNote = pt.note;
        if (typeof cleanNote === 'string' && cleanNote.startsWith('{')) {
          try { cleanNote = JSON.parse(cleanNote).note || ''; } catch(e) {}
        }
        const index = state.paymentTypes.findIndex((p) => p.id === pt.id);
        if (index !== -1) {
          state.paymentTypes[index] = { ...pt, note: cleanNote };
        }
      })
      .addCase(deletePaymentType.fulfilled, (state, action) => {
        const index = state.paymentTypes.findIndex((pt) => pt.id === action.payload);
        if (index !== -1) {
          state.paymentTypes[index].isHidden = true;
        }
      })
      .addCase(fetchPaymentTypeDefaults.fulfilled, (state, action) => {
        state.paymentTypeDefaults = action.payload;
      })
      .addCase(savePaymentTypeDefaults.fulfilled, (state, action) => {
        state.paymentTypeDefaults = action.payload;
      })
      .addCase(fetchPaymentTerminals.pending, (state) => {
        state.paymentTerminalsLoading = true;
      })
      .addCase(fetchPaymentTerminals.fulfilled, (state, action) => {
        state.paymentTerminalsLoading = false;
        // The backend might return an empty object initially
        state.paymentTerminals = {
          openEdge: action.payload?.openEdge || [],
          prosperipay: action.payload?.prosperipay || [],
          payrix: action.payload?.payrix || []
        };
      })
      .addCase(fetchPaymentTerminals.rejected, (state, action) => {
        state.paymentTerminalsLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(savePaymentTerminals.fulfilled, (state, action) => {
        state.paymentTerminals = {
          openEdge: action.payload?.openEdge || [],
          prosperipay: action.payload?.prosperipay || [],
          payrix: action.payload?.payrix || []
        };
      })
      .addCase(fetchArAgingReport.pending, (state) => {
        state.arAgingLoading = true;
      })
      .addCase(fetchArAgingReport.fulfilled, (state, action) => {
        state.arAgingLoading = false;
        state.arAging = action.payload;
      })
      .addCase(fetchArAgingReport.rejected, (state, action) => {
        state.arAgingLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPatientAgingReport.pending, (state) => {
        state.patientAgingLoading = true;
      })
      .addCase(fetchPatientAgingReport.fulfilled, (state, action) => {
        state.patientAgingLoading = false;
        state.patientAging = action.payload;
      })
      .addCase(fetchPatientAgingReport.rejected, (state, action) => {
        state.patientAgingLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchModificationsReport.pending, (state) => {
        state.modificationsLoading = true;
        state.modificationsError = null;
      })
      .addCase(fetchModificationsReport.fulfilled, (state, action) => {
        state.modificationsLoading = false;
        state.modificationsData = action.payload || [];
      })
      .addCase(fetchModificationsReport.rejected, (state, action) => {
        state.modificationsLoading = false;
        state.modificationsError = action.payload || 'Failed to fetch modifications report';
      })
      .addCase(fetchPatientAccountNotes.pending, (state) => {
        state.patientAccountNotesLoading = true;
        state.patientAccountNotesError = null;
      })
      .addCase(fetchPatientAccountNotes.fulfilled, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPatientAccountNotes.rejected, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotesError = action.payload || action.error?.message;
      })
      .addCase(createPatientAccountNote.pending, (state) => {
        state.patientAccountNotesLoading = true;
      })
      .addCase(createPatientAccountNote.fulfilled, (state, action) => {
        state.patientAccountNotesLoading = false;
        if (Array.isArray(action.payload)) {
          state.patientAccountNotes = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          const exists = state.patientAccountNotes.some(n => n.id === action.payload.id || n._id === action.payload._id);
          if (!exists) {
            state.patientAccountNotes = [action.payload, ...state.patientAccountNotes];
          }
        }
      })
      .addCase(createPatientAccountNote.rejected, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotesError = action.payload || action.error?.message;
      })
      .addCase(updatePatientAccountNote.pending, (state) => {
        state.patientAccountNotesLoading = true;
      })
      .addCase(updatePatientAccountNote.fulfilled, (state, action) => {
        state.patientAccountNotesLoading = false;
        if (Array.isArray(action.payload)) {
          state.patientAccountNotes = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          const noteId = action.payload.id || action.payload._id;
          state.patientAccountNotes = state.patientAccountNotes.map(n => 
            (n.id === noteId || n._id === noteId) ? action.payload : n
          );
        }
      })
      .addCase(updatePatientAccountNote.rejected, (state, action) => {
        state.patientAccountNotesLoading = false;
        state.patientAccountNotesError = action.payload || action.error?.message;
      })
      // ── Ledger thunks ──────────────────────────────────────────────────────
      .addCase(fetchLedgerItems.pending, (state) => {
        state.ledgerLoading = true;
        state.ledgerError = null;
      })
      .addCase(fetchLedgerItems.fulfilled, (state, action) => {
        state.ledgerLoading = false;
        state.ledgerCache[action.payload.patientId] = action.payload.items;
      })
      .addCase(fetchLedgerItems.rejected, (state, action) => {
        state.ledgerLoading = false;
        state.ledgerError = action.payload;
      })
      .addCase(fetchInvoiceDetails.pending, (state, action) => {
        // Mark this invoice as in-flight so concurrent clicks are ignored
        const invoiceId = action.meta.arg.invoiceId;
        if (!state.detailsFetchingSet.includes(invoiceId)) {
          state.detailsFetchingSet.push(invoiceId);
        }
      })
      .addCase(fetchInvoiceDetails.fulfilled, (state, action) => {
        const { patientId, invoiceId, details, totalPaidAmt } = action.payload;
        // Remove from in-flight set
        state.detailsFetchingSet = state.detailsFetchingSet.filter((id) => id !== invoiceId);
        const items = state.ledgerCache[patientId];
        if (!items) return;
        const idx = items.findIndex((i) => i.id === invoiceId);
        if (idx === -1) return;
        items[idx].details = details;
        if (totalPaidAmt > 0) {
          items[idx].summary.ptPaid = `$${totalPaidAmt.toFixed(2)}`;
        }
      })
      .addCase(fetchInvoiceDetails.rejected, (state, action) => {
        // Always clear the in-flight marker so a retry is possible
        const invoiceId = action.meta.arg.invoiceId;
        state.detailsFetchingSet = state.detailsFetchingSet.filter((id) => id !== invoiceId);
      })
      // Ledger mutations re-fetch automatically via their thunks — just clear loading
      .addCase(backdateTransaction.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      .addCase(voidTransaction.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      .addCase(applyCourtesyCredit.fulfilled, (state, action) => {
        const { procedureId, invoiceId, adjustmentType } = action.payload;
        state.adjustmentTypeMap[`${invoiceId}-${procedureId}`] = adjustmentType;
      })
      .addCase(applyCourtesyCredit.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      .addCase(undoCourtesyCredit.rejected, (state, action) => {
        state.ledgerError = action.payload;
      })
      // ── Payment draft invoices ─────────────────────────────────────────────
      .addCase(fetchPaymentDraftInvoices.pending, (state, action) => {
        state.paymentInvoicesLoading = true;
        state.paymentInvoicesError = null;
        const patientId = action.meta.arg;
        if (!state.paymentInvoicesFetchingSet.includes(patientId)) {
          state.paymentInvoicesFetchingSet.push(patientId);
        }
      })
      .addCase(fetchPaymentDraftInvoices.fulfilled, (state, action) => {
        state.paymentInvoicesLoading = false;
        const patientId = action.payload.patientId;
        state.paymentInvoicesFetchingSet = state.paymentInvoicesFetchingSet.filter((id) => id !== patientId);
        state.paymentInvoicesCache[patientId] = action.payload.invoices;
      })
      .addCase(fetchPaymentDraftInvoices.rejected, (state, action) => {
        state.paymentInvoicesLoading = false;
        const patientId = action.meta.arg;
        state.paymentInvoicesFetchingSet = state.paymentInvoicesFetchingSet.filter((id) => id !== patientId);
        state.paymentInvoicesError = action.payload;
      });
  },
});

export const {
  setCurrentInvoice,
  setSelectedInvoiceId,
  updateClaimStatus,
  setClaimStatuses,
  setPaymentPlans,
  addPaymentPlan,
  setArAging,
  clearCurrentInvoice,
  setLoading,
  setError,
  togglePaymentInvoiceChecked,
  togglePaymentLineItemChecked,
  invalidatePaymentInvoices,
  setAdjustmentTypeForItem,
  invalidateLedger,
} = billingSlice.actions;

// Selectors
export const selectCurrentInvoice = (state) => state.billing.currentInvoice;
export const selectSelectedInvoiceId = (state) => state.billing.selectedInvoiceId;
export const selectClaimStatus = (state, claimId) => state.billing.claimStatus[claimId];
export const selectAllClaimStatuses = (state) => state.billing.claimStatus;
export const selectPaymentPlans = (state) => state.billing.paymentPlans;
export const selectArAging = (state) => state.billing.arAging;
export const selectBillingConfiguration = (state) => state.billing.billingConfiguration;
export const selectBillingConfigLoading = (state) => state.billing.billingConfigLoading;
export const selectARAutomationConfig = (state) => state.billing.arAutomationConfig;
export const selectARAutomationLoading = (state) => state.billing.arAutomationLoading;
export const selectAdjustmentTypes = (state) => state.billing.adjustmentTypes;
export const selectAdjustmentTypesLoading = (state) => state.billing.adjustmentTypesLoading;
export const selectPaymentTypes = (state) => state.billing.paymentTypes;
export const selectPaymentTypesLoading = (state) => state.billing.paymentTypesLoading;
export const selectPaymentTypeDefaults = (state) => state.billing.paymentTypeDefaults;
export const selectPaymentTerminals = (state) => state.billing.paymentTerminals;
export const selectPaymentTerminalsLoading = (state) => state.billing.paymentTerminalsLoading;
export const selectArAgingLoading = (state) => state.billing.arAgingLoading;
export const selectPatientAging = (state) => state.billing.patientAging;
export const selectPatientAgingLoading = (state) => state.billing.patientAgingLoading;
export const selectPatientAccountNotes = (state) => state.billing.patientAccountNotes;
export const selectPatientAccountNotesLoading = (state) => state.billing.patientAccountNotesLoading;
export const selectPatientAccountNotesError = (state) => state.billing.patientAccountNotesError;
export const selectBillingLoading = (state) => state.billing.loading;
export const selectBillingError   = (state) => state.billing.error;

// Ledger selectors
export const selectLedgerLoading  = (state) => state.billing.ledgerLoading;
export const selectLedgerError    = (state) => state.billing.ledgerError;
export const selectAdjustmentTypeMap = (state) => state.billing.adjustmentTypeMap;
/** Returns cached ledger items for the given patient (or empty array). */
export const selectLedgerItemsForPatient = (patientId) => (state) =>
  state.billing.ledgerCache?.[patientId] || [];

// Payment invoice selectors
export const selectPaymentInvoicesLoading = (state) => state.billing.paymentInvoicesLoading;
export const selectPaymentInvoicesError   = (state) => state.billing.paymentInvoicesError;
/** Returns cached payment draft invoices for the given patient (or empty array). */
export const selectPaymentInvoicesForPatient = (patientId) => (state) =>
  state.billing.paymentInvoicesCache?.[patientId] || [];

export const selectModificationsData = (state) => state.billing.modificationsData;
export const selectModificationsLoading = (state) => state.billing.modificationsLoading;
export const selectModificationsError = (state) => state.billing.modificationsError;

export default billingSlice.reducer;
