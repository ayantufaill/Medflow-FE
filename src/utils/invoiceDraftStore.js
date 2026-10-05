// Scratch pad for in-progress invoices.
//
// Adding procedures to an invoice and walking away — to the schedule, to
// another patient, or by reloading the tab — is not the same as throwing the
// work away: nothing was ever sent to the server. Persisting the in-progress
// rows here lets the finance page re-open the invoice modal exactly where the
// user left off.
//
// A draft is stored per (patient, source) pair. `source` is whatever the modal
// was opened on top of — an existing invoice id, or "new" for a fresh invoice —
// so a draft can never bleed into an unrelated invoice. `sourceData` is that
// same opener, persisted verbatim, because saving needs it: an invoice opened
// from the ledger adds its rows to that invoice, and losing the id would
// silently create a brand new invoice instead.

const STORAGE_PREFIX = "medflow_invoice_draft";
const DRAFT_VERSION = 1;

// A patient can accumulate one draft per invoice they touched. Cap the pile so
// a long-lived tab doesn't leave an unbounded trail of abandoned rows behind.
const MAX_DRAFTS_PER_PATIENT = 10;

const patientPrefix = (patientId) =>
  `${STORAGE_PREFIX}:${patientId !== undefined && patientId !== null ? patientId : ""}:`;

const draftKey = (patientId, source) => `${patientPrefix(patientId)}${source}`;

// Storage access throws in more situations than people expect — Safari private
// browsing, a full quota, storage disabled by policy. Draft persistence is a
// convenience, never a correctness requirement, so every entry point swallows
// its errors and degrades to "no draft".
const storage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const parse = (raw) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Bail on anything written by a different shape of this store rather than
    // rendering half-understood rows into the invoice.
    if (!parsed || parsed.version !== DRAFT_VERSION) return null;
    if (!Array.isArray(parsed.procedures)) return null;
    return parsed;
  } catch {
    return null;
  }
};

// Identity of the thing the modal is billing. Mirrors the checks LedgerList
// makes when it decides whether to add rows to an existing invoice or create
// one, so a draft always resolves the same way at resume time.
export const draftSourceKey = (invoiceData) =>
  invoiceData?.invoiceId || invoiceData?._id || invoiceData?.id || "new";

export const readInvoiceDraft = (patientId, source) => {
  const store = storage();
  if (!store || !patientId) return null;
  try {
    return parse(store.getItem(draftKey(patientId, source)));
  } catch {
    return null;
  }
};

export const saveInvoiceDraft = (patientId, source, draft) => {
  const store = storage();
  if (!store || !patientId) return;
  try {
    const record = {
      version: DRAFT_VERSION,
      patientId,
      source,
      sourceData: draft?.sourceData ?? null,
      procedures: draft?.procedures ?? [],
      unselectedIds: draft?.unselectedIds ?? [],
      description: draft?.description ?? "",
      addClaim: Boolean(draft?.addClaim),
      updatedAt: new Date().toISOString(),
    };
    store.setItem(draftKey(patientId, source), JSON.stringify(record));
    pruneInvoiceDrafts(patientId);
  } catch {
    // Quota exceeded or storage unavailable — the draft simply won't survive
    // a reload. The live modal is unaffected.
  }
};

export const clearInvoiceDraft = (patientId, source) => {
  const store = storage();
  if (!store || !patientId) return;
  try {
    store.removeItem(draftKey(patientId, source));
  } catch {
    /* nothing useful to do */
  }
};

// Every readable draft for a patient, newest first. Key order in localStorage
// is insertion order, not edit order, so sort explicitly rather than trusting it.
export const listInvoiceDrafts = (patientId) => {
  const store = storage();
  if (!store || !patientId) return [];
  const prefix = patientPrefix(patientId);
  const drafts = [];
  try {
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const draft = parse(store.getItem(key));
      if (draft) drafts.push(draft);
    }
  } catch {
    return drafts;
  }
  return drafts.sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || "") || 0;
    const bTime = Date.parse(b.updatedAt || "") || 0;
    return bTime - aTime;
  });
};

// The draft the finance page should re-open on arriving at a patient: the most
// recently touched one that still has rows.
//
// There is deliberately no "dismissed" state. Cancelling the modal leaves the
// draft resumable, because the point of the draft is that work which was never
// sent to the server should come back when the user returns. The two ways out
// are saving the invoice or emptying the table, both of which clear the draft
// outright.
export const findResumableInvoiceDraft = (patientId) =>
  listInvoiceDrafts(patientId).find(
    (draft) => draft.procedures.length > 0,
  ) || null;

const pruneInvoiceDrafts = (patientId) => {
  const store = storage();
  if (!store || !patientId) return;
  try {
    const drafts = listInvoiceDrafts(patientId);
    if (drafts.length <= MAX_DRAFTS_PER_PATIENT) return;
    // listInvoiceDrafts returns newest first, so the tail is the most stale.
    drafts.slice(MAX_DRAFTS_PER_PATIENT).forEach((draft) => {
      store.removeItem(draftKey(patientId, draft.source));
    });
  } catch {
    /* nothing useful to do */
  }
};