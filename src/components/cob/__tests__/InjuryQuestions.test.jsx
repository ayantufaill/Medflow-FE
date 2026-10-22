import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InjuryQuestions from '../InjuryQuestions';
import AutomaticEligibilityCheckButton from '../AutomaticEligibilityCheckButton';
import ClaimCobSection from '../ClaimCobSection';
import { renderWithQuery } from './cobTestUtils';
import {
  cobBillingService,
  cobOrderService,
  cobVerificationService,
} from '../../../services/cob.service';
import { usePermissions } from '../../../hooks/usePermissions';
import { grantAll } from './cobTestUtils';

jest.mock('../../../config/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../../services/cob.service');
jest.mock('../../../hooks/usePermissions');
jest.mock('../../../contexts/SnackbarContext', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  grantAll(usePermissions);
  cobOrderService.getCurrentOrder.mockResolvedValue({
    order: null,
    coverages: [],
    submittable: { allowed: true, reason: null, orderId: null, status: null },
  });
  cobOrderService.evaluateOrder.mockResolvedValue({ order: null });
  cobVerificationService.getPayerReports.mockResolvedValue({ reports: [] });
  cobBillingService.getInvoiceResponsibility.mockResolvedValue({ byParty: [] });
  cobBillingService.getSecondaryReadiness.mockResolvedValue({ posted: false });
});

/**
 * The claim-side injury question, and the feature-flagged eligibility
 * placeholder.
 */

describe('InjuryQuestions', () => {
  it('asks what kind of injury only after the answer is yes', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { rerender } = render(<InjuryQuestions injuryRelated={null} onChange={onChange} />);

    expect(screen.queryByTestId('cob-injury-type-section')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Yes'));
    expect(onChange).toHaveBeenCalledWith({ injuryRelated: true, injuryType: null });

    rerender(<InjuryQuestions injuryRelated onChange={onChange} />);

    expect(screen.getByTestId('cob-injury-type-section')).toBeInTheDocument();
    expect(screen.getByLabelText('A work injury')).toBeInTheDocument();
    expect(screen.getByLabelText('A car accident')).toBeInTheDocument();
  });

  it('clears the injury type when the answer flips back to no', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<InjuryQuestions injuryRelated injuryType="WORKERS_COMP" onChange={onChange} />);

    await user.click(screen.getByLabelText('No'));

    // A stale workers'-comp marker must not ride along on an unrelated claim.
    expect(onChange).toHaveBeenCalledWith({ injuryRelated: false, injuryType: null });
  });

  it('reports the chosen injury type', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<InjuryQuestions injuryRelated onChange={onChange} />);

    await user.click(screen.getByLabelText('A car accident'));

    expect(onChange).toHaveBeenCalledWith({
      injuryRelated: true,
      injuryType: 'AUTO_LIABILITY',
    });
  });
});

describe('AutomaticEligibilityCheckButton', () => {
  it('renders nothing while the feature flag is off', () => {
    // jest.setup.cjs leaves __FEATURE_FLAGS__ empty, so the flag is off.
    const { container } = render(<AutomaticEligibilityCheckButton onRun={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('appears once the flag is on, and runs the check', async () => {
    const user = userEvent.setup();
    const onRun = jest.fn();
    globalThis.__FEATURE_FLAGS__ = { autoEligibility: true };

    try {
      render(<AutomaticEligibilityCheckButton onRun={onRun} />);

      const button = screen.getByTestId('cob-auto-eligibility');
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(onRun).toHaveBeenCalled();
    } finally {
      globalThis.__FEATURE_FLAGS__ = {};
    }
  });

  it('can be forced on by a caller regardless of the flag', () => {
    render(<AutomaticEligibilityCheckButton enabled onRun={jest.fn()} />);
    expect(screen.getByTestId('cob-auto-eligibility')).toBeInTheDocument();
  });
});

describe('ClaimCobSection — the injury answer', () => {
  /**
   * There is no endpoint that stores injury relatedness on a claim. The
   * backend takes it as CLAIM CONTEXT on the evaluate call, which is the same
   * modelling decision from the other side: it is an input to the ranking for
   * this date of service, not a stored property of a coverage.
   */
  it('holds the re-evaluation until the kind of injury is chosen', async () => {
    const user = userEvent.setup();

    renderWithQuery(
      <ClaimCobSection claimId="claim-1" patientId="pat-1" dateOfService="2026-09-01" />
    );

    await user.click(screen.getByLabelText('Yes'));

    // "Yes" alone is incomplete — the rules need the type to pick a payer.
    expect(cobOrderService.evaluateOrder).not.toHaveBeenCalled();

    await user.click(screen.getByLabelText('A work injury'));

    await waitFor(() =>
      expect(cobOrderService.evaluateOrder).toHaveBeenCalledWith('pat-1', {
        dateOfService: '2026-09-01',
        triggerReason: 'CLAIM_INJURY_CONTEXT',
        injuryRelated: true,
        injuryType: 'WORKERS_COMP',
      })
    );
  });

  it('re-evaluates straight away on a plain "no"', async () => {
    const user = userEvent.setup();

    renderWithQuery(
      <ClaimCobSection claimId="claim-2" patientId="pat-1" dateOfService="2026-09-01" />
    );

    await user.click(screen.getByLabelText('No'));

    await waitFor(() =>
      expect(cobOrderService.evaluateOrder).toHaveBeenCalledWith('pat-1', {
        dateOfService: '2026-09-01',
        triggerReason: 'CLAIM_INJURY_CONTEXT',
        injuryRelated: false,
        injuryType: null,
      })
    );
  });

  it("asks the order panel about the claim's own date of service", async () => {
    renderWithQuery(
      <ClaimCobSection claimId="claim-3" patientId="pat-1" dateOfService="2026-02-14" />
    );

    // A claim for February must bill February's order, so the submittable
    // check has to be evaluated for that date and not for today.
    await waitFor(() =>
      expect(cobOrderService.getCurrentOrder).toHaveBeenCalledWith('pat-1', {
        dateOfService: '2026-02-14',
      })
    );
  });
});
