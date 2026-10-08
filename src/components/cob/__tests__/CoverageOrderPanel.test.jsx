import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoverageOrderPanel from '../CoverageOrderPanel';
import {
  renderWithQuery,
  makeOrder,
  makeOrderPayload,
  makeFlag,
  blocked,
  carrierFixtures,
  grantPermissions,
} from './cobTestUtils';
import { cobOrderService, cobVerificationService } from '../../../services/cob.service';
import { COB_PERMISSIONS } from '../../../constants/cobConstants';
import { usePermissions } from '../../../hooks/usePermissions';

/**
 * The patient-facing coverage order panel: reasons, flags, blocking, the
 * fixed-benefit section, and the override gate.
 */

// config/api reads import.meta.env, which Babel cannot transform for the
// CommonJS test run, so it is replaced wholesale — the same approach the
// existing waitlist suites take.
jest.mock('../../../config/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

jest.mock('../../../services/cob.service');
jest.mock('../../../hooks/usePermissions');

jest.mock('../../../contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

/** Read is the baseline every non-permission test needs. */
const grant = (...permissions) =>
  grantPermissions(usePermissions, COB_PERMISSIONS.ORDER_READ, ...permissions);

const setup = (payload = makeOrderPayload(), props = {}) => {
  cobOrderService.getCurrentOrder.mockResolvedValue(payload);
  cobVerificationService.getPayerReports.mockResolvedValue({ reports: [] });

  return renderWithQuery(
    <CoverageOrderPanel patientId="pat-1" carriers={carrierFixtures} {...props} />
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  grant();
});

describe('CoverageOrderPanel — states', () => {
  it('shows a loading state while the order is worked out', async () => {
    cobOrderService.getCurrentOrder.mockReturnValue(new Promise(() => {}));
    cobVerificationService.getPayerReports.mockResolvedValue({ reports: [] });

    renderWithQuery(<CoverageOrderPanel patientId="pat-1" />);

    expect(screen.getByTestId('cob-order-loading')).toBeInTheDocument();
  });

  it('shows a retryable error when the order cannot be loaded', async () => {
    cobOrderService.getCurrentOrder.mockRejectedValue(new Error('boom'));
    cobVerificationService.getPayerReports.mockResolvedValue({ reports: [] });

    renderWithQuery(<CoverageOrderPanel patientId="pat-1" />);

    expect(await screen.findByTestId('cob-order-error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('offers to add insurance when the patient has none', async () => {
    setup(makeOrderPayload({ order: null, coverages: [] }));

    expect(await screen.findByTestId('cob-order-empty')).toBeInTheDocument();
    expect(screen.getByText(/no insurance recorded/i)).toBeInTheDocument();
  });

  it('offers to work out the order when coverages exist but nothing is ranked', async () => {
    // A patient added before COB existed: the endpoint returns coverages but
    // no order. Offering "add insurance" here would be wrong and confusing.
    setup(makeOrderPayload({ order: null }));

    expect(await screen.findByTestId('cob-order-not-evaluated')).toBeInTheDocument();
    expect(screen.getByTestId('cob-evaluate-now')).toBeInTheDocument();
  });

  it('refuses to show anything without insurance.coverage_order.read', async () => {
    grantPermissions(usePermissions);
    setup();

    expect(await screen.findByTestId('cob-order-no-permission')).toBeInTheDocument();
    expect(cobOrderService.getCurrentOrder).not.toHaveBeenCalled();
  });
});

describe('CoverageOrderPanel — the order', () => {
  it('never shows a position without its reason', async () => {
    setup();

    const list = await screen.findByTestId('cob-order-list');
    expect(within(list).getByTestId('cob-order-row-1')).toHaveTextContent('Primary: Aetna');
    expect(within(list).getByTestId('cob-order-reason-1')).toHaveTextContent(
      /doesn't coordinate with other insurance/i
    );
    expect(within(list).getByTestId('cob-order-row-2')).toHaveTextContent('Secondary: Cigna');
    expect(within(list).getByTestId('cob-order-reason-2')).not.toBeEmptyDOMElement();
  });

  it('says so loudly when the backend sent a position with no reason', async () => {
    setup(
      makeOrderPayload({
        order: makeOrder({
          positions: [{ position: 1, coverageId: 'cov-own', explanation: '' }],
          excludedCoverages: [],
        }),
      })
    );

    expect(await screen.findByTestId('cob-order-reason-1')).toHaveTextContent(
      /no reason was recorded/i
    );
  });

  it('puts fixed-benefit policies in their own section, not in the order', async () => {
    setup();

    const excluded = await screen.findByTestId('cob-excluded-section');
    expect(excluded).toHaveTextContent('Not part of claim order');
    expect(within(excluded).getByTestId('cob-excluded-row-cov-indemnity')).toHaveTextContent(
      'Colonial Life'
    );

    // And it must NOT be one of the ranked rows.
    const list = screen.getByTestId('cob-order-list');
    expect(within(list).queryByText(/Colonial Life/)).not.toBeInTheDocument();
  });

  it('shows the status badges, including payer verification alongside the status', async () => {
    setup(
      makeOrderPayload({
        order: makeOrder({
          status: 'CONFIRMED',
          verification: { status: 'VERIFIED_WITH_PAYER', source: 'PHONE', date: '2026-10-02' },
        }),
      })
    );

    expect(await screen.findByTestId('cob-status-CONFIRMED')).toBeInTheDocument();
    expect(screen.getByTestId('cob-status-VERIFIED_WITH_PAYER')).toBeInTheDocument();
  });

  it('warns when the order shown is the one effective on a past date of service', async () => {
    setup(
      makeOrderPayload({
        order: makeOrder({ isCurrent: false, effectiveTo: '2026-03-31', version: 1 }),
      }),
      { dateOfService: '2026-03-15' }
    );

    expect(await screen.findByTestId('cob-historical-order')).toHaveTextContent(
      /not the order in force today/i
    );
  });
});

describe('CoverageOrderPanel — claim blocking', () => {
  it("shows the server's own blocking sentence, verbatim", async () => {
    // The panel must say exactly what an attempted submit would say, so the
    // sentence is taken from `submittable`, not composed here.
    const order = makeOrder({
      status: 'NEEDS_INFO',
      missingFields: [{ coverageId: 'cov-spouse', field: 'subscriberBirthdate' }],
    });
    const reason =
      'The coverage order for 2026-10-08 is incomplete: a coordination rule needs ' +
      'information we do not have (cov-spouse.subscriberBirthdate). Fill that in and re-evaluate.';

    setup(makeOrderPayload({ order, submittable: blocked(reason, order) }));

    const notice = await screen.findByTestId('cob-claim-blocked');
    expect(notice).toHaveTextContent(/claims are on hold/i);
    expect(notice).toHaveTextContent(reason);
  });

  it('says claims are on hold while a payer mismatch is unresolved', async () => {
    const order = makeOrder({ status: 'DISPUTED', flags: [makeFlag('PAYER_MISMATCH')] });
    const reason =
      "A payer's records disagree with this coverage order and the PAYER_MISMATCH flag is " +
      'unresolved. Resolve the flag once you have confirmed the order with the payer.';

    setup(makeOrderPayload({ order, submittable: blocked(reason, order) }));

    expect(await screen.findByTestId('cob-claim-blocked')).toHaveTextContent(reason);
  });

  it('shows no blocking notice when the server allows submission', async () => {
    setup(makeOrderPayload({ order: makeOrder({ status: 'CONFIRMED' }) }));

    await screen.findByTestId('cob-order-list');
    expect(screen.queryByTestId('cob-claim-blocked')).not.toBeInTheDocument();
  });
});

describe('CoverageOrderPanel — flags', () => {
  it('NEEDS_INFO lists every missing field and jumps the form to it', async () => {
    const user = userEvent.setup();
    const onEditCoverage = jest.fn();

    setup(
      makeOrderPayload({
        order: makeOrder({
          status: 'NEEDS_INFO',
          missingFields: [
            { coverageId: 'cov-spouse', field: 'subscriberBirthdate' },
            { coverageId: 'cov-own', field: 'employerSizeBand' },
          ],
        }),
      }),
      { onEditCoverage }
    );

    const banner = await screen.findByTestId('cob-flag-NEEDS_INFO');
    expect(within(banner).getByTestId('cob-missing-field-subscriberBirthdate')).toHaveTextContent(
      "Policyholder's date of birth"
    );
    expect(within(banner).getByTestId('cob-missing-field-employerSizeBand')).toBeInTheDocument();

    await user.click(within(banner).getByTestId('cob-missing-field-subscriberBirthdate'));

    expect(onEditCoverage).toHaveBeenCalledWith({
      field: 'subscriberBirthdate',
      coverageId: 'cov-spouse',
      section: 'policyholder',
    });
  });

  it('NEITHER_PLAN_COORDINATES warns about double payment and resolves with a note', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.FLAG_RESOLVE);
    cobOrderService.resolveFlag.mockResolvedValue({});

    setup(makeOrderPayload({ order: makeOrder({ flags: [makeFlag('NEITHER_PLAN_COORDINATES')] }) }));

    const banner = await screen.findByTestId('cob-flag-NEITHER_PLAN_COORDINATES');
    expect(banner).toHaveTextContent(/both plans may pay in full/i);

    await user.click(within(banner).getByTestId('cob-flag-action-NEITHER_PLAN_COORDINATES'));

    // Every resolution needs a note — the endpoint requires one.
    const submit = await screen.findByTestId('cob-resolve-flag-submit');
    expect(submit).toBeDisabled();

    await user.type(
      screen.getByTestId('cob-resolve-flag-note').querySelector('textarea'),
      'Called both payers; Aetna pays first.'
    );
    await user.click(submit);

    await waitFor(() =>
      expect(cobOrderService.resolveFlag).toHaveBeenCalledWith('order-1', {
        flag: 'NEITHER_PLAN_COORDINATES',
        resolutionNote: 'Called both payers; Aetna pays first.',
      })
    );
  });

  it('disables the NEITHER_PLAN_COORDINATES action without the resolve permission', async () => {
    setup(makeOrderPayload({ order: makeOrder({ flags: [makeFlag('NEITHER_PLAN_COORDINATES')] }) }));

    const banner = await screen.findByTestId('cob-flag-NEITHER_PLAN_COORDINATES');
    expect(within(banner).getByTestId('cob-flag-action-NEITHER_PLAN_COORDINATES')).toBeDisabled();
    expect(banner).toHaveTextContent(/ask a biller/i);
  });

  it('RANKING_CYCLE opens the override for a user who may reorder', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.ORDER_OVERRIDE);

    setup(makeOrderPayload({ order: makeOrder({ flags: [makeFlag('RANKING_CYCLE')] }) }));

    const banner = await screen.findByTestId('cob-flag-RANKING_CYCLE');
    await user.click(within(banner).getByTestId('cob-flag-action-RANKING_CYCLE'));

    expect(await screen.findByTestId('cob-override-reason')).toBeInTheDocument();
  });

  it('RANKING_CYCLE disables its action and explains who to ask without the permission', async () => {
    setup(makeOrderPayload({ order: makeOrder({ flags: [makeFlag('RANKING_CYCLE')] }) }));

    const banner = await screen.findByTestId('cob-flag-RANKING_CYCLE');
    expect(within(banner).getByTestId('cob-flag-action-RANKING_CYCLE')).toBeDisabled();
    expect(banner).toHaveTextContent(/ask a billing administrator/i);
  });

  it('COB_DENIAL shows the denied claim and its reason, and starts a re-verification', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PAYER_REPORTED_WRITE);

    setup(
      makeOrderPayload({
        order: makeOrder({
          flags: [
            makeFlag('COB_DENIAL', {
              detail: {
                claimId: 'claim-77',
                claimNumber: 'CLM-00077',
                carrierName: 'Aetna',
                deniedAt: '2026-09-20',
                groupCode: 'CO',
                reasonCode: '22',
                denialReason:
                  'This care may be covered by another payer per coordination of benefits.',
              },
            }),
          ],
        }),
      })
    );

    const banner = await screen.findByTestId('cob-flag-COB_DENIAL');
    const detail = within(banner).getByTestId('cob-denial-detail');
    expect(detail).toHaveTextContent('CLM-00077');
    expect(detail).toHaveTextContent('CO / 22');
    expect(detail).toHaveTextContent(/may be covered by another payer/i);

    await user.click(within(banner).getByTestId('cob-flag-action-COB_DENIAL'));

    // Re-verify opens the "record what the insurer said" form.
    expect(await screen.findByTestId('cob-record-payer-submit')).toBeInTheDocument();
  });

  it('COVERAGE_CHANGED asks for a review and resolves it with a note', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.FLAG_RESOLVE);
    cobOrderService.resolveFlag.mockResolvedValue({});

    setup(
      makeOrderPayload({
        order: makeOrder({
          flags: [makeFlag('COVERAGE_CHANGED', { detail: { changedFields: ['Member ID'] } })],
        }),
      })
    );

    const banner = await screen.findByTestId('cob-flag-COVERAGE_CHANGED');
    expect(banner).toHaveTextContent(/insurance details changed/i);
    expect(within(banner).getByTestId('cob-coverage-changed-detail')).toHaveTextContent('Member ID');

    await user.click(within(banner).getByTestId('cob-flag-action-COVERAGE_CHANGED'));
    await user.type(
      screen.getByTestId('cob-resolve-flag-note').querySelector('textarea'),
      'Member ID corrected; order unchanged.'
    );
    await user.click(screen.getByTestId('cob-resolve-flag-submit'));

    await waitFor(() =>
      expect(cobOrderService.resolveFlag).toHaveBeenCalledWith('order-1', {
        flag: 'COVERAGE_CHANGED',
        resolutionNote: 'Member ID corrected; order unchanged.',
      })
    );
  });
});

