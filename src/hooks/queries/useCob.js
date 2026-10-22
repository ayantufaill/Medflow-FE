import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cobReferenceService,
  cobPlanMasterService,
  cobPlanRequestService,
  cobCoverageService,
  cobOrderService,
  cobVerificationService,
  cobBillingService,
} from '../../services/cob.service';

/**
 * React Query bindings for Coordination of Benefits.
 *
 * Two design points worth knowing:
 *
 * 1. Almost every mutation here can change the suggested order as a side
 *    effect — editing coverage facts, editing plan master data, recording what
 *    a payer said, resolving a flag. So each invalidates `cobKeys.orders()`
 *    rather than patching the cache. The order is a server-computed decision
 *    record with its own version history; guessing at it client-side is the
 *    "two sources of truth" problem this feature exists to remove.
 *
 * 2. `useCoverageOrder` is one query that returns the order, the coverage list
 *    AND the claim-blocking decision, because that is what the endpoint
 *    returns. The UI never re-derives whether a claim is blocked — the server
 *    sentence in `submittable.reason` is the same one `assertSubmittable`
 *    throws when a submission is actually refused, so the two can't disagree.
 */

export const cobKeys = {
  all: ['cob'],

  enums: () => [...cobKeys.all, 'enums'],
  eligibilityProviders: () => [...cobKeys.all, 'eligibility-providers'],

  plans: () => [...cobKeys.all, 'plans'],
  planList: (filters) => [...cobKeys.plans(), 'list', filters],
  plan: (planId) => [...cobKeys.plans(), 'detail', planId],
  planImpact: (planId) => [...cobKeys.plans(), 'cob-impact', planId],

  coverageDetail: (coverageId) => [...cobKeys.all, 'coverage-detail', coverageId],
  coverageCards: (coverageId) => [...cobKeys.all, 'coverage-cards', coverageId],

  planRequests: (filters) => [...cobKeys.all, 'plan-requests', filters],

  orders: () => [...cobKeys.all, 'order'],
  order: (patientId, dateOfService) => [...cobKeys.orders(), patientId, { dateOfService }],
  orderOnDate: (patientId, date) => [...cobKeys.orders(), 'on-date', patientId, date],
  orderHistory: (patientId) => [...cobKeys.orders(), 'history', patientId],

  payerReports: (patientId) => [...cobKeys.all, 'payer-reports', patientId],

  invoiceResponsibility: (invoiceId) => [...cobKeys.all, 'invoice-responsibility', invoiceId],
  secondaryReadiness: (claimId) => [...cobKeys.all, 'secondary-readiness', claimId],
  primaryPayment: (claimId) => [...cobKeys.all, 'primary-payment', claimId],
  downstreamEstimates: (claimId) => [...cobKeys.all, 'downstream-estimates', claimId],
};

/* Matches the cache policy the other query hooks in this folder use. */
const BASE_QUERY_OPTIONS = {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
};

/* ── Reference data ─────────────────────────────────────────────────────── */

export const useCobEnums = (options = {}) =>
  useQuery({
    queryKey: cobKeys.enums(),
    queryFn: () => cobReferenceService.getEnums(),
    // Enum lists change only on deploy, so they are worth holding longer than
    // the default minute.
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });

export const useEligibilityProviders = (options = {}) =>
  useQuery({
    queryKey: cobKeys.eligibilityProviders(),
    queryFn: () => cobReferenceService.getEligibilityProviders(),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });

/* ── Plan master ────────────────────────────────────────────────────────── */

export const useCobPlans = (filters = {}, options = {}) =>
  useQuery({
    queryKey: cobKeys.planList(filters),
    queryFn: () => cobPlanMasterService.getPlans(filters),
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/** The plan detail carries its own version history — there is no separate call. */
export const useCobPlan = (planId, options = {}) =>
  useQuery({
    queryKey: cobKeys.plan(planId),
    queryFn: () => cobPlanMasterService.getPlan(planId),
    enabled: !!planId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/**
 * The affected-patient count for a pending edit.
 *
 * Keyed on the plan alone, not on the proposed values: the backend's count is
 * "patients on this plan with an open claim", which is the same number
 * whichever COB field is being changed. Keying it on the draft values would
 * re-fetch an identical answer on every keystroke.
 */
export const useCobPlanChangeImpact = (planId, options = {}) =>
  useQuery({
    queryKey: cobKeys.planImpact(planId),
    queryFn: () => cobPlanMasterService.getCobChangeImpact(planId),
    enabled: !!planId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const useUpdateCobPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, payload }) =>
      cobPlanMasterService.updatePlanCobFields(planId, payload),
    onSuccess: (_data, { planId }) => {
      queryClient.invalidateQueries({ queryKey: cobKeys.plans() });
      queryClient.invalidateQueries({ queryKey: cobKeys.plan(planId) });
      // The save re-ranks every patient on the plan with an open claim, so no
      // cached order survives it.
      queryClient.invalidateQueries({ queryKey: cobKeys.orders() });
    },
  });
};

export const useSetCarrierPayerType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carrierId, payerType }) =>
      cobPlanMasterService.setCarrierPayerType(carrierId, payerType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cobKeys.plans() });
      // Payer type drives the Medicare/Medicaid/TRICARE rules.
      queryClient.invalidateQueries({ queryKey: cobKeys.orders() });
    },
  });
};

