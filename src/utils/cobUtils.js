import {
  FIXED_BENEFIT_CATEGORY,
  MEDICARE_PAYER_TYPE,
  ESRD_REASON,
  SELF_RELATIONSHIP,
  PARENTS_TOGETHER,
  COBRA_RETIREE_BASES,
  UNKNOWN_PAYMENT_METHOD,
  ORDER_STATUS,
  BLOCKING_ORDER_STATUSES,
  BLOCKING_STATUS_REASONS,
  REVIEW_FLAGS,
  REVIEW_FLAG_META,
  VERIFICATION_STATUS,
} from '../constants/cobConstants';
import { computeAge } from './dateUtils';

/**
 * Pure helpers for the COB UI. No React, no API, no MUI — so the rules that
 * decide which questions a user sees can be unit-tested directly, and so the
 * same answers drive the form, the NEEDS_INFO "fix this" jump, and the tests.
 */

/* ── Conditional questions ──────────────────────────────────────────────── */

/**
 * Which conditional sections apply to the coverage currently being entered.
 *
 * This is one function rather than a handful of inline `&&`s in the form
 * because the same visibility set is needed in three places: rendering,
 * validation (a hidden field must never be required), and the test that
 * asserts each scenario. Three copies of this logic would drift.
 *
 * @param {Object} values   current form values
 * @param {Object} context  { patientIsDependentChild, otherCoverages }
 */
export const getVisibleConditionalSections = (values = {}, context = {}) => {
  const {
    payerType,
    coverageBasis,
    relationship,
    medicareEntitlementReason,
    custodyArrangement,
  } = values;

  const isMedicare = payerType === MEDICARE_PAYER_TYPE || coverageBasis === 'MEDICARE';

  // "Still actively working?" + employer size only matter when Medicare has to
  // be ranked against an employer group plan — that pairing is the entire
  // reason the Medicare Secondary Payer rules ask about employer size.
  const hasEmployerCoverage =
    coverageBasis === 'EMPLOYER_GROUP' ||
    (context.otherCoverages || []).some((c) => c?.coverageBasis === 'EMPLOYER_GROUP');

  // Custody questions apply only to a child carried on two parents' policies.
  // A child on one parent's policy has nothing to compare, so asking would be
  // noise at the front desk.
  const coveredByBothParents =
    relationship === 'PARENT' &&
    (context.otherCoverages || []).some((c) => c?.relationship === 'PARENT');

  return {
    // Not-self policyholder: name and DOB become required (see validateCoverageForm).
    subscriber: !!relationship && relationship !== SELF_RELATIONSHIP,
    medicare: isMedicare,
    esrdDate: isMedicare && medicareEntitlementReason === ESRD_REASON,
    employment: isMedicare && hasEmployerCoverage,
    custody: !!(context.patientIsDependentChild && coveredByBothParents),
    // Only once we know the parents are NOT together does the arrangement
    // matter; "married or living together" ends the questioning.
    custodyDetail: !!(
      context.patientIsDependentChild &&
      coveredByBothParents &&
      custodyArrangement &&
      custodyArrangement !== PARENTS_TOGETHER
    ),
    cobraRetiree: COBRA_RETIREE_BASES.includes(coverageBasis),
  };
};

/**
 * Validation for the coverage form.
 *
 * Returns a react-hook-form-compatible `{ field: message }` map. A field that
 * is not currently visible is never required — otherwise a user could be
 * blocked by a question they cannot see.
 */
