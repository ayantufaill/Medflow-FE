import apiClient from '../config/api';

/**
 * Coordination of Benefits service.
 *
 * Every path here is checked against `Medflow-BE/src/routes/cob.routes.ts`
 * (mounted at `/cob` by `src/routes/index.ts`). Request bodies match
 * `src/validators/cob.validator.ts`; response shapes match
 * `src/controllers/cob.controller.ts`.
 *
 * Shapes worth knowing before reading the callers:
 *
 *  • `GET /cob/patients/:id/coverage-order` returns `{ order, coverages,
 *    submittable }` in ONE call — the coverage list and the claim-blocking
 *    decision come back with the order. The UI does not re-derive either:
 *    `submittable.reason` is the server's own sentence, and it is the same
 *    text `assertSubmittable` throws when a claim is actually refused.
 *  • Orders carry `excludedCoverages` (fixed-benefit policies) separately
 *    from `positions`, and `verification: { status, source, date }` separately
 *    from `status`.
 *  • There is no "confirm the order" endpoint — `CONFIRMED` exists in the
 *    status enum but no service sets it. Staff agreement is expressed by
 *    resolving flags or by overriding, both of which are recorded.
 *  • The three PAYER_MISMATCH resolutions are built from two primitives:
 *    `resolve-flag` (with the note that says what was decided) and, when the
 *    insurer's order is adopted, `override` first. See `cobOrderService`.
 */

const unwrap = (response) => response?.data?.data;

/* ── Reference data ─────────────────────────────────────────────────────── */

export const cobReferenceService = {
  /**
   * The server's own enum lists (`GET /cob/enums`).
   *
   * Used as a drift check, not as the source of labels: the endpoint returns
   * bare codes, and the plain-English wording lives in `cobConstants.js`
   * because it is UI copy, not data.
   */
  async getEnums() {
    return unwrap(await apiClient.get('/cob/enums'));
  },

  /**
   * Which eligibility providers exist and whether any can be queried
   * automatically — `{ providers: [{ name, isAutomated }], active }`.
   * This is what decides whether the automatic-check button is useful.
   */
  async getEligibilityProviders() {
    return unwrap(await apiClient.get('/cob/eligibility/providers'));
  },
};

/* ── Plan master data (admin) ───────────────────────────────────────────── */

export const cobPlanMasterService = {
  /**
   * Search the plan master list.
   *
   * `carrierId` (not "payerId") is the backend's filter name. `unconfirmedOnly`
   * surfaces the plans whose COB fields are still defaults nobody confirmed —
   * the data-quality worklist.
   */
  async getPlans({
    page = 1,
    limit = 25,
    search = '',
    carrierId = '',
    benefitCategory = '',
    cobPaymentMethod = '',
    unconfirmedOnly = false,
  } = {}) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (carrierId) params.append('carrierId', String(carrierId));
    if (benefitCategory) params.append('benefitCategory', benefitCategory);
    if (cobPaymentMethod) params.append('cobPaymentMethod', cobPaymentMethod);
    if (unconfirmedOnly) params.append('unconfirmedOnly', 'true');

    // -> { plans, page, limit, total }
    return unwrap(await apiClient.get(`/cob/plans?${params.toString()}`));
  },

  /**
   * One plan, **with its full version history attached as `history`**. There
   * is no separate history endpoint — the detail call carries it.
   * -> { plan: { ...fields, history: [{ version, snapshot, changedBy, changeNote, changedAt }] } }
   */
  async getPlan(planId) {
    return unwrap(await apiClient.get(`/cob/plans/${planId}`));
  },

  /**
   * Read-only dry run: how many patients a COB-field change would re-rank.
   * -> { planId, affectedPatients, openClaims, patientsOnPlan }
   *
   * Asked for before the save so the admin sees the blast radius while they
   * can still back out. The count is the server's because "open claim" is
   * defined by Open Dental status codes the client should not model.
   */
  async getCobChangeImpact(planId) {
    return unwrap(await apiClient.get(`/cob/plans/${planId}/cob-impact`));
  },

  /**
   * PATCH the COB fields. Partial — only the fields present are changed.
   * -> { plan, changed: { field: { from, to } }, version,
   *      reEvaluated: [{ patientId, status, orderVersion }] }
   *
   * `reEvaluated` is the fan-out that actually happened, so the UI can report
   * what it did rather than what it predicted.
   */
  async updatePlanCobFields(planId, { changeNote, ...fields }) {
    return unwrap(
      await apiClient.patch(`/cob/plans/${planId}/cob`, { ...fields, changeNote })
    );
  },

  /** Carrier-level payer type, which the Medicare/Medicaid/TRICARE rules branch on. */
  async setCarrierPayerType(carrierId, payerType) {
    return unwrap(
      await apiClient.patch(`/cob/carriers/${carrierId}/payer-type`, { payerType })
    );
  },
};

