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
  grantAll,
  grantPermissions,
} from './cobTestUtils';
import { cobOrderService, cobVerificationService } from '../../../services/cob.service';
import { usePermissions } from '../../../hooks/usePermissions';
import { COB_PERMISSIONS } from '../../../constants/cobConstants';

/**
 * PAYER_MISMATCH is the flag that embodies the feature's principle: our system
 * suggests, the insurer decides, and a human settles the disagreement.
 *
 * The backend offers two primitives — `override` and `resolve-flag` — so these
 * tests pin which primitive(s) each of the three resolutions uses, and that an
 * incomplete payer report cannot be applied wholesale.
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

/** A report that places BOTH of our coverages — the adoptable case. */
const FULL_REPORT = {
  id: 'report-9',
  source: 'PHONE',
  reportingCarrierName: 'Aetna',
  reportedDate: '2026-10-02',
  note: 'Ref CALL-5512 — Aetna say they are primary.',
  coverageId: 'cov-own',
  reportedSelfOrder: 1,
  otherPayerCoverageId: 'cov-spouse',
  otherPayerCarrierId: 'carrier-aetna',
  otherPayerName: 'Aetna',
  otherPayerReportedOrder: 2,
};

/** The usual case: the payer names only itself. */
const PARTIAL_REPORT = {
  id: 'report-10',
  source: 'PORTAL',
  reportingCarrierName: 'Aetna',
  reportedDate: '2026-10-05',
  coverageId: 'cov-own',
  reportedSelfOrder: 1,
};

const MISMATCH_REASON =
  "A payer's records disagree with this coverage order and the PAYER_MISMATCH flag is unresolved.";

const setup = (report = FULL_REPORT) => {
  const order = makeOrder({
    status: 'DISPUTED',
    flags: [makeFlag('PAYER_MISMATCH', { detail: { report } })],
  });

  cobOrderService.getCurrentOrder.mockResolvedValue(
    makeOrderPayload({ order, submittable: blocked(MISMATCH_REASON, order) })
  );
  cobVerificationService.getPayerReports.mockResolvedValue({ reports: [report] });
  cobOrderService.overrideOrder.mockResolvedValue({ order: makeOrder({ id: 'order-2', version: 3 }) });
  cobOrderService.resolveFlag.mockResolvedValue({ order });

  return renderWithQuery(<CoverageOrderPanel patientId="pat-1" carriers={carrierFixtures} />);
};

const typeInto = async (user, testId, text) =>
  user.type(screen.getByTestId(testId).querySelector('textarea'), text);

beforeEach(() => {
  jest.clearAllMocks();
  grantAll(usePermissions);
});

describe('PAYER_MISMATCH — the side-by-side view', () => {
  it('shows our order and the insurer’s order next to each other', async () => {
    setup();

    const comparison = await screen.findByTestId('cob-mismatch-comparison');

    const ours = within(comparison).getByTestId('cob-mismatch-ours');
    expect(ours).toHaveTextContent('What we worked out');
    expect(ours).toHaveTextContent('Primary: Aetna — Choice POS II');
    expect(ours).toHaveTextContent('Secondary: Cigna — Open Access Plus');

    const theirs = within(comparison).getByTestId('cob-mismatch-theirs');
    expect(theirs).toHaveTextContent('What the insurer reported');
    expect(theirs).toHaveTextContent('Primary: Cigna — Open Access Plus');
    expect(theirs).toHaveTextContent('Secondary: Aetna');
  });

  it('shows where the insurer’s version came from and when', async () => {
    setup();

    const provenance = await screen.findByTestId('cob-mismatch-provenance');
    expect(provenance).toHaveTextContent('Phone call to the payer');
    expect(provenance).toHaveTextContent('Aetna');
    // The call reference rides in the note, since the endpoint has no field.
    expect(screen.getByTestId('cob-mismatch-note')).toHaveTextContent('CALL-5512');
  });

  it('keeps our reason visible so the user can judge which side to trust', async () => {
    setup();

    expect(await screen.findByTestId('cob-mismatch-ours')).toHaveTextContent(
      /doesn't coordinate with other insurance/i
    );
  });

  it('says claims are blocked while the mismatch is unresolved', async () => {
    setup();

    expect(await screen.findByTestId('cob-claim-blocked')).toHaveTextContent(MISMATCH_REASON);
  });
});