/**
 * Raise a plan request. Notifies everyone holding
 * `insurance.plan_master.edit` — see `cobPlanRequestService`.
 */
export const useRequestPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => cobPlanRequestService.createPlanRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cobKeys.all, 'plan-requests'] });
    },
  });
};

/** The admin worklist of plans waiting to be added. */
export const usePlanRequests = (filters = { status: 'OPEN' }, options = {}) =>
  useQuery({
    queryKey: cobKeys.planRequests(filters),
    queryFn: () => cobPlanRequestService.getPlanRequests(filters),
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const useResolvePlanRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, ...payload }) =>
      cobPlanRequestService.resolvePlanRequest(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...cobKeys.all, 'plan-requests'] });
      // A resolved request means a new plan exists.
      queryClient.invalidateQueries({ queryKey: cobKeys.plans() });
    },
  });
};

/* ── Coverage detail ────────────────────────────────────────────────────── */

export const useCoverageDetail = (coverageId, options = {}) =>
  useQuery({
    queryKey: cobKeys.coverageDetail(coverageId),
    queryFn: () => cobCoverageService.getCoverageDetail(coverageId),
    enabled: !!coverageId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/**
 * Save the COB facts on one coverage.
 *
 * This is the COB half only. The payer, plan, member ID and dates are saved
 * through the existing patient-insurance endpoints — see the scope note on
 * `cobCoverageService.updateCoverageDetail`.
 */
export const useSaveCoverageDetail = (patientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ coverageId, payload }) =>
      cobCoverageService.updateCoverageDetail(coverageId, payload),
    onSuccess: (_data, { coverageId }) => {
      queryClient.invalidateQueries({ queryKey: cobKeys.coverageDetail(coverageId) });
      queryClient.invalidateQueries({ queryKey: cobKeys.orders() });
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: cobKeys.payerReports(patientId) });
      }
    },
  });
};

/* ── Insurance card images ──────────────────────────────────────────────── */

export const useCoverageCards = (coverageId, options = {}) =>
  useQuery({
    queryKey: cobKeys.coverageCards(coverageId),
    queryFn: () => cobCoverageService.getCoverageCards(coverageId),
    enabled: !!coverageId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/**
 * Upload one side of the card.
 *
 * Takes one side per call because the endpoint does — a combined upload keyed
 * on the coverage would let a re-shot front destroy the back.
 */
export const useUploadCoverageCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ coverageId, side, file }) =>
      cobCoverageService.uploadCoverageCard(coverageId, side, file),
    onSuccess: (_data, { coverageId }) => {
      queryClient.invalidateQueries({ queryKey: cobKeys.coverageCards(coverageId) });
    },
  });
};

export const useDeleteCoverageCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ coverageId, side }) =>
      cobCoverageService.deleteCoverageCard(coverageId, side),
    onSuccess: (_data, { coverageId }) => {
      queryClient.invalidateQueries({ queryKey: cobKeys.coverageCards(coverageId) });
    },
  });
};

export const useSecondaryEstimate = () =>
  useMutation({
    mutationFn: ({ coverageId, input }) =>
      cobCoverageService.estimateSecondary(coverageId, input),
  });

/* ── Coverage order ─────────────────────────────────────────────────────── */

/**
 * The order, the coverages and the submittable decision, in one query.
 *
 * `dateOfService` is passed to the endpoint so `submittable` is evaluated for
 * the right date — a claim screen must ask about its own date of service, not
 * today's.
 */
