/**
 * Should we offer the "file a secondary claim?" prompt after a primary payment?
 *
 * Three conditions have to hold:
 *   1. the patient carries an active secondary plan,
 *   2. at least one line still carries a secondary estimate, and
 *   3. that specific line has not already been submitted to the secondary.
 *
 * (3) is deliberately per-line rather than per-patient. A patient routinely ends
 * up with one secondary claim covering one invoice while another invoice still
 * owes secondary. Ashley Brown's D2740 is already on secondary claim CLM…056,
 * yet her D2140 line still carries $28.00 of secondary estimate — so a
 * patient-wide "already has a secondary claim" check silenced the prompt on
 * every one of her remaining invoices.
 */

const isSecondaryClaim = (claim) =>
  ['secondary', 's'].includes(
    String(claim?.insuranceType || claim?.claimType || '').toLowerCase(),
  );

const procedureIds = (proc = {}) =>
  [
    proc.id,
    proc._id,
    proc.itemId,
    proc.ProcNum,
    proc.procedureId,
    proc.procId,
  ]
    .filter((value) => value !== undefined && value !== null && String(value).trim() !== '')
    .map((value) => String(value).trim());

const procedureCodes = (proc = {}) => {
  const raw = proc.code || proc.cptCode || proc.ProcCode || '';
  const code = String(raw).split(/\s|-/)[0].trim();
  return code ? [code] : [];
};

export const secondaryClaimedItemIds = (claims = []) =>
  new Set(
    claims
      .filter(isSecondaryClaim)
      .flatMap((c) => c.procedures || c.items || c.selectedItems || [])
      .flatMap(procedureIds),
  );

export const findActiveSecondaryInsurance = (coverages = []) =>
  coverages.find((ins) => {
    const type = String(ins?.insuranceType || ins?.type || '').toLowerCase();
    return type === 'secondary' || Number(ins?.ordinal) === 2;
  });

export const hasUnclaimedSecondaryLines = ({
  coverages = [],
  procedures = [],
  proceduresByProcNum = new Map(),
  claims = [],
} = {}) => {
  if (!findActiveSecondaryInsurance(coverages)) return false;
  const claimed = secondaryClaimedItemIds(claims);
  const proceduresByCode = new Map();
  proceduresByProcNum.forEach((proc) => {
    procedureCodes(proc).forEach((code) => {
      if (!proceduresByCode.has(code)) proceduresByCode.set(code, proc);
    });
  });

  return (procedures || []).some((p) => {
    const ids = procedureIds(p);
    if (ids.some((id) => claimed.has(id))) return false;
    const codes = procedureCodes(p);
    const secondaryAmount =
      Number(p.secondaryInsPortion ?? p.secondaryInsurancePortion ?? 0) ||
      ids.reduce(
        (amount, id) =>
          amount || Number(proceduresByProcNum.get(id)?.secondaryInsPortion ?? 0),
        0,
      ) ||
      codes.reduce(
        (amount, code) =>
          amount || Number(proceduresByCode.get(code)?.secondaryInsPortion ?? 0),
        0,
      );
    return secondaryAmount > 0;
  });
};

/**
 * The invoices list endpoint returns summaries only — its `includeItems`
 * parameter is ignored and `lineItems` comes back empty. The ledger context is
 * keyed by procedure, so without the detail fetch it is silently empty and
 * anything derived from it (procedure restatement, the secondary-claim prompt)
 * can never match. Hydrate the invoices the supplied claims actually touch,
 * leaving the rest of the patient's ledger untouched.
 */
export const hydrateClaimInvoices = async (
  invoices = [],
  claims = [],
  getInvoiceById,
) => {
  // Invoices are keyed by numeric _id in the list, but claims reference them by
  // ShortGUID (invoiceNumber). Build a map that can be looked up by either.
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
        // Also update the other key (numeric <-> ShortGUID) if present
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
