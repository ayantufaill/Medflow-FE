import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClaimResponsibilityPanel from '../balances/ClaimResponsibilityPanel';
import { renderWithQuery } from './cobTestUtils';
import { cobBillingService } from '../../../services/cob.service';

/**
 * Claim and balance views: who owes what, estimates that say they are
 * estimates, and the secondary-claim gate.
 *
 * Shapes mirror `GET /cob/invoices/:id/responsibility` (per-party totals from
 * `cob_responsibility_ledger`) and `GET /cob/claims/:id/secondary-readiness`
 * (`PrimaryRemittanceStatus`, whose field is `posted`).
 */

jest.mock('../../../config/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../../services/cob.service');
jest.mock('../../../contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const BREAKDOWN = {
  statementId: 'inv-1',
  byParty: [
    // Deliberately out of billing order, to prove the table re-sorts.
    { responsibleParty: 'PATIENT', charges: 85, payments: 0, contractualAdjustments: 0, balance: 85 },
    { responsibleParty: 'PRIMARY', charges: 550, payments: 400, contractualAdjustments: 150, balance: 0 },
    { responsibleParty: 'SECONDARY', charges: 120, payments: 0, contractualAdjustments: 0, balance: 120 },
    { responsibleParty: 'TERTIARY', charges: 240, payments: 0, contractualAdjustments: 0, balance: 240 },
  ],
  contractualAdjustmentsTotal: 150,
  contractualAdjustmentsAreBillableToPatient: false,
  patientLiabilityFinalizedAt: null,
  lastPayerClaimId: null,
};

/** A secondary with a firm estimate, a tertiary whose method is unknown. */
const ESTIMATES = {
  SECONDARY: { low: 120, high: 120 },
  TERTIARY: { low: 0, high: 240 },
};

const setup = ({ readiness, breakdown = BREAKDOWN, estimatesByParty = ESTIMATES, invoiceId = 'inv-1' } = {}) => {
  cobBillingService.getInvoiceResponsibility.mockResolvedValue(breakdown);
  cobBillingService.getSecondaryReadiness.mockResolvedValue(readiness || { posted: false, reason: null });
  cobBillingService.generateSecondaryClaim.mockResolvedValue({});

  return renderWithQuery(
    <ClaimResponsibilityPanel claimId="claim-1" invoiceId={invoiceId} estimatesByParty={estimatesByParty} />
  );
};

beforeEach(() => jest.clearAllMocks());

describe('Balance by responsible party', () => {
  it('splits the balance across primary, secondary, tertiary and the patient', async () => {
    setup();

    await screen.findByTestId('cob-balance-table');

    expect(screen.getByTestId('cob-balance-row-PRIMARY')).toHaveTextContent('Primary insurance');
    expect(screen.getByTestId('cob-balance-row-SECONDARY')).toHaveTextContent('Secondary insurance');
    expect(screen.getByTestId('cob-balance-row-TERTIARY')).toHaveTextContent('Tertiary insurance');
    expect(screen.getByTestId('cob-balance-row-PATIENT')).toHaveTextContent('Patient');
  });

  it('lists insurance before the patient, in billing order', async () => {
    setup();

    const table = await screen.findByTestId('cob-balance-table');
    const order = within(table)
      .getAllByText(/insurance$|^Patient$/)
      .map((node) => node.textContent);

    expect(order).toEqual([
      'Primary insurance',
      'Secondary insurance',
      'Tertiary insurance',
      'Patient',
    ]);
  });

  it('shows contractual adjustments per party and as a labelled total', async () => {
    setup();

    await screen.findByTestId('cob-balance-table');

    expect(screen.getByTestId('cob-balance-adjustment-PRIMARY')).toHaveTextContent('−$150.00');
    // A write-off is not a payment and not a patient discount, so the total
    // carries the full compliance wording.
    expect(screen.getByTestId('cob-contractual-adjustment')).toHaveTextContent(
      'Insurance agreed-price adjustment (not billed to patient)'
    );
  });

  it('keeps the adjustment out of the paid column', async () => {
    setup();

    await screen.findByTestId('cob-balance-table');
    // The primary PAID 400; the extra 150 is a write-off, not money received.
    expect(screen.getByTestId('cob-balance-paid-PRIMARY')).toHaveTextContent('$400.00');
  });

  it('labels every not-yet-remitted insurance payment as an estimate', async () => {
    setup();

    await screen.findByTestId('cob-balance-table');

    expect(screen.getByTestId('cob-estimate-badge-SECONDARY')).toHaveTextContent('Estimate');
    expect(screen.getByTestId('cob-estimate-badge-TERTIARY')).toHaveTextContent('Estimate');
    // A posted payment is not an estimate.
    expect(screen.queryByTestId('cob-estimate-badge-PRIMARY')).not.toBeInTheDocument();
  });

  it('shows a single figure when the plan payment method is known', async () => {
    setup();

    expect(await screen.findByTestId('cob-balance-paid-SECONDARY')).toHaveTextContent('$120.00');
    expect(screen.queryByTestId('cob-estimate-range-info-SECONDARY')).not.toBeInTheDocument();
  });

  it('shows a range, with an explanation, when the payment method is unknown', async () => {
    setup();

    expect(await screen.findByTestId('cob-balance-paid-TERTIARY')).toHaveTextContent(
      '$0.00 – $240.00'
    );
    expect(screen.getByTestId('cob-estimate-range-info-TERTIARY')).toBeInTheDocument();
  });

  it('shows no estimate notice when every payer has remitted', async () => {
    setup({ estimatesByParty: {} });

    await screen.findByTestId('cob-balance-table');
    expect(screen.queryByTestId('cob-estimates-notice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cob-estimate-badge-SECONDARY')).not.toBeInTheDocument();
  });

  it('handles the empty, unlinked and error cases', async () => {
    const { unmount } = setup({ breakdown: { byParty: [] } });
    expect(await screen.findByTestId('cob-balance-empty')).toBeInTheDocument();
    unmount();

    const second = setup({ invoiceId: null });
    expect(await screen.findByTestId('cob-balance-no-invoice')).toBeInTheDocument();
    second.unmount();

    cobBillingService.getInvoiceResponsibility.mockRejectedValue(new Error('nope'));
    cobBillingService.getSecondaryReadiness.mockResolvedValue({ posted: false });
    renderWithQuery(<ClaimResponsibilityPanel claimId="claim-2" invoiceId="inv-2" />);

    expect(await screen.findByTestId('cob-balance-error')).toBeInTheDocument();
  });
});

