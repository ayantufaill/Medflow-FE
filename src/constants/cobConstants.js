/**
 * Coordination of Benefits — shared vocabulary for the UI.
 *
 * Every enum here mirrors `Medflow-BE/src/services/cob/types.ts` one-for-one.
 * They are duplicated rather than imported because the frontend is plain JS
 * and the backend is TypeScript; the test `cobConstants.test.js` is the guard
 * that keeps the two lists from drifting apart silently.
 *
 * LANGUAGE RULE (the reason most of this file exists)
 * ---------------------------------------------------
 * Front-desk staff are not insurance people. The backend speaks in codes
 * (`NON_DUPLICATION`, `CUSTODIAL_SPOUSE`, `NEITHER_PLAN_COORDINATES`); every
 * one of those gets a plain-English label here, and the word "COB" never
 * appears in a string a front-desk user can see. It is allowed in admin
 * screens only as the spelled-out "coordination of benefits", because billing
 * admins do use the term with payers.
 */

/* ── Permissions ──────────────────────────────────────────────────────────
 * These are the literal keys enforced by `Medflow-BE/src/routes/cob.routes.ts`
 * and defined in `PERMISSIONS.INSURANCE_COB`. Checked through
 * `usePermissions().has()` / <Can permission=...>, like every other gated
 * surface in the app.
 *
 * The split is deliberately not uniform, and the backend's route file explains
 * why: the whole front desk needs to SEE which payer is primary and why, while
 * changing the order away from the rules is a billing decision that has to be
 * attributable to someone.
 */
export const COB_PERMISSIONS = {
  /** See a coverage order and its reasoning. Front desk has this. */
  ORDER_READ: 'insurance.coverage_order.read',
  /** Reorder a patient's coverages by hand, against the suggestion. */
  ORDER_OVERRIDE: 'insurance.coverage_order.override',
  /** Clear a review flag — which is what unblocks billing. */
  FLAG_RESOLVE: 'insurance.coverage_order.resolve_flag',
  /** Edit the COB facts on one patient's coverage (the conditional answers). */
  COVERAGE_DETAIL_EDIT: 'insurance.coverage_detail.edit',
  /** Record what a payer said on the phone / portal / 271. */
  PAYER_REPORTED_WRITE: 'insurance.payer_reported.write',
  /** Read plan master-data COB fields (admin area). */
  PLAN_MASTER_READ: 'insurance.plan_master.read',
  /** Edit them — one save re-ranks every patient on the plan. */
  PLAN_MASTER_EDIT: 'insurance.plan_master.edit',
};

/* ── Server-side validation thresholds ────────────────────────────────────
 * Mirrored from `Medflow-BE/src/validators/cob.validator.ts`. Enforced in the
 * UI too, so a user finds out before they submit rather than through a 400.
 */

/** `overrideOrderValidator`: reason must be at least 10 characters. */
export const MIN_OVERRIDE_REASON_LENGTH = 10;

/** `resolveFlagValidator`: resolutionNote must be at least 5 characters. */
export const MIN_RESOLUTION_NOTE_LENGTH = 5;

/* ── Payer type (carrier-level) ─────────────────────────────────────────── */
export const PAYER_TYPES = [
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'MEDICARE', label: 'Medicare' },
  { value: 'MEDICAID', label: 'Medicaid' },
  { value: 'TRICARE', label: 'TRICARE' },
  { value: 'WORKERS_COMP', label: "Workers' compensation" },
  { value: 'AUTO_LIABILITY', label: 'Auto liability' },
];

/* ── Benefit category (plan-level) ──────────────────────────────────────── */
export const BENEFIT_CATEGORIES = [
  { value: 'MEDICAL', label: 'Medical' },
  {
    value: 'FIXED_INDEMNITY',
    label: 'Fixed benefit (indemnity)',
    // Surfaced on the coverage form the moment this category is picked, so the
    // front desk is told *before* saving why this policy will not appear in
    // the claim order.
    note: 'Pays the patient a fixed amount directly. It is not billed as part of the claim order.',
  },
  { value: 'DENTAL', label: 'Dental' },
  { value: 'VISION', label: 'Vision' },
  { value: 'OTHER', label: 'Other' },
];

/** The one category that is carried outside the ranked order. */
export const FIXED_BENEFIT_CATEGORY = 'FIXED_INDEMNITY';