export const useCoverageOrder = (patientId, { dateOfService } = {}, options = {}) =>
  useQuery({
    queryKey: cobKeys.order(patientId, dateOfService),
    queryFn: () => cobOrderService.getCurrentOrder(patientId, { dateOfService }),
    enabled: !!patientId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/**
 * The order version in force on a past date. Separate endpoint, and separate
 * hook, because a claim for February must bill February's order even though
 * the patient has since added a plan.
 */
export const useCoverageOrderOnDate = (patientId, date, options = {}) =>
  useQuery({
    queryKey: cobKeys.orderOnDate(patientId, date),
    queryFn: () => cobOrderService.getOrderForDate(patientId, date),
    enabled: !!patientId && !!date,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const useCoverageOrderHistory = (patientId, options = {}) =>
  useQuery({
    queryKey: cobKeys.orderHistory(patientId),
    queryFn: () => cobOrderService.getOrderHistory(patientId),
    enabled: !!patientId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/**
 * One factory for every order-changing action: they all take the patient id,
 * all invalidate the same three keys, and differ only in the service call.
 * Generated rather than hand-written so a new action cannot forget to
 * invalidate the history.
 */
const makeOrderMutationHook = (callService) => (patientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) => callService(patientId, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cobKeys.orders() });
      queryClient.invalidateQueries({ queryKey: cobKeys.payerReports(patientId) });
    },
  });
};

export const useEvaluateOrder = makeOrderMutationHook((patientId, payload) =>
  cobOrderService.evaluateOrder(patientId, payload)
);

export const useOverrideOrder = makeOrderMutationHook((patientId, variables) =>
  cobOrderService.overrideOrder(patientId, variables)
);

export const useResolveFlag = makeOrderMutationHook((_patientId, { orderId, ...rest }) =>
  cobOrderService.resolveFlag(orderId, rest)
);

/**
 * Adopt the insurer's reported order.
 *
 * Two calls, in order, because the backend has no single endpoint for it and
 * deliberately so: adopting the payer's order IS an override (it overrules the
 * rules), and the flag still has to be closed with a note saying why. Doing it
 * as override-then-resolve means the audit trail shows both facts — the new
 * ranking and the reason it exists.
 */
export const useAcceptPayerOrder = (patientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, orderedCoverageIds, reason, resolutionNote }) => {
      const overridden = await cobOrderService.overrideOrder(patientId, {
        orderedCoverageIds,
        reason,
      });
      // The override writes a NEW version, so the flag has to be resolved on
      // the new order, not the one the banner was rendered from.
      const newOrderId = overridden?.order?.id ?? orderId;
      return cobOrderService.resolveFlag(newOrderId, {
        flag: 'PAYER_MISMATCH',
        resolutionNote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cobKeys.orders() });
      queryClient.invalidateQueries({ queryKey: cobKeys.payerReports(patientId) });
    },
  });
};

/* ── Payer-reported coverage ────────────────────────────────────────────── */

export const usePayerReports = (patientId, options = {}) =>
  useQuery({
    queryKey: cobKeys.payerReports(patientId),
    queryFn: () => cobVerificationService.getPayerReports(patientId),
    enabled: !!patientId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const useRecordPayerReport = makeOrderMutationHook((patientId, payload) =>
  cobVerificationService.recordPayerReport(patientId, payload)
);

/* ── Claims & balances ──────────────────────────────────────────────────── */

export const useInvoiceResponsibility = (invoiceId, options = {}) =>
  useQuery({
    queryKey: cobKeys.invoiceResponsibility(invoiceId),
    queryFn: () => cobBillingService.getInvoiceResponsibility(invoiceId),
    enabled: !!invoiceId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const useSecondaryClaimReadiness = (claimId, options = {}) =>
  useQuery({
    queryKey: cobKeys.secondaryReadiness(claimId),
    queryFn: () => cobBillingService.getSecondaryReadiness(claimId),
    enabled: !!claimId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

/**
 * Every downstream payer's expected payment on one claim.
 *
 * Feeds the balance table's `estimatesByParty` directly, so the table does no
 * arithmetic and cannot accidentally render a midpoint for an unconfirmed
 * plan. `byParty` comes back empty before the primary has remitted, which is
 * the normal early state rather than an error.
 */
export const useDownstreamEstimates = (claimId, options = {}) =>
  useQuery({
    queryKey: cobKeys.downstreamEstimates(claimId),
    queryFn: () => cobBillingService.getDownstreamEstimates(claimId),
    enabled: !!claimId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const usePrimaryPaymentDetail = (claimId, options = {}) =>
  useQuery({
    queryKey: cobKeys.primaryPayment(claimId),
    queryFn: () => cobBillingService.getPrimaryPaymentDetail(claimId),
    enabled: !!claimId,
    ...BASE_QUERY_OPTIONS,
    ...options,
  });

export const useGenerateSecondaryClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (primaryClaimId) => cobBillingService.generateSecondaryClaim(primaryClaimId),
    onSuccess: (_data, primaryClaimId) => {
      queryClient.invalidateQueries({ queryKey: cobKeys.secondaryReadiness(primaryClaimId) });
      queryClient.invalidateQueries({ queryKey: [...cobKeys.all, 'invoice-responsibility'] });
    },
  });
};