export const validateCoverageForm = (values = {}, context = {}) => {
  const errors = {};
  const visible = getVisibleConditionalSections(values, context);

  if (!values.carrierId) errors.carrierId = 'Choose the insurance company.';
  if (!values.planId && !values.planNotListed) errors.planId = 'Choose the plan.';
  if (!values.memberId?.trim()) errors.memberId = 'Enter the member ID from the card.';
  if (!values.relationship) errors.relationship = 'Choose who holds this policy.';

  if (visible.subscriber) {
    if (!values.subscriberName?.trim()) {
      errors.subscriberName = "Enter the policyholder's name.";
    }
    // The birthday rule compares the two subscribers' month and day. Without
    // the DOB of a policyholder who is not the patient, there is nothing to
    // compare and the order falls to NEEDS_INFO — so it is collected up front.
    if (!values.subscriberBirthdate) {
      errors.subscriberBirthdate =
        "Enter the policyholder's date of birth — it decides which plan pays first.";
    }
  }

  if (visible.medicare && !values.medicareEntitlementReason) {
    errors.medicareEntitlementReason = 'Choose why the patient has Medicare.';
  }

  if (visible.esrdDate && !values.esrdEntitlementDate) {
    errors.esrdEntitlementDate = 'Enter the date the kidney-failure coverage started.';
  }

  if (visible.employment && !values.employmentStatus) {
    errors.employmentStatus = 'Say whether the policyholder is still actively working.';
  }

  if (visible.employment && values.employmentStatus === 'ACTIVE' && !values.employerSizeBand) {
    errors.employerSizeBand = 'Choose the employer size.';
  }

  if (visible.custody && !values.custodyArrangement) {
    errors.custodyArrangement = 'Say whether the parents are married or living together.';
  }

  if (visible.custodyDetail && !values.custodyRole) {
    errors.custodyRole = 'Choose which parent this policy belongs to.';
  }

  if (visible.cobraRetiree && !values.employmentStatus) {
    errors.employmentStatus = "Choose the policyholder's employment status.";
  }

  return errors;
};

/* ── Order shaping ──────────────────────────────────────────────────────── */

/** A fixed-benefit (indemnity) policy pays the patient, so it is never ranked. */
export const isFixedBenefit = (coverage) =>
  coverage?.benefitCategory === FIXED_BENEFIT_CATEGORY;

/**
 * Split a `ShapedOrder` into the ranked list and the "not part of claim order"
 * list.
 *
 * The backend already separates these: `positions` are the ranked coverages
 * and `excludedCoverages` the fixed-benefit ones. A position with a null
 * `position` is still tolerated here, because `shapeOrder` types it as
 * `number | null` and an excluded row that ever appeared in `positions` must
 * not render as "Payer null".
 */
export const splitOrderPositions = (order) => {
  const positions = order?.positions || [];

  const ranked = positions
    .filter((p) => p.position != null)
    .slice()
    .sort((a, b) => a.position - b.position);

  const excluded = [
    ...positions.filter((p) => p.position == null),
    ...(order?.excludedCoverages || []),
  ];

  return { ranked, excluded };
};

/* ── Blocking ───────────────────────────────────────────────────────────── */

/** Flags raised but not yet resolved. */
export const unresolvedFlags = (order) =>
  (order?.flags || []).filter((f) => !f.resolvedAt);

/**
 * Why claims are blocked, as a list of sentences.
 *
 * THE SERVER DECIDES THIS, NOT US. `submittable` comes back with the order and
 * carries the same sentence `cobService.assertSubmittable` throws when a
 * submission is actually refused — so what the panel says and what happens on
 * submit cannot drift apart. Re-deriving it from status and flags here would
 * create exactly that gap, and the backend's blocking set is not what you'd
 * guess: DISPUTED blocks, and RANKING_CYCLE and COB_DENIAL block alongside
 * PAYER_MISMATCH.
 *
 * The fallback below only covers a payload with no `submittable` at all.
 */
export const getClaimBlockers = (payload) => {
  if (!payload) return [];

  const submittable = payload.submittable;
  if (submittable) {
    return submittable.allowed === false && submittable.reason ? [submittable.reason] : [];
  }

  // No submittable block (an order fetched through the on-date endpoint, for
  // instance). Fall back to the statuses the backend treats as blocking.
  const order = payload.order || payload;
  if (!order?.status) return [];

  const blockers = [];
  if (BLOCKING_ORDER_STATUSES.includes(order.status)) {
    blockers.push(
      BLOCKING_STATUS_REASONS[order.status] ||
        `This order is ${order.status.toLowerCase().replace(/_/g, ' ')} and cannot be billed yet.`
    );
  }
  unresolvedFlags(order)
    .filter((f) => REVIEW_FLAG_META[f.flag]?.blocking)
    .forEach((f) => blockers.push(REVIEW_FLAG_META[f.flag].body));

  return [...new Set(blockers)];
};

