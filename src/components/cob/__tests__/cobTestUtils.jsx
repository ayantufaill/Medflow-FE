import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

/**
 * Shared harness for the COB component tests.
 *
 * Every component here talks to the backend through react-query, so the tests
 * wrap in a real QueryClient and mock only `services/cob.service`. That keeps
 * the hooks, the query keys and the invalidation wiring inside the test
 * instead of being stubbed out — which is the half most likely to break.
 *
 * The fixtures below mirror the REAL payloads from
 * `Medflow-BE/src/controllers/cob.controller.ts`:
 *   • `GET /cob/patients/:id/coverage-order` -> { order, coverages, submittable }
 *   • orders carry `excludedCoverages` apart from `positions`, and
 *     `verification: { status, source, date }` apart from `status`
 *   • `submittable` is the server's own blocking decision and sentence
 */

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      // No retries: a rejected mock should surface as an error state on the
      // first tick, not three seconds later.
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

export const renderWithQuery = (ui, { queryClient = createTestQueryClient() } = {}) => {
  const result = render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  return { ...result, queryClient };
};

/* ── Fixtures ───────────────────────────────────────────────────────────── */

/**
 * The `coverages` array as `cobService.listCoverages` returns it: rule-engine
 * `CoverageFacts` plus `activeOnDate`. Note `id`, not `coverageId`.
 */
export const coverageFixtures = [
  {
    id: 'cov-own',
    planId: 'plan-cigna-oap',
    carrierId: 'carrier-cigna',
    carrierName: 'Cigna',
    planName: 'Open Access Plus',
    memberId: 'C-1001',
    relationship: 'SELF',
    payerType: 'COMMERCIAL',
    benefitCategory: 'MEDICAL',
    coordinatesBenefits: true,
    coverageBasis: 'EMPLOYER_GROUP',
    activeOnDate: true,
  },
  {
    id: 'cov-spouse',
    planId: 'plan-aetna-pos',
    carrierId: 'carrier-aetna',
    carrierName: 'Aetna',
    planName: 'Choice POS II',
    memberId: 'A-2002',
    relationship: 'SPOUSE',
    payerType: 'COMMERCIAL',
    benefitCategory: 'MEDICAL',
    coordinatesBenefits: false,
    coverageBasis: 'EMPLOYER_GROUP',
    activeOnDate: true,
  },
  {
    id: 'cov-indemnity',
    planId: 'plan-indemnity',
    carrierId: 'carrier-cigna',
    carrierName: 'Colonial Life',
    planName: 'Hospital Indemnity',
    memberId: 'CL-3003',
    relationship: 'SELF',
    payerType: 'COMMERCIAL',
    benefitCategory: 'FIXED_INDEMNITY',
    coordinatesBenefits: false,
    activeOnDate: true,
  },
];

/** A `ShapedOrder` — the shape `cobService.shapeOrder` produces. */
export const makeOrder = (overrides = {}) => ({
  id: 'order-1',
  patientId: 'pat-1',
  version: 2,
  status: 'SUGGESTED',
  effectiveFrom: '2026-01-01',
  effectiveTo: null,
  isCurrent: true,
  verification: { status: 'UNVERIFIED', source: null, date: null },
  override: null,
  missingFields: [],
  triggerReason: 'COVERAGE_ADDED',
  positions: [
    {
      position: 1,
      coverageId: 'cov-spouse',
      ruleCode: 'NO_COB_PROVISION',
      explanation: "husband's plan, because it doesn't coordinate with other insurance",
    },
    {
      position: 2,
      coverageId: 'cov-own',
      ruleCode: 'SUBSCRIBER_OVER_DEPENDENT',
      explanation: "the patient's own plan pays after a plan that doesn't coordinate",
    },
  ],
  excludedCoverages: [
    {
      coverageId: 'cov-indemnity',
      ruleCode: 'FIXED_INDEMNITY_EXCLUDED',
      explanation: 'Pays the patient directly, so it is not billed as part of the claim order.',
    },
  ],
  flags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  createdBy: null,
  ...overrides,
});

/** The envelope the endpoint actually returns. */
export const makeOrderPayload = ({ order = makeOrder(), coverages = coverageFixtures, submittable } = {}) => ({
  order,
  coverages,
  submittable: submittable ?? { allowed: true, reason: null, orderId: order?.id ?? null, status: order?.status ?? null },
});

/** A blocked `submittable`, with the server's own sentence. */
export const blocked = (reason, order) => ({
  allowed: false,
  reason,
  orderId: order?.id ?? 'order-1',
  status: order?.status ?? 'NEEDS_REVIEW',
});

export const makeFlag = (flag, overrides = {}) => ({
  id: `flag-${flag}`,
  flag,
  detail: {},
  raisedAt: '2026-10-01T00:00:00.000Z',
  resolvedAt: null,
  resolvedBy: null,
  resolutionNote: null,
  ...overrides,
});

export const carrierFixtures = [
  { id: 'carrier-cigna', name: 'Cigna', payerType: 'COMMERCIAL' },
  { id: 'carrier-aetna', name: 'Aetna', payerType: 'COMMERCIAL' },
  { id: 'carrier-medicare', name: 'Medicare Part B', payerType: 'MEDICARE' },
];

export const planFixtures = [
  { id: 'plan-cigna-oap', carrierId: 'carrier-cigna', name: 'Open Access Plus', benefitCategory: 'MEDICAL' },
  { id: 'plan-aetna-pos', carrierId: 'carrier-aetna', name: 'Choice POS II', benefitCategory: 'MEDICAL' },
  {
    id: 'plan-indemnity',
    carrierId: 'carrier-cigna',
    name: 'Hospital Cash Plan',
    benefitCategory: 'FIXED_INDEMNITY',
  },
  { id: 'plan-medicare-b', carrierId: 'carrier-medicare', name: 'Medicare Part B', benefitCategory: 'MEDICAL' },
];

/** Grants exactly the listed permission keys and nothing else. */
export const grantPermissions = (usePermissions, ...permissions) => {
  const set = new Set(permissions);
  usePermissions.mockReturnValue({
    has: (permission) => set.has(permission),
    hasAny: (list = []) => list.some((p) => set.has(p)),
    hasAll: (list = []) => list.every((p) => set.has(p)),
    permissions: set,
    roles: [],
    isPlatformAdmin: false,
  });
};

/** Grants everything — for tests that are not about permissions. */
export const grantAll = (usePermissions) => {
  usePermissions.mockReturnValue({
    has: () => true,
    hasAny: () => true,
    hasAll: () => true,
    permissions: new Set(),
    roles: [],
    isPlatformAdmin: true,
  });
};