/* ── How a secondary plan calculates its payment ────────────────────────── */
export const COB_PAYMENT_METHODS = [
  {
    value: 'STANDARD',
    label: 'Standard — pays up to its normal benefit',
    help: 'The secondary pays what it would have paid as primary, less what the primary already paid.',
  },
  {
    value: 'NON_DUPLICATION',
    label: 'Non-duplication — pays only the difference',
    help: 'If the primary paid as much as this plan would have, the secondary pays nothing.',
  },
  {
    value: 'CARVE_OUT',
    label: 'Carve-out — pays its benefit minus the primary payment',
    help: 'The plan works out its own allowance first, then subtracts the primary payment.',
  },
  {
    value: 'REMAINING_BALANCE',
    label: 'Remaining balance — pays what is left',
    help: 'The secondary covers the balance the primary left behind, up to its limits.',
  },
  {
    value: 'UNKNOWN',
    label: "Unknown — we haven't confirmed this",
    // UNKNOWN is the default on purpose: a guess here produces a confidently
    // wrong secondary estimate. Unknown makes the estimator show a range.
    help: 'Estimates for this plan will be shown as a range instead of a single figure.',
  },
];

export const UNKNOWN_PAYMENT_METHOD = 'UNKNOWN';

/* ── Where the plan information came from ───────────────────────────────── */
export const COB_INFO_SOURCES = [
  { value: 'DEFAULT', label: 'Default (not checked)' },
  { value: 'PAYER_CONFIRMED', label: 'Confirmed with payer' },
  { value: 'PLAN_DOCUMENT', label: 'Plan document' },
];

/**
 * Shown next to "Does this plan coordinate with other insurance?".
 * Answering "no" makes this plan primary against almost everything, so the
 * help text has to make the bar for saying no explicit.
 */
export const COORDINATES_BENEFITS_HELP =
  'Almost every group plan coordinates with other insurance. Answering "no" is rare — ' +
  'set it only when a payer representative has confirmed it or you are reading it in the ' +
  'plan document, and record which of those below.';

/* ── Who holds the policy ───────────────────────────────────────────────── */
export const SUBSCRIBER_RELATIONSHIPS = [
  { value: 'SELF', label: 'The patient' },
  { value: 'SPOUSE', label: 'Their spouse or partner' },
  { value: 'PARENT', label: 'Their parent' },
  { value: 'OTHER', label: 'Someone else' },
];

export const SELF_RELATIONSHIP = 'SELF';

/* ── How the coverage is held ───────────────────────────────────────────── */
export const COVERAGE_BASES = [
  { value: 'EMPLOYER_GROUP', label: 'Through an employer' },
  { value: 'INDIVIDUAL', label: 'Bought directly / marketplace' },
  { value: 'MEDICARE', label: 'Medicare' },
  { value: 'MEDICAID', label: 'Medicaid' },
  { value: 'TRICARE', label: 'TRICARE' },
  { value: 'COBRA', label: 'COBRA continuation' },
  { value: 'RETIREE', label: 'Retiree plan' },
  { value: 'WORKERS_COMP', label: "Workers' compensation" },
  { value: 'AUTO_LIABILITY', label: 'Auto insurance' },
];

/** Bases whose follow-up question is "what is their employment status?". */
export const COBRA_RETIREE_BASES = ['COBRA', 'RETIREE'];

export const EMPLOYMENT_STATUSES = [
  { value: 'ACTIVE', label: 'Still actively working' },
  { value: 'RETIRED', label: 'Retired' },
  { value: 'LAID_OFF', label: 'Laid off / no longer employed' },
  { value: 'COBRA', label: 'On COBRA continuation' },
];

export const EMPLOYER_SIZE_BANDS = [
  { value: 'UNDER_20', label: 'Under 20 employees' },
  { value: '20_TO_99', label: '20–99 employees' },
  { value: '100_PLUS', label: '100 or more employees' },
];

/* ── Medicare ───────────────────────────────────────────────────────────── */
export const MEDICARE_ENTITLEMENT_REASONS = [
  { value: 'AGE', label: 'Age (65 or over)' },
  { value: 'DISABILITY', label: 'Disability' },
  { value: 'ESRD', label: 'Kidney failure (ESRD)' },
];

export const ESRD_REASON = 'ESRD';
export const MEDICARE_PAYER_TYPE = 'MEDICARE';

/* ── Dependent child / custody ──────────────────────────────────────────── */
export const CUSTODY_ARRANGEMENTS = [
  { value: 'TOGETHER', label: 'Married or living together' },
  { value: 'SEPARATED', label: 'Separated' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'JOINT_CUSTODY', label: 'Joint custody' },
];

/** The answer that means "no further custody questions needed". */
export const PARENTS_TOGETHER = 'TOGETHER';

