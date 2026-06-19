import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { claimService } from '../../services/claim.service';
import { invoiceService } from '../../services/invoice.service';
import { fetchLedgerItems } from './billingSlice';

// ---------------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------------

export const createManualClaim = createAsyncThunk(
  'claims/createManualClaim',
  async (claimData, { dispatch, rejectWithValue }) => {
    try {
      // 1. Save the claim to the backend
      const result = await claimService.createManualClaim(claimData);

      // 2. Mark each selected line item as "claimed" so the ledger reflects
      //    the insurance-pending amount — mirrors how AddPaymentDialog calls
      //    markItemPaid for patient payments.
      const { selectedItems = [] } = claimData;
      await Promise.all(
        selectedItems.map(({ invoiceId, itemId, amount }) =>
          invoiceService
            .markItemPaid(invoiceId, itemId, amount)
            .catch((err) =>
              console.warn('markItemPaid failed for claim item', itemId, err)
            )
        )
      );

      // 3. Refresh the ledger so the claim shows up in each invoice's rows
      if (claimData.patientId) {
        await dispatch(fetchLedgerItems(claimData.patientId));
      }

      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create manual claim');
    }
  }
);

/**
 * Inline concurrency limiter — runs at most `concurrency` promises at a time.
 * Avoids importing p-limit while still preventing 12+ simultaneous requests.
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

/**
 * Fetch draft invoices for a patient and enrich each one with its full line
 * items. Line items where the patient pays the full amount (DBI flag) are
 * stripped out — only insurance-billable items are kept.
 *
 * Uses includeItems=true so the backend can return everything in one request.
 * Falls back to individual getInvoiceById calls (max 3 concurrent) if the
 * list response doesn't include line items.
 */