export const isClaimBlocked = (payload) => getClaimBlockers(payload).length > 0;

/* ── Badges ─────────────────────────────────────────────────────────────── */

/**
 * The badges for one order. Verification is a separate backend field from
 * status (`order.verification.status`), so a confirmed-and-verified order
 * correctly shows both: "Confirmed" says a human agreed, "Verified with payer"
 * says the insurer did.
 */
export const orderBadges = (order) => {
  const badges = [];
  if (order?.status) badges.push(order.status);
  if (order?.verification?.status === VERIFICATION_STATUS.VERIFIED_WITH_PAYER) {
    badges.push('VERIFIED_WITH_PAYER');
  }
  if (unresolvedFlags(order).some((f) => f.flag === REVIEW_FLAGS.PAYER_MISMATCH)) {
    badges.push(ORDER_STATUS.DISPUTED);
  }
  return [...new Set(badges)];
};

/* ── Estimates ──────────────────────────────────────────────────────────── */

const money = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Number(value || 0)
  );

export const formatMoney = money;

/**
 * How a not-yet-remitted insurance payment is shown.
 *
 * When the plan's payment method is UNKNOWN the backend cannot produce a
 * single number — a non-duplication plan might pay nothing where a standard
 * plan pays the full balance. So it returns a low/high pair and this renders
 * the range. Showing the midpoint instead would be a confidently wrong figure
 * that the front desk would quote to a patient.
 */
export const formatEstimate = (entry) => {
  if (!entry) return '';

  const hasRange =
    entry.estimateLow != null &&
    entry.estimateHigh != null &&
    Number(entry.estimateLow) !== Number(entry.estimateHigh);

  if (hasRange) return `${money(entry.estimateLow)} – ${money(entry.estimateHigh)}`;
  if (entry.estimateLow != null) return money(entry.estimateLow);
  return money(entry.amount);
};

/** True when the figure is a range because we don't know how the plan pays. */
export const isUnknownMethodEstimate = (entry) =>
  entry?.estimated === true && entry?.cobPaymentMethod === UNKNOWN_PAYMENT_METHOD;

/* ── Date-of-service order ──────────────────────────────────────────────── */

/**
 * Whether the order a claim screen is showing is not the one in force today.
 *
 * `ShapedOrder.isCurrent` is the backend's own flag (it means
 * `effective_to IS NULL`). Claim screens must bill the order effective on the
 * date of service, but the user still has to be told when that differs from
 * what they would see elsewhere — silently showing a stale order is how a
 * claim goes to the wrong payer.
 */
export const isHistoricalOrder = (order) => {
  if (!order) return false;
  if (order.isCurrent != null) return !order.isCurrent;
  // A closed effective range means a superseded version.
  return !!order.effectiveTo;
};

/* ── Payer mismatch ────────────────────────────────────────────────────── */

/**
 * Normalise our suggestion and the payer's report into two parallel lists so
 * the side-by-side view renders both the same way.
 *
 * The payer's side is assembled from one `cob_payer_reported_coverage` row,
 * which is how the backend stores it: the reporting payer names a position for
 * ITSELF (`reportedSelfOrder`) and, when it knows about one, a position for
 * the other coverage (`otherPayerReportedOrder`). Anything it did not mention
 * is simply absent — never inferred, because an insurer's silence is not a
 * statement about the order.
 */
export const buildMismatchComparison = (order, report, coveragesById = {}) => {
  const { ranked } = splitOrderPositions(order);

  const nameFor = (coverageId, fallback) =>
    coveragesById[coverageId]?.displayName ||
    coveragesById[coverageId]?.carrierName ||
    fallback ||
    coverageId;

  const ours = ranked.map((p) => ({
    position: p.position,
    coverageId: p.coverageId,
    label: nameFor(p.coverageId, p.carrierName),
    explanation: p.explanation,
  }));

  const theirs = [];

  if (report?.reportedSelfOrder != null) {
    theirs.push({
      position: report.reportedSelfOrder,
      coverageId: report.coverageId ?? null,
      label: nameFor(report.coverageId, report.reportingCarrierName),
    });
  }

  if (report?.otherPayerReportedOrder != null) {
    theirs.push({
      position: report.otherPayerReportedOrder,
      coverageId: report.otherPayerCarrierId ?? null,
      label:
        report.otherPayerName ||
        nameFor(report.otherPayerCarrierId, 'the other coverage they named'),
    });
  }

  theirs.sort((a, b) => a.position - b.position);

  return { ours, theirs };
};

