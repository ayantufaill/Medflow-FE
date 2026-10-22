// Allow the server's 60s transaction and 10s acquisition limits to finish first.
export const DRAFT_REQUEST_TIMEOUT_MS = 80000;

export const withDraftRequestDeadline = async (request) => {
  const controller = new AbortController();
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => request({ signal: controller.signal, timeout: DRAFT_REQUEST_TIMEOUT_MS })),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error('Saving took too long. Please retry Save to check or finish this draft.');
          error.code = 'ETIMEDOUT';
          reject(error);
          controller.abort();
        }, DRAFT_REQUEST_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};

const createRequestId = () => {
  if (globalThis.crypto.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const unwrapPlan = response => response?.data?.treatmentPlan || response?.treatmentPlan || response?.data || response;

/** Keep the same POST payload/key until its outcome is known, including after
 * closing and reopening the dialog. A retry returns the already committed plan. */
export const saveTreatmentPlanDraft = async ({
  service, attempt, patientId, title, activePlanId, items, savedItems, totals, onPlanSaved,
}) => {
  const retryingUnconfirmedCreation = Boolean(attempt.payload);
  if (!attempt.payload) {
    if (activePlanId && JSON.stringify(items) !== JSON.stringify(savedItems)) {
      const response = await withDraftRequestDeadline(config => service.update(activePlanId, {
        items, ...totals,
      }, config));
      onPlanSaved(unwrapPlan(response));
    }
    attempt.payload = {
      patientId, title, status: 'A', ...totals,
      creationRequestId: createRequestId(),
      items: items.map(item => {
        const copy = { ...item };
        delete copy.id;
        delete copy._id;
        delete copy.procTPNum;
        return copy;
      }),
    };
  }
  try {
    const response = await withDraftRequestDeadline(config => service.create(attempt.payload, config));
    const plan = unwrapPlan(response);
    if (!plan?._id && !plan?.id) throw new Error('Draft response did not include an id. Retry Save to recover it.');
    attempt.payload = null;
    return plan;
  } catch (error) {
    // A validation/access rejection cannot have committed the draft. An unknown
    // network/server outcome keeps its key so retrying cannot create it twice.
    if (!retryingUnconfirmedCreation && [400, 401, 403, 404, 422].includes(error.response?.status)) {
      attempt.payload = null;
    }
    throw error;
  }
};