export const fetchDraftInvoicesForClaim = createAsyncThunk(
  'claims/fetchDraftInvoicesForClaim',
  async (patientId, { rejectWithValue }) => {
    try {
      const res = await invoiceService.getAllInvoices({ patientId, status: 'draft', limit: 1000, includeItems: true });
      const fetchedInvoices = res.invoices || [];

      // If backend returned items inline, skip individual detail requests entirely
      const needsDetailFetch = fetchedInvoices.some((inv) => !inv.lineItems);

      const fullInvoices = needsDetailFetch
        ? await withConcurrency(3, fetchedInvoices.map((inv) => async () => {
            if (inv.lineItems) return inv; // already has items
            try { return await invoiceService.getInvoiceById(inv._id || inv.id); }
            catch { return null; }
          }))
        : fetchedInvoices;

      const enrichLineItems = (lineItems) =>
        (lineItems || [])
          .filter((item) => {
            if (item.dbi === true) return false;
            if (item.dbi === false) return true;
            const writeoff = Number(item.writeoff || 0);
            const ins = Number(item.insPortion || item.insurance || 0);
            const pt = Number(item.ptPortion || 0);
            const total = Number(item.total || item.totalPrice || 0);
            const patientBal = pt > 0 ? pt : ins > 0 ? 0 : Math.max(0, total - writeoff - ins);
            return !(patientBal > 0 && ins === 0);
          })
          .map((item) => {
            const writeoff = Number(item.writeoff || 0);
            const ins = Number(item.insPortion || item.insurance || 0);
            const pt = Number(item.ptPortion || 0);
            const total = Number(item.total || item.totalPrice || 0);
            const patientBal = pt > 0 ? pt : ins > 0 ? 0 : Math.max(0, total - writeoff - ins);
            const insuranceBal =
              ins === 0 && pt === 0 && patientBal === 0 ? Math.max(0, total - writeoff) : ins;
            const prev = Math.max(0, total - patientBal);
            return {
              ...item,
              checked: false,
              ptAmount: `$${patientBal.toFixed(2)}`,
              insAmount: `$${insuranceBal.toFixed(2)}`,
              prevAmount: `$${prev.toFixed(2)}`,
            };
          });

      return fullInvoices
        .filter(Boolean)
        .map((inv) => ({ ...inv, checked: false, lineItems: enrichLineItems(inv.lineItems) }));
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch draft invoices');
    }
  },
  {
    /**
     * Skip if:
     * 1. Already fetching for this patient (in-flight dedup)
     * 2. Data is already cached (dialog re-opens without patient change)
     */
    condition: (patientId, { getState }) => {
      const { claims } = getState();
      if (claims.draftInvoicesFetchingSet?.includes(patientId)) return false;
      if (claims.draftInvoicesCache?.[patientId]) return false;
      return true;
    },
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState = {
  loading: false,
  error: null,
  claims: [],
  currentClaim: null,

  // Draft invoices for the ManualClaimDialog, keyed by patientId
  draftInvoicesCache: {},   // { [patientId]: Invoice[] }
  draftInvoicesLoading: false,
  draftInvoicesError: null,
  draftInvoicesFetchingSet: [], // patientIds currently being fetched
};

const claimSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearClaimError: (state) => {
      state.error = null;
    },
    clearDraftInvoicesError: (state) => {
      state.draftInvoicesError = null;
    },
    /** Toggle an entire invoice's checked state (and all its line items). */
    toggleInvoiceChecked: (state, action) => {
      const { patientId, invoiceId } = action.payload;
      const invoices = state.draftInvoicesCache[patientId];
      if (!invoices) return;
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) return;
      inv.checked = !inv.checked;
      inv.lineItems.forEach((item) => { item.checked = inv.checked; });
    },
    /** Toggle a single line-item's checked state. */
    toggleLineItemChecked: (state, action) => {
      const { patientId, invoiceId, itemId } = action.payload;
      const invoices = state.draftInvoicesCache[patientId];
      if (!invoices) return;
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv) return;
      const item = inv.lineItems.find((li) => li.id === itemId);
      if (item) item.checked = !item.checked;
      inv.checked = inv.lineItems.length > 0 && inv.lineItems.every((li) => li.checked);
    },
    /** Evict cached invoices for a patient (e.g. when patient selection changes). */
    invalidateDraftInvoices: (state, action) => {
      const patientId = action.payload;
      if (patientId) {
        delete state.draftInvoicesCache[patientId];
        state.draftInvoicesFetchingSet = state.draftInvoicesFetchingSet.filter((id) => id !== patientId);
      } else {
        state.draftInvoicesCache = {};
        state.draftInvoicesFetchingSet = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // createManualClaim
      .addCase(createManualClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createManualClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.claims.push(action.payload);
      })
      .addCase(createManualClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchDraftInvoicesForClaim
      .addCase(fetchDraftInvoicesForClaim.pending, (state, action) => {
        state.draftInvoicesLoading = true;
        state.draftInvoicesError = null;
        const patientId = action.meta.arg;
        if (!state.draftInvoicesFetchingSet.includes(patientId)) {
          state.draftInvoicesFetchingSet.push(patientId);
        }
      })
      .addCase(fetchDraftInvoicesForClaim.fulfilled, (state, action) => {
        state.draftInvoicesLoading = false;
        const patientId = action.meta.arg;
        state.draftInvoicesFetchingSet = state.draftInvoicesFetchingSet.filter((id) => id !== patientId);
        state.draftInvoicesCache[patientId] = action.payload;
      })
      .addCase(fetchDraftInvoicesForClaim.rejected, (state, action) => {
        state.draftInvoicesLoading = false;
        const patientId = action.meta.arg;
        state.draftInvoicesFetchingSet = state.draftInvoicesFetchingSet.filter((id) => id !== patientId);
        state.draftInvoicesError = action.payload;
      });
  },
});

export const {
  clearClaimError,
  clearDraftInvoicesError,
  toggleInvoiceChecked,
  toggleLineItemChecked,
  invalidateDraftInvoices,
} = claimSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectClaimLoading = (state) => state.claims?.loading || false;
export const selectClaimError = (state) => state.claims?.error || null;
export const selectDraftInvoicesLoading = (state) => state.claims?.draftInvoicesLoading || false;
export const selectDraftInvoicesError = (state) => state.claims?.draftInvoicesError || null;
/** Returns the cached draft invoices for a given patientId (or an empty array). */
export const selectDraftInvoicesForPatient = (patientId) => (state) =>
  state.claims?.draftInvoicesCache?.[patientId] || [];

export default claimSlice.reducer;