describe('PAYER_MISMATCH — resolutions', () => {
  it("'Use the insurer's order' overrides AND resolves, in that order", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(await screen.findByTestId('cob-flag-action-PAYER_MISMATCH'));
    await typeInto(user, 'cob-mismatch-panel-accept', 'Aetna confirmed by phone that they pay first.');
    await user.click(screen.getByTestId('cob-mismatch-accept-submit'));

    // The override re-ranks to the payer's order...
    await waitFor(() =>
      expect(cobOrderService.overrideOrder).toHaveBeenCalledWith('pat-1', {
        orderedCoverageIds: ['cov-own', 'cov-spouse'],
        reason: 'Aetna confirmed by phone that they pay first.',
      })
    );

    // ...and the flag is then closed on the NEW order version the override made.
    await waitFor(() =>
      expect(cobOrderService.resolveFlag).toHaveBeenCalledWith('order-2', {
        flag: 'PAYER_MISMATCH',
        resolutionNote: expect.stringContaining("Adopted the insurer's reported order."),
      })
    );
  });

  it("requires a 10-character reason before adopting the insurer's order", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(await screen.findByTestId('cob-flag-action-PAYER_MISMATCH'));

    const submit = screen.getByTestId('cob-mismatch-accept-submit');
    expect(submit).toBeDisabled();

    // Nine characters: still short of the backend validator's floor.
    await typeInto(user, 'cob-mismatch-panel-accept', 'too short');
    expect(submit).toBeDisabled();

    await typeInto(user, 'cob-mismatch-panel-accept', ' but now it is long enough');
    expect(submit).toBeEnabled();
  });

  it("'Keep our order' resolves the flag only — it never re-ranks", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(await screen.findByTestId('cob-mismatch-keep-ours'));
    await typeInto(user, 'cob-mismatch-panel-keep', 'Aetna rep reconfirmed they are secondary.');
    await user.click(screen.getByTestId('cob-mismatch-keep-ours-submit'));

    await waitFor(() =>
      expect(cobOrderService.resolveFlag).toHaveBeenCalledWith('order-1', {
        flag: 'PAYER_MISMATCH',
        resolutionNote: 'Kept our order. Aetna rep reconfirmed they are secondary.',
      })
    );
    expect(cobOrderService.overrideOrder).not.toHaveBeenCalled();
  });

  it("'Mark as re-checked' resolves the flag with its own note and nothing else", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(await screen.findByTestId('cob-mismatch-mark-rechecked'));
    await typeInto(user, 'cob-mismatch-panel-recheck', 'Called again 8 Oct; still disagrees.');
    await user.click(screen.getByTestId('cob-mismatch-recheck-submit'));

    await waitFor(() =>
      expect(cobOrderService.resolveFlag).toHaveBeenCalledWith('order-1', {
        flag: 'PAYER_MISMATCH',
        resolutionNote: 'Re-checked with the payer. Called again 8 Oct; still disagrees.',
      })
    );
    expect(cobOrderService.overrideOrder).not.toHaveBeenCalled();
  });

  it('requires a note on "keep our order" too', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(await screen.findByTestId('cob-mismatch-keep-ours'));
    expect(screen.getByTestId('cob-mismatch-keep-ours-submit')).toBeDisabled();

    await typeInto(user, 'cob-mismatch-panel-keep', 'Confirmed.');
    expect(screen.getByTestId('cob-mismatch-keep-ours-submit')).toBeEnabled();
  });
});

describe('PAYER_MISMATCH — a partial payer report', () => {
  it('will not apply an order the insurer only partly named', async () => {
    setup(PARTIAL_REPORT);

    // The override endpoint replaces the WHOLE order, so applying a report
    // that names one of two coverages would silently drop the other.
    await screen.findByTestId('cob-mismatch-comparison');
    expect(screen.queryByTestId('cob-flag-action-PAYER_MISMATCH')).not.toBeInTheDocument();
    expect(screen.getByTestId('cob-mismatch-partial-report')).toHaveTextContent(
      /only named part of the order/i
    );
  });

  it('points a privileged user at the manual override instead', async () => {
    const user = userEvent.setup();
    setup(PARTIAL_REPORT);

    const notice = await screen.findByTestId('cob-mismatch-partial-report');
    await user.click(within(notice).getByRole('button', { name: 'Set the order' }));

    expect(await screen.findByTestId('cob-override-reason')).toBeInTheDocument();
  });

  it('tells a user without the override permission who to ask', async () => {
    grantPermissions(
      usePermissions,
      COB_PERMISSIONS.ORDER_READ,
      COB_PERMISSIONS.FLAG_RESOLVE
    );
    setup(PARTIAL_REPORT);

    expect(await screen.findByTestId('cob-mismatch-partial-report')).toHaveTextContent(
      /ask a billing administrator/i
    );
  });

  it('still lets the flag be resolved by keeping our order', async () => {
    const user = userEvent.setup();
    setup(PARTIAL_REPORT);

    await user.click(await screen.findByTestId('cob-mismatch-keep-ours'));
    await typeInto(user, 'cob-mismatch-panel-keep', 'Portal data is stale; ours is right.');
    await user.click(screen.getByTestId('cob-mismatch-keep-ours-submit'));

    await waitFor(() => expect(cobOrderService.resolveFlag).toHaveBeenCalled());
  });
});
