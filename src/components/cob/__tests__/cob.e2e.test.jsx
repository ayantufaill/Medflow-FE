import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoverageOrderPanel from '../CoverageOrderPanel';
import ClaimResponsibilityPanel from '../balances/ClaimResponsibilityPanel';
import { renderWithQuery, carrierFixtures, grantAll } from './cobTestUtils';
import {
  cobOrderService,
  cobVerificationService,
  cobBillingService,
} from '../../../services/cob.service';
import { usePermissions } from '../../../hooks/usePermissions';

/**
 * End-to-end journeys, driven through the real components and hooks against a
 * stateful fake of the COB API.
 *
 * These are the three paths the feature exists for, and the ones that break
 * when a component changes in isolation: the fake re-evaluates and versions
 * between calls, so a test fails if the UI does not actually refetch after a
 * mutation.
 */

jest.mock('../../../config/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../../services/cob.service');
jest.mock('../../../hooks/usePermissions');
jest.mock('../../../contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

/**
 * Minimal stateful stand-in for the backend: holds the current order, the
 * version history and the payer reports, and recomputes `submittable` the way
 * `cobService.checkSubmittable` does.
 */
const makeFakeBackend = ({ coverages, order, reports = [] }) => {
  const state = { order, history: order ? [order] : [], reports };

  const BLOCKING_FLAGS = ['RANKING_CYCLE', 'PAYER_MISMATCH', 'COB_DENIAL'];
  const BLOCKING_STATUSES = ['NEEDS_INFO', 'NEEDS_REVIEW', 'DISPUTED'];

  /** Mirrors the backend's own blocking logic, including its wording. */
  const submittable = () => {
    const current = state.order;
    if (!current) return { allowed: true, reason: null, orderId: null, status: null };

    const openFlags = (current.flags || []).filter((f) => f.resolvedAt === null);
    const base = { orderId: current.id, status: current.status };

    if (current.status === 'NEEDS_INFO') {
      const fields = (current.missingFields || []).map((m) => `${m.coverageId}.${m.field}`).join(', ');
      return {
        ...base,
        allowed: false,
        reason: `The coverage order is incomplete: a coordination rule needs information we do not have (${fields}).`,
      };
    }

    const blocking = openFlags.filter((f) => BLOCKING_FLAGS.includes(f.flag));
    if (blocking.length) {
      return {
        ...base,
        allowed: false,
        reason: blocking.some((f) => f.flag === 'PAYER_MISMATCH')
          ? "A payer's records disagree with this coverage order and the PAYER_MISMATCH flag is unresolved."
          : `The coverage order has unresolved flags (${blocking.map((f) => f.flag).join(', ')}) and cannot be billed yet.`,
      };
    }

    if (BLOCKING_STATUSES.includes(current.status)) {
      return { ...base, allowed: false, reason: `The coverage order is ${current.status} and cannot be billed yet.` };
    }

    return { ...base, allowed: true, reason: null };
  };

  cobVerificationService.getPayerReports.mockImplementation(async () => ({ reports: state.reports }));
  cobOrderService.getCurrentOrder.mockImplementation(async () => ({
    order: state.order,
    coverages,
    submittable: submittable(),
  }));
  cobOrderService.getOrderHistory.mockImplementation(async () => ({
    // Newest first, as the endpoint returns it.
    orders: [...state.history].reverse(),
  }));

  /** Close the current version and push a new one. */
  const advance = (next) => {
    const previous = state.order;
    state.history = previous
      ? [...state.history.slice(0, -1), { ...previous, effectiveTo: '2026-10-07', isCurrent: false }, next]
      : [next];
    state.order = next;
    return next;
  };

  /**
   * Update the current version in place — which is what `resolveFlag` and the
   * verification writes do. They do NOT create a new version, and modelling
   * them as if they did would hide a duplicate-version bug in the history UI.
   */
  const patchCurrent = (changes) => {
    const next = { ...state.order, ...changes };
    state.history = [...state.history.slice(0, -1), next];
    state.order = next;
    return next;
  };

  return { state, advance, patchCurrent };
};

beforeEach(() => {
  jest.clearAllMocks();
  grantAll(usePermissions);
});

/* ────────────────────────────────────────────────────────────────────────── */

describe("Scenario 1 — a spouse's plan that does not coordinate becomes primary", () => {
  const coverages = [
    {
      id: 'cov-own',
      carrierName: 'Cigna',
      planName: 'Open Access Plus',
      relationship: 'SELF',
      benefitCategory: 'MEDICAL',
      coordinatesBenefits: true,
    },
    {
      id: 'cov-spouse',
      carrierName: 'Aetna',
      planName: 'Choice POS II',
      relationship: 'SPOUSE',
      benefitCategory: 'MEDICAL',
      coordinatesBenefits: false,
    },
  ];

  const suggested = {
    id: 'order-1',
    patientId: 'pat-1',
    version: 1,
    status: 'SUGGESTED',
    effectiveFrom: '2026-10-01',
    effectiveTo: null,
    isCurrent: true,
    verification: { status: 'UNVERIFIED', source: null, date: null },
    override: null,
    missingFields: [],
    triggerReason: 'COVERAGE_ADDED',
    flags: [],
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
        ruleCode: 'NO_COB_PROVISION',
        explanation: 'the patient’s own plan pays after a plan that does not coordinate',
      },
    ],
    excludedCoverages: [],
  };

  it("suggests the spouse's plan primary with a reason, and staff agree by overriding nothing", async () => {
    const fake = makeFakeBackend({ coverages, order: suggested });
    renderWithQuery(<CoverageOrderPanel patientId="pat-1" carriers={carrierFixtures} />);

    // The suggestion, with the reason spelled out in plain language.
    const list = await screen.findByTestId('cob-order-list');
    expect(within(list).getByTestId('cob-order-row-1')).toHaveTextContent('Primary: Aetna');
    expect(within(list).getByTestId('cob-order-reason-1')).toHaveTextContent(
      "husband's plan, because it doesn't coordinate with other insurance"
    );
    expect(screen.getByTestId('cob-status-SUGGESTED')).toBeInTheDocument();

    // A suggestion is billable: nothing is on hold.
    expect(screen.queryByTestId('cob-claim-blocked')).not.toBeInTheDocument();

    // And there is deliberately no "confirm" button, because the backend has
    // no endpoint that sets CONFIRMED.
    expect(screen.queryByTestId('cob-confirm-order')).not.toBeInTheDocument();

    expect(fake.state.order.status).toBe('SUGGESTED');
  });

  it('lets staff re-check the order on demand', async () => {
    const user = userEvent.setup();
    const fake = makeFakeBackend({ coverages, order: suggested });

    cobOrderService.evaluateOrder.mockImplementation(async () => ({
      order: fake.advance({ ...suggested, id: 'order-2', version: 2, triggerReason: 'MANUAL_EVALUATION' }),
    }));

    renderWithQuery(<CoverageOrderPanel patientId="pat-1" carriers={carrierFixtures} />);

    await screen.findByTestId('cob-order-list');
    await user.click(screen.getByTestId('cob-reevaluate'));

    await waitFor(() =>
      expect(cobOrderService.evaluateOrder).toHaveBeenCalledWith(
        'pat-1',
        expect.objectContaining({ triggerReason: 'MANUAL_EVALUATION' })
      )
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────── */

describe('Scenario 2 — birthday rule, then the insurer disagrees', () => {
  const coverages = [
    { id: 'cov-mum', carrierName: 'Cigna', planName: "mother's plan", relationship: 'PARENT', benefitCategory: 'MEDICAL' },
    { id: 'cov-dad', carrierName: 'Aetna', planName: "father's plan", relationship: 'PARENT', benefitCategory: 'MEDICAL' },
  ];

  const birthdayRuleOrder = {
    id: 'order-1',
    patientId: 'pat-1',
    version: 1,
    status: 'SUGGESTED',
    effectiveFrom: '2026-10-01',
    effectiveTo: null,
    isCurrent: true,
    verification: { status: 'UNVERIFIED', source: null, date: null },
    override: null,
    missingFields: [],
    triggerReason: 'COVERAGE_ADDED',
    flags: [],
    positions: [
      {
        position: 1,
        coverageId: 'cov-mum',
        ruleCode: 'BIRTHDAY_RULE',
        explanation: "mother's plan, because her birthday falls earlier in the year",
      },
      {
        position: 2,
        coverageId: 'cov-dad',
        ruleCode: 'BIRTHDAY_RULE',
        explanation: "father's plan, because his birthday falls later in the year",
      },
    ],
    excludedCoverages: [],
  };

  /** Aetna names a position for itself AND for Cigna — adoptable in full. */
  const payerReport = {
    id: 'report-1',
    source: 'PHONE',
    reportingCarrierName: 'Aetna',
    reportedDate: '2026-10-06',
    note: 'Ref CALL-8810',
    coverageId: 'cov-dad',
    reportedSelfOrder: 1,
    otherPayerCoverageId: 'cov-mum',
    otherPayerName: 'Cigna',
    otherPayerReportedOrder: 2,
  };

  it("records what the insurer said, flags the mismatch, and adopts the insurer's order", async () => {
    const user = userEvent.setup();
    const fake = makeFakeBackend({ coverages, order: birthdayRuleOrder });

    // Recording the payer's statement raises PAYER_MISMATCH.
    cobVerificationService.recordPayerReport.mockImplementation(async () => {
      fake.state.reports = [payerReport];
      fake.advance({
        ...birthdayRuleOrder,
        id: 'order-2',
        version: 2,
        status: 'DISPUTED',
        triggerReason: 'PAYER_REPORTED_COVERAGE',
        flags: [
          {
            id: 'flag-1',
            flag: 'PAYER_MISMATCH',
            raisedAt: '2026-10-08',
            resolvedAt: null,
            resolvedBy: null,
            resolutionNote: null,
            detail: { report: payerReport },
          },
        ],
      });
      return { report: payerReport };
    });

    // Adopting the insurer's order is override-then-resolve.
    cobOrderService.overrideOrder.mockImplementation(async (_patientId, { orderedCoverageIds, reason }) => ({
      order: fake.advance({
        id: 'order-3',
        patientId: 'pat-1',
        version: 3,
        status: 'STAFF_OVERRIDE',
        effectiveFrom: '2026-10-08',
        effectiveTo: null,
        isCurrent: true,
        verification: { status: 'VERIFIED_WITH_PAYER', source: 'PHONE', date: '2026-10-06' },
        override: { userNum: '1', reason, at: '2026-10-08T00:00:00.000Z' },
        missingFields: [],
        triggerReason: 'STAFF_OVERRIDE',
        // The flag is still open until resolve-flag closes it.
        flags: [
          {
            id: 'flag-1',
            flag: 'PAYER_MISMATCH',
            raisedAt: '2026-10-08',
            resolvedAt: null,
            resolvedBy: null,
            resolutionNote: null,
            detail: { report: payerReport },
          },
        ],
        positions: orderedCoverageIds.map((coverageId, index) => ({
          position: index + 1,
          coverageId,
          ruleCode: 'STAFF_OVERRIDE',
          explanation:
            coverageId === 'cov-dad'
              ? 'Aetna reported on 6 Oct 2026 that they pay first'
              : 'Aetna reported that Cigna pays second',
        })),
        excludedCoverages: [],
      }),
    }));

    cobOrderService.resolveFlag.mockImplementation(async (_orderId, { resolutionNote }) => ({
      order: fake.patchCurrent({
        flags: (fake.state.order.flags || []).map((f) => ({
          ...f,
          resolvedAt: '2026-10-08',
          resolutionNote,
        })),
      }),
    }));

    renderWithQuery(<CoverageOrderPanel patientId="pat-1" carriers={carrierFixtures} />);

    /* 1. The birthday-rule suggestion, with its reason. */
    expect(await screen.findByTestId('cob-order-reason-1')).toHaveTextContent(
      /her birthday falls earlier in the year/i
    );

    /* 2. Staff record what Aetna said on the phone. */
    await user.click(screen.getByTestId('cob-open-record-payer'));

    await user.click(screen.getByLabelText('Which payer did you speak to?'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Aetna'));

    await user.click(screen.getByLabelText('Where did they say they pay?'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Primary'));

    await user.type(screen.getByLabelText('Call or transaction reference'), 'CALL-8810');
    await user.click(screen.getByTestId('cob-record-payer-submit'));

    await waitFor(() =>
      expect(cobVerificationService.recordPayerReport).toHaveBeenCalledWith(
        'pat-1',
        expect.objectContaining({
          reportingCarrierId: 'carrier-aetna',
          reportedSelfOrder: 1,
          source: 'PHONE',
          // The endpoint has no reference field, so it rides in the note.
          note: expect.stringContaining('CALL-8810'),
        })
      )
    );

    /* 3. The mismatch is flagged, side by side, and claims are blocked. */
    const comparison = await screen.findByTestId('cob-mismatch-comparison');
    expect(within(comparison).getByTestId('cob-mismatch-ours')).toHaveTextContent(
      "Primary: Cigna — mother's plan"
    );
    expect(within(comparison).getByTestId('cob-mismatch-theirs')).toHaveTextContent(
      "Primary: Aetna — father's plan"
    );
    expect(screen.getByTestId('cob-claim-blocked')).toHaveTextContent(/PAYER_MISMATCH/);

    /* 4. Staff adopt the insurer's order. */
    await user.click(screen.getByTestId('cob-flag-action-PAYER_MISMATCH'));
    await user.type(
      screen.getByTestId('cob-mismatch-panel-accept').querySelector('textarea'),
      'Aetna confirmed on the phone that they pay first.'
    );
    await user.click(screen.getByTestId('cob-mismatch-accept-submit'));

    await waitFor(() =>
      expect(cobOrderService.overrideOrder).toHaveBeenCalledWith('pat-1', {
        orderedCoverageIds: ['cov-dad', 'cov-mum'],
        reason: 'Aetna confirmed on the phone that they pay first.',
      })
    );
    await waitFor(() => expect(cobOrderService.resolveFlag).toHaveBeenCalled());

    /* 5. The order is re-ranked, unblocked and payer-verified. */
    await waitFor(() =>
      expect(screen.getByTestId('cob-order-reason-1')).toHaveTextContent(
        /Aetna reported on 6 Oct 2026 that they pay first/i
      )
    );
    expect(screen.queryByTestId('cob-claim-blocked')).not.toBeInTheDocument();
    expect(screen.getByTestId('cob-status-VERIFIED_WITH_PAYER')).toBeInTheDocument();

    /* 6. The history carries every version. */
    await user.click(screen.getByTestId('cob-open-history'));

    const historyList = await screen.findByTestId('cob-order-history-list');
    expect(within(historyList).getByTestId('cob-order-history-version-1')).toHaveTextContent(
      /her birthday falls earlier/i
    );
    expect(within(historyList).getByTestId('cob-order-history-version-2')).toHaveTextContent(
      'Disputed'
    );
    expect(within(historyList).getByTestId('cob-order-history-version-3')).toHaveTextContent(
      /Aetna reported on 6 Oct 2026/i
    );
    // The override's reason and the flag resolution are both on the record.
    expect(within(historyList).getByTestId('cob-order-history-override-3')).toHaveTextContent(
      /Aetna confirmed on the phone/i
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────── */

describe('Scenario 3 — a secondary claim denied over the coverage order', () => {
  const coverages = [
    { id: 'cov-a', carrierName: 'Cigna', planName: 'Open Access Plus', relationship: 'SELF', benefitCategory: 'MEDICAL' },
    { id: 'cov-b', carrierName: 'Aetna', planName: 'Choice POS II', relationship: 'SPOUSE', benefitCategory: 'MEDICAL' },
  ];

  const denialFlag = {
    id: 'flag-denial',
    flag: 'COB_DENIAL',
    raisedAt: '2026-09-25',
    resolvedAt: null,
    resolvedBy: null,
    resolutionNote: null,
    detail: {
      claimId: 'claim-900',
      claimNumber: 'CLM-00900',
      carrierName: 'Aetna',
      deniedAt: '2026-09-24',
      groupCode: 'CO',
      reasonCode: '22',
      denialReason: 'This care may be covered by another payer per coordination of benefits.',
    },
  };

  const deniedOrder = {
    id: 'order-5',
    patientId: 'pat-1',
    version: 4,
    status: 'NEEDS_REVIEW',
    effectiveFrom: '2026-09-01',
    effectiveTo: null,
    isCurrent: true,
    verification: { status: 'UNVERIFIED', source: null, date: null },
    override: null,
    missingFields: [],
    triggerReason: 'COB_DENIAL_DETECTED',
    positions: [
      { position: 1, coverageId: 'cov-a', ruleCode: 'SUBSCRIBER_FIRST', explanation: 'the patient’s own plan' },
      { position: 2, coverageId: 'cov-b', ruleCode: 'SUBSCRIBER_FIRST', explanation: 'the spouse’s plan pays second' },
    ],
    excludedCoverages: [],
    flags: [denialFlag],
  };

  it('shows the denial, the reason, and the re-verify then clear flow', async () => {
    const user = userEvent.setup();
    const fake = makeFakeBackend({ coverages, order: deniedOrder });

    cobVerificationService.recordPayerReport.mockImplementation(async () => ({ report: { id: 'r1' } }));

    // Closing the last blocking flag lifts NEEDS_REVIEW back to SUGGESTED —
    // the backend does both in this one call, in place.
    cobOrderService.resolveFlag.mockImplementation(async (_orderId, { resolutionNote }) => ({
      order: fake.patchCurrent({
        status: 'SUGGESTED',
        verification: { status: 'VERIFIED_WITH_PAYER', source: 'PHONE', date: '2026-10-08' },
        flags: [{ ...denialFlag, resolvedAt: '2026-10-08', resolutionNote }],
      }),
    }));

    const onOpenClaim = jest.fn();
    renderWithQuery(
      <CoverageOrderPanel patientId="pat-1" carriers={carrierFixtures} onOpenClaim={onOpenClaim} />
    );

    /* The banner shows the claim, the payer's reason code and its words. */
    const banner = await screen.findByTestId('cob-flag-COB_DENIAL');
    expect(banner).toHaveTextContent(/a claim was denied over the insurance order/i);
    const detail = within(banner).getByTestId('cob-denial-detail');
    expect(detail).toHaveTextContent('CLM-00900');
    expect(detail).toHaveTextContent('CO / 22');
    expect(detail).toHaveTextContent(/may be covered by another payer/i);

    /* Claims stay on hold: COB_DENIAL is a blocking flag. */
    expect(screen.getByTestId('cob-claim-blocked')).toHaveTextContent(/COB_DENIAL/);

    /* Opening the denied claim is available as a secondary action. */
    await user.click(within(banner).getByTestId('cob-denial-open-claim'));
    expect(onOpenClaim).toHaveBeenCalledWith('claim-900');

    /* Re-verify opens the "record what the insurer said" form. */
    await user.click(within(banner).getByTestId('cob-flag-action-COB_DENIAL'));

    await user.click(screen.getByLabelText('Which payer did you speak to?'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Aetna'));
    await user.type(screen.getByLabelText('Call or transaction reference'), 'CALL-9001');
    await user.click(screen.getByTestId('cob-record-payer-submit'));

    await waitFor(() =>
      expect(cobVerificationService.recordPayerReport).toHaveBeenCalledWith(
        'pat-1',
        expect.objectContaining({ source: 'PHONE', note: expect.stringContaining('CALL-9001') })
      )
    );

    /* Then the flag itself is cleared, with what the payer said. */
    await user.click(within(await screen.findByTestId('cob-flag-COB_DENIAL')).getByTestId('cob-denial-resolve'));
    await user.type(
      screen.getByTestId('cob-resolve-flag-note').querySelector('textarea'),
      'Aetna confirmed they are secondary; denial was their error.'
    );
    await user.click(screen.getByTestId('cob-resolve-flag-submit'));

    await waitFor(() =>
      expect(cobOrderService.resolveFlag).toHaveBeenCalledWith('order-5', {
        flag: 'COB_DENIAL',
        resolutionNote: 'Aetna confirmed they are secondary; denial was their error.',
      })
    );

    /* The denial clears, billing unblocks, and the order reads verified. */
    await waitFor(() => expect(screen.queryByTestId('cob-flag-COB_DENIAL')).not.toBeInTheDocument());
    expect(screen.getByTestId('cob-status-VERIFIED_WITH_PAYER')).toBeInTheDocument();
    expect(screen.queryByTestId('cob-claim-blocked')).not.toBeInTheDocument();
  });

  it('keeps the secondary claim locked until the primary remittance is posted', async () => {
    cobBillingService.getInvoiceResponsibility.mockResolvedValue({
      statementId: 'inv-9',
      byParty: [
        { responsibleParty: 'PRIMARY', charges: 500, payments: 0, contractualAdjustments: 0, balance: 500 },
      ],
      contractualAdjustmentsTotal: 0,
      contractualAdjustmentsAreBillableToPatient: false,
    });
    cobBillingService.getSecondaryReadiness.mockResolvedValue({
      posted: false,
      reason: 'The primary claim 900 has no posted remittance yet (status S, no received date).',
    });

    renderWithQuery(
      <ClaimResponsibilityPanel
        claimId="claim-900"
        invoiceId="inv-9"
        estimatesByParty={{ PRIMARY: { low: 0, high: 500 } }}
      />
    );

    const button = await screen.findByTestId('cob-create-secondary-claim');
    await waitFor(() => expect(button).toBeDisabled());
    expect(screen.getByTestId('cob-secondary-blocked-reason')).toHaveTextContent(
      /no posted remittance yet/i
    );
    // And the primary's figure is an estimate, shown as a range.
    expect(screen.getByTestId('cob-estimate-badge-PRIMARY')).toBeInTheDocument();
    expect(screen.getByTestId('cob-balance-paid-PRIMARY')).toHaveTextContent('$0.00 – $500.00');
  });
});