/**
 * The ranking the payer reported, as coverage ids in order — the payload an
 * "accept the insurer's order" override needs.
 *
 * Returns null when the payer's report cannot be turned into a complete
 * ranking of the coverages we actually hold. That is the common case (an
 * insurer usually names only itself), and it matters: the override endpoint
 * replaces the WHOLE order, so submitting a partial list would silently drop
 * a coverage. The UI falls back to asking staff to set the order by hand.
 */
export const payerReportedRanking = (order, report) => {
  const { ranked } = splitOrderPositions(order);
  const ourIds = ranked.map((p) => p.coverageId);
  if (!report || ourIds.length === 0) return null;

  const placed = new Map();
  if (report.reportedSelfOrder != null && report.coverageId) {
    placed.set(String(report.coverageId), report.reportedSelfOrder);
  }
  if (report.otherPayerReportedOrder != null && report.otherPayerCoverageId) {
    placed.set(String(report.otherPayerCoverageId), report.otherPayerReportedOrder);
  }

  // Every coverage we hold must have been given a position, or we cannot build
  // a full ranking without guessing.
  if (placed.size !== ourIds.length) return null;
  if (!ourIds.every((id) => placed.has(String(id)))) return null;

  return [...ourIds].sort(
    (a, b) => placed.get(String(a)) - placed.get(String(b))
  );
};

/* ── Coverage-form context ──────────────────────────────────────────────── */

/**
 * The age at which the dependent-child coordination rules stop applying.
 *
 * 26 is the ACA dependent limit — above it a person cannot be a dependent
 * child on a parent's plan, so the birthday rule and the custody rules have
 * nothing to decide and asking about custody would be noise at the front desk.
 */
export const DEPENDENT_CHILD_AGE_LIMIT = 26;

/**
 * Build the `context` the coverage form needs to decide which conditional
 * questions apply.
 *
 * `coverages` must be the COB coverage list (the `coverages` array that comes
 * back with the coverage order), NOT the legacy insurance list: it is already
 * normalised to the rule engine's own vocabulary — `relationship` as
 * SELF/SPOUSE/PARENT/OTHER and `coverageBasis` as EMPLOYER_GROUP/MEDICARE/… —
 * which is exactly what `getVisibleConditionalSections` reads. Deriving it
 * from the legacy list would mean re-implementing that mapping here and
 * getting a different answer from the server's.
 *
 * `patientIsDependentChild` is deliberately two conditions, not one:
 *   • the patient is under the dependent age limit, AND
 *   • at least one of their policies is held by a parent.
 * Age alone would ask a 20-year-old with their own employer plan about their
 * parents' custody arrangement; the parent relationship alone would ask a
 * 45-year-old still listed on a parent's policy.
 *
 * @param {Object}   patient            the patient record (needs dateOfBirth)
 * @param {Array}    coverages          COB coverage list for this patient
 * @param {string}   editingCoverageId  excluded from `otherCoverages`
 */
export const deriveCoverageFormContext = ({
  patient,
  coverages = [],
  editingCoverageId = null,
} = {}) => {
  const otherCoverages = coverages
    .filter((coverage) => String(coverage.id) !== String(editingCoverageId))
    .map((coverage) => ({
      id: coverage.id,
      relationship: coverage.relationship,
      coverageBasis: coverage.coverageBasis,
      payerType: coverage.payerType,
      benefitCategory: coverage.benefitCategory,
    }));

  const age = computeAge(patient?.dateOfBirth || patient?.birthDate || patient?.Birthdate);
  const onAParentsPolicy = coverages.some((coverage) => coverage.relationship === 'PARENT');

  return {
    otherCoverages,
    patientIsDependentChild:
      age != null && age < DEPENDENT_CHILD_AGE_LIMIT && onAParentsPolicy,
    patientAge: age,
  };
};