describe('CoverageOrderPanel — override permission', () => {
  it('hides the override action without insurance.coverage_order.override', async () => {
    setup();

    await screen.findByTestId('cob-order-list');
    expect(screen.queryByTestId('cob-open-override')).not.toBeInTheDocument();
  });

  it('shows the override action with the permission', async () => {
    grant(COB_PERMISSIONS.ORDER_OVERRIDE);
    setup();

    expect(await screen.findByTestId('cob-open-override')).toBeInTheDocument();
  });

  it('hides "record what the insurer said" without insurance.payer_reported.write', async () => {
    setup();

    await screen.findByTestId('cob-order-list');
    expect(screen.queryByTestId('cob-open-record-payer')).not.toBeInTheDocument();
  });

  it('shows it with the permission', async () => {
    grant(COB_PERMISSIONS.PAYER_REPORTED_WRITE);
    setup();

    expect(await screen.findByTestId('cob-open-record-payer')).toBeInTheDocument();
  });

  it('never offers a "confirm" action — the backend has no endpoint for it', async () => {
    // CONFIRMED is in the status enum but no service sets it, so a confirm
    // button would be a button that lies.
    setup();

    await screen.findByTestId('cob-order-list');
    expect(screen.queryByTestId('cob-confirm-order')).not.toBeInTheDocument();
  });
});
