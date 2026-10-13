import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from '../../../contexts/SnackbarContext';
import fixture from '../../../__fixtures__/fixture16.json';

const detail = fixture.detail;
const detailWithItems = {
  ...detail.invoice,
  lineItems: (detail.items || []).map((it) => ({ ...it, id: it._id, total: it.totalPrice })),
};
const detail2 = fixture.detail2;
const detail2WithItems = {
  ...detail2.invoice,
  lineItems: (detail2.items || []).map((it) => ({ ...it, id: it._id, total: it.totalPrice })),
};
// The real invoices list endpoint ignores `includeItems` and returns summaries
// with no line items at all — mirror that here, so the hydration path in
// InsurancePaymentDialog is genuinely exercised.
const invoicesWithItems = [
  ...fixture.invoices.map((inv) => ({ ...inv, lineItems: undefined })),
  { ...detail2.invoice, lineItems: undefined },
];

const invoiceService = {
  getAllInvoices: async () => ({ invoices: invoicesWithItems }),
  getInvoiceById: async (id) => {
    if (String(id) === String(detail.invoice._id)) return detailWithItems;
    if (String(id) === String(detail2.invoice._id)) return detail2WithItems;
    return { _id: id, lineItems: [] };
  },
  getPatientCompositeLedger: async () => ({
    invoices: invoicesWithItems,
    adjustments: fixture.adjustments,
    payments: fixture.payments,
    claims: fixture.claims,
  }),
};

const claimService = {
  getAllClaims: async () => ({ claims: fixture.claims }),
  updateClaim: async () => ({ data: {} }),
};

vi.mock('../../../services/invoice.service', () => ({ invoiceService, default: invoiceService }));

vi.mock('../../../services/claim.service', () => ({ claimService, default: claimService }));

const text = (html) =>
  html.replace(/<[^>]+>/g, '|').split('|').map((s) => s.trim()).filter(Boolean);

describe('secondary claim flow — Ashley Brown (patient 16), D2740 @ 950', () => {
  let store;
  let ManualClaimDialog;
  const coverages = fixture.coverages;

  beforeAll(async () => {
    const billingReducer = (await import('../../../store/slices/billingSlice')).default;
    const patientReducer = (await import('../../../store/slices/patientSlice')).default;
    const claimReducer = (await import('../../../store/slices/claimSlice')).default;
    const providerReducer = (await import('../../../store/slices/providerSlice')).default;
    const claimSlice = await import('../../../store/slices/claimSlice');
    const patientSlice = await import('../../../store/slices/patientSlice');
    const providerSlice = await import('../../../store/slices/providerSlice');
    const { fetchPatientInsurances } = patientSlice;
    ManualClaimDialog = (await import('../ManualClaimDialog')).default;

    store = configureStore({
      reducer: { billing: billingReducer, patient: patientReducer, claims: claimReducer, provider: providerReducer },
      middleware: (g) => g({ serializableCheck: false }),
    });

    // Drive the real thunks outside React (no useEffect runs during SSR).
    store.dispatch(patientSlice.fetchPatients({ limit: 50 }));
    await store.dispatch(claimSlice.fetchDraftInvoicesForClaim(fixture.patientId));
    // Coverages come from the real endpoint; stub the thunk with captured data.
    // Seed the coverage cache exactly the way fetchPatientInsurances.fulfilled does.
    store.dispatch({
      type: fetchPatientInsurances.fulfilled.type,
      payload: { patientId: fixture.patientId, insurances: coverages },
    });
    store.dispatch(providerSlice.fetchAllProvidersForDropdown());
  });

  const renderWith = (element) =>
    renderToStaticMarkup(
      <Provider store={store}>
        <ThemeProvider theme={createTheme()}>
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
      </Provider>,
    );

  it('lists D2740 in the draft-invoice queue', () => {
    const state = store.getState();
    const queue = state.claims?.draftInvoicesCache?.[fixture.patientId] || [];
    expect(queue.length).toBeGreaterThan(0);
    const codes = queue.flatMap((i) => (i.lineItems || []).map((l) => l.cptCode || l.code));
    expect(codes).toContain('D2740');
  });

  it('preselects the SECONDARY plan (MetLife), not the primary', () => {
    const secondary = coverages.find((c) => c.insuranceType === 'secondary');
    const html = renderWith(
      <ManualClaimDialog
        patient={{ _id: fixture.patientId }}
        secondaryInsuranceId={String(secondary._id)}
        onClose={() => {}}
      />,
    );
    const t = text(html).join(' ');
    expect(t).toContain('MetLife Test Dental');
    expect(t).not.toContain('Delta Dental PPO');
  });

  it('shows D2740 with its $475.00 secondary amount, hidden from the primary list', () => {
    const secondary = coverages.find((c) => c.insuranceType === 'secondary');
    const asSecondary = text(
      renderWith(
        <ManualClaimDialog patient={{ _id: fixture.patientId }} secondaryInsuranceId={String(secondary._id)} onClose={() => {}} />,
      ),
    ).join(' ');
    const asPrimary = text(
      renderWith(
        <ManualClaimDialog patient={{ _id: fixture.patientId }} onClose={() => {}} />,
      ),
    ).join(' ');

    expect(asSecondary).toContain('D2740');
    expect(asSecondary).toContain('$475.00');
    // Already claimed by the primary, so it must NOT appear there.
    expect(asPrimary).not.toContain('D2740');
  });
});

describe('secondary claim — D2140 on INV1791464041, $28.00 still owed to MetLife', () => {
  let store;
  let ManualClaimDialog;

  beforeAll(async () => {
    const claimReducer = (await import('../../../store/slices/claimSlice')).default;
    const patientReducer = (await import('../../../store/slices/patientSlice')).default;
    const providerReducer = (await import('../../../store/slices/providerSlice')).default;
    const patientSlice = await import('../../../store/slices/patientSlice');
    const claimSlice = await import('../../../store/slices/claimSlice');

    store = configureStore({
      reducer: { patient: patientReducer, claims: claimReducer, provider: providerReducer },
      middleware: (g) => g({ serializableCheck: false }),
    });
    await store.dispatch(claimSlice.fetchDraftInvoicesForClaim(fixture.patientId));
    store.dispatch({
      type: patientSlice.fetchPatientInsurances.fulfilled.type,
      payload: { patientId: fixture.patientId, insurances: fixture.coverages },
    });
    ManualClaimDialog = (await import('../ManualClaimDialog')).default;
  });

  const renderWith = (element) =>
    renderToStaticMarkup(
      <Provider store={store}>
        <ThemeProvider theme={createTheme()}>
          <SnackbarProvider>{element}</SnackbarProvider>
        </ThemeProvider>
      </Provider>,
    );

  it('lists D2140 to the secondary carrier at its $28.00 secondary amount', () => {
    const secondary = fixture.coverages.find((c) => c.insuranceType === 'secondary');
    const t = text(
      renderWith(
        <ManualClaimDialog
          patient={{ _id: fixture.patientId }}
          secondaryInsuranceId={String(secondary._id)}
          onClose={() => {}}
        />,
      ),
    ).join(' ');

    expect(t).toContain('MetLife Test Dental');
    expect(t).toContain('D2140');
    expect(t).toContain('$28.00');
  });

  it('hides D2140 from the primary, which already claimed it', () => {
    const t = text(
      renderWith(<ManualClaimDialog patient={{ _id: fixture.patientId }} onClose={() => {}} />),
    ).join(' ');

    expect(t).not.toContain('D2140');
  });
});
