import { describe, it, expect } from 'vitest';
import { buildLedgerProcedureContext } from '../../../utils/ledgerCalculations';
import { hasUnclaimedSecondaryLines } from '../secondaryClaimEligibility';

const D2140 = '1791494092552326';
const INVOICE_041 = '1791494147119064';

const lineItem = {
  _id: D2140,
  id: D2140,
  cptCode: 'D2140',
  description: 'Amalgam - one (1) surface, permanent or primary',
  total: 140,
  totalPrice: 140,
  ptPortion: 12,
  insPortion: 128,
  primaryInsPortion: 100,
  secondaryInsPortion: 28,
  writeoff: 0,
  allowedFee: 140,
  dbi: false,
};

const listInvoice = {
  _id: INVOICE_041,
  id: INVOICE_041,
  invoiceNumber: 'INV1791464041',
};

const claims = [
  {
    id: 'CLM000130',
    claimNumber: 'CLM000130',
    insuranceType: 'primary',
    invoiceId: INVOICE_041,
    procedures: [{ id: D2140, code: 'D2140' }],
  },
  {
    id: 'CLM1791494255269056',
    claimNumber: 'CLM1791494255269056',
    insuranceType: 'secondary',
    procedures: [{ id: '1791494092552325', code: 'D2740' }],
  },
];

const coverages = [
  { _id: '4', insuranceType: 'primary', isActive: true },
  { _id: '291', insuranceType: 'secondary', isActive: true },
];

const hydrateClaimInvoices = async (invoices = [], claims = [], getInvoiceById) => {
  const byId = new Map();
  invoices.forEach((inv) => {
    const numericId = String(inv._id || inv.id);
    const shortGuid = String(inv.invoiceNumber || '');
    if (numericId) byId.set(numericId, inv);
    if (shortGuid) byId.set(shortGuid, inv);
  });
  const wanted = new Set();
  claims.forEach((claim) => {
    const idOf = (v) =>
      typeof v === 'object' && v ? String(v._id || v.id || '') : String(v || '');
    [
      claim.invoiceId,
      claim.invoice?._id,
      claim.invoiceId?._id,
      ...(claim.procedures || []).map((p) => p.invoiceId),
    ].forEach((v) => {
      const id = idOf(v);
      if (id) wanted.add(id);
    });
  });

  await Promise.all(
    [...wanted].map(async (id) => {
      const existing = byId.get(id);
      if (!existing || (existing.lineItems || []).length > 0) return;
      try {
        const fullResult = await getInvoiceById(id);
        const hydrated = { ...existing, ...fullResult };
        byId.set(id, hydrated);
        const otherKey = existing.invoiceNumber ? String(existing._id || existing.id) : existing.invoiceNumber;
        if (otherKey && otherKey !== id && byId.has(otherKey)) {
          byId.set(otherKey, hydrated);
        }
      } catch (e) {
        console.error('hydrateClaimInvoices error:', e);
      }
    }),
  );
  return [...byId.values()];
};

describe('secondary-claim gate against production-shaped ledger data', () => {
  it('is silent without hydration, because the list has no line items', () => {
    const ctx = buildLedgerProcedureContext({ invoices: [listInvoice], claims });
    expect(ctx.proceduresByProcNum.size).toBe(0);
    expect(
      hasUnclaimedSecondaryLines({
        coverages,
        procedures: [{ id: D2140 }],
        proceduresByProcNum: ctx.proceduresByProcNum,
        claims,
      }),
    ).toBe(false);
  });

  it('hydrates the claimed invoice, then offers the prompt for D2140', async () => {
    const getInvoiceById = async (id) =>
      String(id) === String(INVOICE_041)
        ? { ...listInvoice, lineItems: [lineItem] }
        : { _id: id, lineItems: [] };

    const invoices = await hydrateClaimInvoices([listInvoice], claims, getInvoiceById);

    expect(invoices[0].lineItems).toHaveLength(1);

    const ctx = buildLedgerProcedureContext({ invoices, claims });
    expect(ctx.proceduresByProcNum.get(D2140).secondaryInsPortion).toBe(28);

    expect(
      hasUnclaimedSecondaryLines({
        coverages,
        procedures: [{ id: D2140 }],
        proceduresByProcNum: ctx.proceduresByProcNum,
        claims,
      }),
    ).toBe(true);
  });

  it('hydrates invoice when claim references it by ShortGUID (invoiceNumber)', async () => {
    const listInvoiceShortGuid = {
      _id: INVOICE_041,
      id: INVOICE_041,
      invoiceNumber: 'INV1791464041',
    };

    const getInvoiceById = async (id) =>
      String(id) === String('INV1791464041') || String(id) === String(INVOICE_041)
        ? { ...listInvoiceShortGuid, lineItems: [lineItem] }
        : { _id: id, lineItems: [] };

    const claimsWithShortGuid = [
      {
        id: 'CLM000130',
        claimNumber: 'CLM000130',
        insuranceType: 'primary',
        invoiceId: 'INV1791464041',
        procedures: [{ id: D2140, code: 'D2140' }],
      },
    ];

    const invoices = await hydrateClaimInvoices([listInvoiceShortGuid], claimsWithShortGuid, getInvoiceById);

    expect(invoices.length).toBeGreaterThan(0);
    const hydrated = invoices.find((v) => v.lineItems?.length > 0);
    expect(hydrated).toBeDefined();
    expect(hydrated.lineItems[0].secondaryInsPortion).toBe(28);
  });

  it('full flow: hydrate with object invoiceId -> select CLM000130 -> gate fires for D2140', async () => {
    const listInvoiceObj = {
      _id: INVOICE_041,
      id: INVOICE_041,
      invoiceNumber: 'INV1791464041',
    };

    const claimsWithObjInvoiceId = [
      {
        id: 'CLM000130',
        claimNumber: 'CLM000130',
        insuranceType: 'primary',
        invoiceId: { _id: INVOICE_041, invoiceNumber: 'INV1791464041' },
        procedures: [{ id: D2140, code: 'D2140' }],
      },
      {
        id: 'CLM1791494255269056',
        claimNumber: 'CLM1791494255269056',
        insuranceType: 'secondary',
        procedures: [{ id: '1791494092552325', code: 'D2740' }],
      },
    ];

    const getInvoiceById = async (id) =>
      String(id) === String(INVOICE_041)
        ? { ...listInvoiceObj, lineItems: [lineItem] }
        : { _id: id, lineItems: [] };

    const invoices = await hydrateClaimInvoices([listInvoiceObj], claimsWithObjInvoiceId, getInvoiceById);
    const ctx = buildLedgerProcedureContext({ invoices, claims: claimsWithObjInvoiceId });

    const selectedClaim = claimsWithObjInvoiceId[0];
    const derivedProcedures = selectedClaim.procedures.map((p) => ({ id: p.id }));

    expect(
      hasUnclaimedSecondaryLines({
        coverages,
        procedures: derivedProcedures,
        proceduresByProcNum: ctx.proceduresByProcNum,
        claims: claimsWithObjInvoiceId,
      }),
    ).toBe(true);
  });
});