export const CUSTODY_ROLES = [
  { value: 'CUSTODIAL', label: 'The parent the child lives with' },
  { value: 'CUSTODIAL_SPOUSE', label: "That parent's new spouse" },
  { value: 'NON_CUSTODIAL', label: 'The other parent' },
  { value: 'NON_CUSTODIAL_SPOUSE', label: "The other parent's new spouse" },
];

/* ── Injury (claim-level, never coverage-level) ─────────────────────────── */
export const INJURY_TYPES = [
  { value: 'WORKERS_COMP', label: 'A work injury' },
  { value: 'AUTO_LIABILITY', label: 'A car accident' },
];

/* ── Order status ───────────────────────────────────────────────────────── */
export const ORDER_STATUS = {
  SUGGESTED: 'SUGGESTED',
  NEEDS_INFO: 'NEEDS_INFO',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  CONFIRMED: 'CONFIRMED',
  STAFF_OVERRIDE: 'STAFF_OVERRIDE',
  DISPUTED: 'DISPUTED',
};

/**
 * Badge presentation per status. `tone` maps to the COLORS tokens in
 * CoverageOrderStatusBadge; keeping it as a plain string here means this file
 * stays free of styling imports and is safe to use in tests and validators.
 */
export const ORDER_STATUS_BADGES = {
  SUGGESTED: { label: 'Suggested', tone: 'info' },
  NEEDS_INFO: { label: 'Needs information', tone: 'warning' },
  NEEDS_REVIEW: { label: 'Needs review', tone: 'warning' },
  CONFIRMED: { label: 'Confirmed', tone: 'success' },
  STAFF_OVERRIDE: { label: 'Staff override', tone: 'accent' },
  DISPUTED: { label: 'Disputed', tone: 'error' },
};

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  VERIFIED_WITH_PAYER: 'VERIFIED_WITH_PAYER',
};

export const VERIFIED_BADGE = { label: 'Verified with payer', tone: 'success' };

/** Where a verification came from. */
export const ELIGIBILITY_SOURCES = [
  { value: 'PHONE', label: 'Phone call to the payer' },
  { value: 'PORTAL', label: 'Payer web portal' },
  { value: 'ELIGIBILITY_271', label: 'Electronic eligibility response' },
];

/* ── Review flags ───────────────────────────────────────────────────────── */
export const REVIEW_FLAGS = {
  NEITHER_PLAN_COORDINATES: 'NEITHER_PLAN_COORDINATES',
  RANKING_CYCLE: 'RANKING_CYCLE',
  PAYER_MISMATCH: 'PAYER_MISMATCH',
  COB_DENIAL: 'COB_DENIAL',
  COVERAGE_CHANGED: 'COVERAGE_CHANGED',
};

/**
 * Banner copy and severity per flag. Each one has exactly one primary action,
 * which is the point: a flag a human cannot act on is noise.
 *
 * `blocking` marks the flags that stop claim submission while unresolved, and
 * mirrors `BLOCKING_FLAGS` in `Medflow-BE/src/services/cob/cob.service.ts`:
 * RANKING_CYCLE, PAYER_MISMATCH and COB_DENIAL. The other two inform.
 *
 * It is only used by the client-side FALLBACK in `getClaimBlockers` — the real
 * decision comes from the server's `submittable` block, which travels with the
 * order. Keeping these in step still matters, because the fallback is what a
 * screen sees when it reads an order through the on-date endpoint.
 */
export const REVIEW_FLAG_META = {
  NEITHER_PLAN_COORDINATES: {
    severity: 'warning',
    title: 'Neither plan coordinates with the other',
    body:
      'Both plans may pay in full, which can leave the patient overpaid and the practice ' +
      'owing a refund. Confirm with both payers before billing.',
    actionLabel: 'Mark as confirmed with the payers',
    blocking: false,
  },
  RANKING_CYCLE: {
    severity: 'error',
    title: "We couldn't decide the order automatically",
    body:
      'The plans point at each other, so no automatic order is possible. Please set the ' +
      'order by hand.',
    actionLabel: 'Set the order',
    blocking: true,
  },
  PAYER_MISMATCH: {
    severity: 'error',
    title: 'The insurer reported a different order',
    body:
      'What we worked out and what the insurer told us do not match. The insurer decides, ' +
      'so this has to be settled before a claim goes out.',
    actionLabel: 'Review the difference',
    blocking: true,
  },
  COB_DENIAL: {
    severity: 'error',
    title: 'A claim was denied over the insurance order',
    body:
      'The payer rejected this claim because of how the coverages are ordered. Re-check the ' +
      'order with the payer before resubmitting.',
    actionLabel: 'Re-verify with payer',
    blocking: true,
  },
  COVERAGE_CHANGED: {
    severity: 'info',
    title: 'Insurance details changed',
    body: "Something about this patient's coverage changed since the order was worked out. Review it.",
    actionLabel: 'Review the order',
    blocking: false,
  },
};