/* ── "The plan isn't listed" ────────────────────────────────────────────── */

export const cobPlanRequestService = {
  /**
   * The front desk found a plan that is not in the master list.
   *
   * There is no COB endpoint for this, and there should not be: the plan
   * master carries the coordination settings every patient on a plan
   * inherits, so letting the front desk mint plans is how duplicate rows with
   * unconfirmed defaults get created. Instead this raises a TASK, which is the
   * app's existing mechanism for "a human needs to do something" — a billing
   * admin picks it up and adds the plan properly.
   */
  async requestPlan({ planName, groupNumber, payerPhone, note, carrierId, carrierName, patientId }) {
    const description = [
      `Plan not in the master list: "${planName}"`,
      carrierName ? `Payer: ${carrierName}` : carrierId ? `Carrier id: ${carrierId}` : '',
      groupNumber ? `Group number: ${groupNumber}` : '',
      payerPhone ? `Phone on card: ${payerPhone}` : '',
      note ? `Note: ${note}` : '',
      'Add the plan and record its coordination settings in Admin → Insurance Management → Plan Coordination.',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await apiClient.post('/tasks', {
      title: `Add insurance plan: ${planName}`,
      description,
      priority: 'high',
      category: 'insurance',
      patientId: patientId ?? undefined,
    });
    return response?.data?.data;
  },
};

/* ── Coverage detail (the COB facts on one coverage) ────────────────────── */

export const cobCoverageService = {
  /** -> { detail } — null when nobody has recorded the COB facts yet. */
  async getCoverageDetail(coverageId) {
    return unwrap(await apiClient.get(`/cob/coverages/${coverageId}/detail`));
  },

  /**
   * Upsert the COB facts on one coverage.
   *
   * SCOPE NOTE: this endpoint owns ONLY the coordination facts — coverage
   * basis, employment, Medicare entitlement, subscriber name/DOB override,
   * custody. The payer, plan, member ID, group number and dates still live on
   * `patplan`/`inssub`/`insplan` and are saved through the existing
   * `patient-insurance` endpoints. The coverage form therefore saves in two
   * steps, and `useSaveCobCoverage` is the one that does the COB half.
   *
   * Field names follow the backend validator exactly — note
   * `subscriberEmploymentStatus`, not `employmentStatus`.
   */
  async updateCoverageDetail(coverageId, payload) {
    return unwrap(await apiClient.patch(`/cob/coverages/${coverageId}/detail`, payload));
  },

  /**
   * What this coverage would pay as secondary.
   * -> { coverageId, carrierName, cobPaymentMethod, cobInfoSource, estimate, disclaimer }
   *
   * `estimate` is a range when the plan's payment method is UNKNOWN, which is
   * the whole reason this is a server call and not client arithmetic.
   */
  async estimateSecondary(coverageId, input) {
    return unwrap(
      await apiClient.post(`/cob/coverages/${coverageId}/secondary-estimate`, input)
    );
  },
};

/* ── Coverage order ─────────────────────────────────────────────────────── */

export const cobOrderService = {
  /**
   * The order in force today, plus the patient's coverages, plus whether a
   * claim for `dateOfService` may be submitted.
   * -> { order, coverages, submittable: { allowed, reason, orderId, status } }
   */
  async getCurrentOrder(patientId, { dateOfService } = {}) {
    const params = new URLSearchParams();
    if (dateOfService) params.append('dateOfService', dateOfService);
    const qs = params.toString();

    return unwrap(
      await apiClient.get(
        `/cob/patients/${patientId}/coverage-order${qs ? `?${qs}` : ''}`
      )
    );
  },

  /**
   * The order that was in force on a date — what a claim for that date must
   * bill. `date` is required by the endpoint. -> { order, date }
   */
  async getOrderForDate(patientId, date) {
    const params = new URLSearchParams({ date });
    return unwrap(
      await apiClient.get(
        `/cob/patients/${patientId}/coverage-order/on-date?${params.toString()}`
      )
    );
  },

  /** Every version, newest first. -> { orders: [...] } */
  async getOrderHistory(patientId) {
    return unwrap(await apiClient.get(`/cob/patients/${patientId}/coverage-order/history`));
  },

  /**
   * Re-run the rules and save a new version. -> { order }
   *
   * `injuryRelated` / `injuryType` are claim context and are passed here
   * rather than stored on a coverage: the same workers' comp policy is primary
   * for the back injury and irrelevant for the flu shot.
   */
  async evaluateOrder(patientId, { dateOfService, effectiveFrom, triggerReason, injuryRelated, injuryType } = {}) {
    return unwrap(
      await apiClient.post(`/cob/patients/${patientId}/coverage-order/evaluate`, {
        dateOfService,
        effectiveFrom,
        triggerReason,
        injuryRelated,
        injuryType,
      })
    );
  },

  /**
   * Replace the suggested order with a hand-picked one. -> { order }
   * `reason` must be at least 10 characters (backend validator).
   */
  async overrideOrder(patientId, { orderedCoverageIds, reason }) {
    return unwrap(
      await apiClient.post(`/cob/patients/${patientId}/coverage-order/override`, {
        orderedCoverageIds,
        reason,
      })
    );
  },

  /**
   * Resolve one review flag. -> { order }
   *
   * `flag` is the flag CODE, not a row id — the endpoint resolves every open
   * flag of that code on the order. `resolutionNote` must be at least 5
   * characters. Resolving the last blocking flag is what lifts a DISPUTED or
   * NEEDS_REVIEW order back to billable.
   */
  async resolveFlag(orderId, { flag, resolutionNote }) {
    return unwrap(
      await apiClient.post(`/cob/coverage-orders/${orderId}/resolve-flag`, {
        flag,
        resolutionNote,
      })
    );
  },
};

/* ── Payer-reported coverage (manual eligibility) ───────────────────────── */

export const cobVerificationService = {
  /** -> { reports: [...] }, newest first. */
  async getPayerReports(patientId) {
    return unwrap(
      await apiClient.get(`/cob/patients/${patientId}/payer-reported-coverage`)
    );
  },

  /**
   * Record what an insurer said. The backend normalises this through the
   * MANUAL eligibility provider, compares it against our own order, and raises
   * PAYER_MISMATCH on disagreement — it never adopts either side.
   *
   * There is no `referenceNumber` field on the endpoint, so the call reference
   * is carried in `note` (and the verbatim payload, if any, in `raw`).
   */
  async recordPayerReport(patientId, payload) {
    return unwrap(
      await apiClient.post(`/cob/patients/${patientId}/payer-reported-coverage`, payload)
    );
  },
};

/* ── Claims & balances ──────────────────────────────────────────────────── */

export const cobBillingService = {
  /**
   * Has the primary's remittance been posted, and what would the secondary
   * carry? -> { posted, reason, paidAmount, allowedAmount,
   *             patientResponsibility, adjustments, remittanceDate }
   *
   * Note `posted`, not `canCreate`: a $0 denial counts as posted, because a
   * denial IS an adjudication and the secondary is entitled to see it.
   */
  async getSecondaryReadiness(claimId) {
    return unwrap(await apiClient.get(`/cob/claims/${claimId}/secondary-readiness`));
  },

  /** -> { primaryPayment } — the adjudication a secondary claim is carrying. */
  async getPrimaryPaymentDetail(claimId) {
    return unwrap(await apiClient.get(`/cob/claims/${claimId}/primary-payment`));
  },

  /**
   * Invoice balance split by who owes it.
   * -> { statementId, byParty: [{ responsibleParty, charges, payments,
   *      contractualAdjustments, balance }], contractualAdjustmentsTotal,
   *      contractualAdjustmentsAreBillableToPatient,
   *      patientLiabilityFinalizedAt, lastPayerClaimId }
   *
   * Keyed by INVOICE (statement), not by claim — one invoice is what a patient
   * receives and what the ledger is written against.
   */
  async getInvoiceResponsibility(invoiceId) {
    return unwrap(await apiClient.get(`/cob/invoices/${invoiceId}/responsibility`));
  },

  /**
   * Generate the secondary claim from the primary.
   *
   * Lives on the claims API, not the COB one
   * (`POST /claims/:primaryClaimId/generate-secondary`); the COB side only
   * owns the gate that says whether it is allowed yet.
   */
  async generateSecondaryClaim(primaryClaimId) {
    return unwrap(await apiClient.post(`/claims/${primaryClaimId}/generate-secondary`));
  },
};