describe('The secondary claim gate', () => {
  it('is disabled before the primary remittance is posted, and says why', async () => {
    const reason =
      'The primary claim 900 has no posted remittance yet (status S, no received date). ' +
      "A secondary claim has to carry the primary's paid amount, allowed amount, adjustment " +
      'codes and patient responsibility. Post the primary’s ERA or EOB first.';

    setup({ readiness: { posted: false, reason } });

    const button = await screen.findByTestId('cob-create-secondary-claim');
    expect(button).toBeDisabled();
    // The reason is in the accessible name too, so it is not colour-only.
    await waitFor(() => expect(button).toHaveAccessibleName(/no posted remittance yet/i));
    expect(screen.getByTestId('cob-secondary-blocked-reason')).toHaveTextContent(reason);
  });

  it('explains the requirement even when the backend sends no reason', async () => {
    const user = userEvent.setup();
    setup({ readiness: { posted: false, reason: null } });

    const wrapper = await screen.findByTestId('cob-secondary-claim-wrapper');
    await user.hover(wrapper);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      /only be created once the primary insurer's payment has been posted/i
    );
  });

  it('is enabled once the remittance is posted, and generates the claim', async () => {
    const user = userEvent.setup();
    setup({
      readiness: {
        posted: true,
        reason: null,
        paidAmount: 400,
        allowedAmount: 550,
        patientResponsibility: 150,
        adjustments: [{ groupCode: 'CO', reasonCode: '45', amount: 150 }],
        remittanceDate: '2026-09-20',
      },
    });

    const button = await screen.findByTestId('cob-create-secondary-claim');
    await waitFor(() => expect(button).toBeEnabled());

    await user.click(button);

    await waitFor(() =>
      expect(cobBillingService.generateSecondaryClaim).toHaveBeenCalledWith('claim-1')
    );
  });

  it('treats a $0 denial as posted — a denial is an adjudication', async () => {
    // Gating on "was there money" would strand exactly the patients who most
    // need the secondary billed.
    setup({
      readiness: {
        posted: true,
        reason: null,
        paidAmount: 0,
        allowedAmount: 0,
        patientResponsibility: 550,
        adjustments: [{ groupCode: 'CO', reasonCode: '22', amount: 550 }],
        remittanceDate: '2026-09-24',
      },
    });

    const button = await screen.findByTestId('cob-create-secondary-claim');
    await waitFor(() => expect(button).toBeEnabled());
  });

  it('summarises the adjudication the secondary will carry', async () => {
    setup({
      readiness: {
        posted: true,
        reason: null,
        paidAmount: 400,
        allowedAmount: 550,
        patientResponsibility: 150,
        adjustments: [{ groupCode: 'CO', reasonCode: '45', amount: 150 }],
        remittanceDate: '2026-09-20',
      },
    });

    const summary = await screen.findByTestId('cob-primary-remittance-summary');
    expect(summary).toHaveTextContent('paid 400.00');
    expect(summary).toHaveTextContent('allowed 550.00');
    expect(summary).toHaveTextContent('1 adjustment code');
  });
});