/**
 * Order statuses that stop a claim from being submitted. Mirrors
 * `BLOCKING_STATUSES` in the backend's cob.service.ts — note that DISPUTED
 * blocks, which is easy to miss because it reads like a label rather than a
 * gate.
 */
export const BLOCKING_ORDER_STATUSES = [
  ORDER_STATUS.NEEDS_INFO,
  ORDER_STATUS.NEEDS_REVIEW,
  ORDER_STATUS.DISPUTED,
];

/** Plain-English reason shown next to each blocking status. */
export const BLOCKING_STATUS_REASONS = {
  NEEDS_INFO: 'Some answers are missing, so we cannot work out who pays first.',
  NEEDS_REVIEW: 'This order needs a person to look at it before a claim goes out.',
  DISPUTED: 'An insurer disagrees with this order, so it has to be settled before billing.',
};

/* ── Position naming ────────────────────────────────────────────────────── */
export const POSITION_LABELS = { 1: 'Primary', 2: 'Secondary', 3: 'Tertiary' };

/** Ordinal beyond tertiary is vanishingly rare but must not render blank. */
export const positionLabel = (position) => POSITION_LABELS[position] || `Payer ${position}`;

/* ── Responsible party (balance views) ──────────────────────────────────── */
export const RESPONSIBLE_PARTIES = [
  { value: 'PRIMARY', label: 'Primary insurance' },
  { value: 'SECONDARY', label: 'Secondary insurance' },
  { value: 'TERTIARY', label: 'Tertiary insurance' },
  { value: 'PATIENT', label: 'Patient' },
];

/**
 * The exact wording the spec requires on contractual-adjustment lines. It is a
 * constant because it is a compliance-flavoured string: a patient reading a
 * statement must not mistake a write-off for a payment or a discount.
 */
export const CONTRACTUAL_ADJUSTMENT_LABEL = 'Insurance agreed-price adjustment (not billed to patient)';

export const ESTIMATE_LABEL = 'Estimate';

/**
 * Tooltip on the disabled "Create secondary claim" button. The gate exists
 * because a secondary claim is not submittable without the primary's
 * remittance detail (CMS-1500 box 29 / the 837's 2320 loop).
 */
export const SECONDARY_CLAIM_BLOCKED_TOOLTIP =
  "The secondary claim has to carry the primary's payment details, so it can only be created " +
  "once the primary insurer's payment has been posted.";

/* ── Field labels for NEEDS_INFO ────────────────────────────────────────── */
/**
 * The backend returns dotted field paths (`subscriberBirthdate`,
 * `custodyArrangement`). NEEDS_INFO lists them to a human, so each one needs a
 * label and the form section to jump to when "Fix this" is clicked.
 */
export const MISSING_FIELD_META = {
  subscriberName: { label: "Policyholder's name", section: 'policyholder' },
  subscriberBirthdate: { label: "Policyholder's date of birth", section: 'policyholder' },
  relationship: { label: 'Who the policyholder is', section: 'policyholder' },
  coverageBasis: { label: 'How this coverage is held', section: 'coverage' },
  employmentStatus: { label: 'Whether the policyholder is still working', section: 'employment' },
  employerSizeBand: { label: 'How many people the employer has', section: 'employment' },
  medicareEntitlementReason: { label: 'Why the patient has Medicare', section: 'medicare' },
  esrdEntitlementDate: { label: 'When kidney-failure (ESRD) coverage started', section: 'medicare' },
  custodyArrangement: { label: "Whether the parents are together", section: 'custody' },
  custodyRole: { label: 'Which parent this policy belongs to', section: 'custody' },
  courtOrderExists: { label: 'Whether a court order names a responsible parent', section: 'custody' },
  effectiveDate: { label: 'Coverage start date', section: 'coverage' },
  terminationDate: { label: 'Coverage end date', section: 'coverage' },
  memberId: { label: 'Member ID', section: 'coverage' },
  groupNumber: { label: 'Group number', section: 'coverage' },
};

/** Falls back to a de-camel-cased path so an unmapped field is still readable. */
export const missingFieldLabel = (field) =>
  MISSING_FIELD_META[field]?.label ||
  String(field || '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

export const missingFieldSection = (field) => MISSING_FIELD_META[field]?.section || 'coverage';
