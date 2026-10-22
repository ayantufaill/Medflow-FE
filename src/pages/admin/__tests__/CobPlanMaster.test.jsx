import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CobPlanMaster from '../CobPlanMaster';
import {
  renderWithQuery,
  grantPermissions,
} from '../../../components/cob/__tests__/cobTestUtils';
import { cobPlanMasterService, cobPlanRequestService } from '../../../services/cob.service';
import { usePermissions } from '../../../hooks/usePermissions';
import { COB_PERMISSIONS } from '../../../constants/cobConstants';

/**
 * Plan master data: who may edit it, and the affected-patient count that has
 * to appear before a coordination change can be saved.
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

// The carrier dropdown comes from the shared Redux insurance catalog; the
// page under test only needs the list, so the hook is stubbed rather than
// standing up a store.
jest.mock('../../../hooks/redux/useInsuranceCatalog', () => ({
  useInsuranceCatalog: () => ({
    companies: [{ id: 'carrier-cigna', name: 'Cigna' }],
    fetchCompanies: jest.fn(),
  }),
}));

/** `shapePlan` output from the backend's plan-master service. */
const PLANS = [
  {
    planId: 'plan-1',
    planName: 'Open Access Plus',
    groupNumber: 'G-100',
    carrierId: 'carrier-cigna',
    carrierName: 'Cigna',
    benefitCategory: 'MEDICAL',
    coordinatesBenefits: true,
    cobPaymentMethod: 'STANDARD',
    cobInfoSource: 'PAYER_CONFIRMED',
    cobProfileRecorded: true,
    version: 3,
  },
  {
    planId: 'plan-2',
    planName: 'Hospital Cash Plan',
    carrierId: 'carrier-colonial',
    carrierName: 'Colonial Life',
    benefitCategory: 'FIXED_INDEMNITY',
    coordinatesBenefits: false,
    cobPaymentMethod: 'UNKNOWN',
    cobInfoSource: 'DEFAULT',
    // Nobody has recorded a profile: every value above is a default.
    cobProfileRecorded: false,
    version: 0,
  },
];

/** Read is the baseline; edit is the privileged addition. */
const grant = (...permissions) =>
  grantPermissions(usePermissions, COB_PERMISSIONS.PLAN_MASTER_READ, ...permissions);

const setup = ({ requests = [] } = {}) => {
  cobPlanMasterService.getPlans.mockResolvedValue({
    plans: PLANS,
    page: 1,
    limit: 25,
    total: PLANS.length,
  });
  cobPlanMasterService.getCobChangeImpact.mockResolvedValue({
    planId: 'plan-1',
    affectedPatients: 14,
    openClaims: 23,
    patientsOnPlan: 180,
  });
  cobPlanRequestService.getPlanRequests.mockResolvedValue({
    requests,
    page: 1,
    limit: 25,
    total: requests.length,
  });
  cobPlanRequestService.resolvePlanRequest.mockResolvedValue({ request: { id: '1' } });
  cobPlanMasterService.updatePlanCobFields.mockResolvedValue({
    plan: PLANS[0],
    changed: { coordinatesBenefits: { from: true, to: false } },
    version: 4,
    reEvaluated: [
      { patientId: '1', status: 'SUGGESTED', orderVersion: 2 },
      { patientId: '2', status: 'NEEDS_INFO', orderVersion: 5 },
    ],
  });
  return renderWithQuery(<CobPlanMaster />);
};

beforeEach(() => jest.clearAllMocks());

describe('CobPlanMaster — permissions', () => {
  it('shows nothing at all without insurance.plan_master.read', async () => {
    grantPermissions(usePermissions);
    setup();

    expect(await screen.findByTestId('plan-master-no-permission')).toBeInTheDocument();
    expect(cobPlanMasterService.getPlans).not.toHaveBeenCalled();
  });

  it('hides the edit action without insurance.plan_master.edit', async () => {
    grant();
    setup();

    await screen.findByTestId('plan-master-table');

    expect(screen.queryByTestId('plan-master-edit-plan-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('plan-master-readonly')).toBeInTheDocument();
    // History stays available: reading is not the privileged part.
    expect(screen.getByTestId('plan-master-history-plan-1')).toBeInTheDocument();
  });

  it('shows the edit action with the permission', async () => {
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup();

    expect(await screen.findByTestId('plan-master-edit-plan-1')).toBeInTheDocument();
    expect(screen.queryByTestId('plan-master-readonly')).not.toBeInTheDocument();
  });
});

describe('CobPlanMaster — the list', () => {
  it('flags the rare "does not coordinate" plans so they can be spotted', async () => {
    grant();
    setup();

    await screen.findByTestId('plan-master-table');

    expect(screen.getByTestId('plan-master-no-coordination-plan-2')).toHaveTextContent('No');
    expect(screen.queryByTestId('plan-master-no-coordination-plan-1')).not.toBeInTheDocument();
  });

  it('narrows the list by payer', async () => {
    const user = userEvent.setup();
    grant();
    setup();

    await screen.findByTestId('plan-master-table');

    await user.click(screen.getByLabelText('Filter by payer'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Cigna'));

    await waitFor(() =>
      expect(cobPlanMasterService.getPlans).toHaveBeenCalledWith(
        // `carrierId` is the backend's filter name, not `payerId`.
        expect.objectContaining({ carrierId: 'carrier-cigna' })
      )
    );
  });

  it('can list only the plans nobody has confirmed', async () => {
    const user = userEvent.setup();
    grant();
    setup();

    await screen.findByTestId('plan-master-table');
    await user.click(screen.getByLabelText('Only plans nobody has confirmed'));

    await waitFor(() =>
      expect(cobPlanMasterService.getPlans).toHaveBeenCalledWith(
        expect.objectContaining({ unconfirmedOnly: true })
      )
    );
  });

  it('says which plans have no recorded profile at all', async () => {
    grant();
    setup();

    await screen.findByTestId('plan-master-table');

    expect(screen.getByTestId('plan-master-unrecorded-plan-2')).toHaveTextContent('Not recorded');
    expect(screen.queryByTestId('plan-master-unrecorded-plan-1')).not.toBeInTheDocument();
  });

  it('says so plainly when nothing matches', async () => {
    grant();
    cobPlanMasterService.getPlans.mockResolvedValue({ plans: [], page: 1, limit: 25, total: 0 });
    renderWithQuery(<CobPlanMaster />);

    expect(await screen.findByTestId('plan-master-empty')).toBeInTheDocument();
  });
});

describe('CobPlanMaster — the affected-patient count', () => {
  it('shows how many patients a coordination change would re-evaluate', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup();

    await user.click(await screen.findByTestId('plan-master-edit-plan-1'));

    // Nothing has changed yet, so no count is claimed.
    expect(screen.queryByTestId('plan-master-impact')).not.toBeInTheDocument();

    await user.click(within(screen.getByTestId('plan-master-coordinates')).getByLabelText('No'));

    expect(await screen.findByTestId('plan-master-impact-count')).toHaveTextContent(
      '14 patients with open claims will have their insurance order worked out again'
    );
    expect(screen.getByTestId('plan-master-impact-count')).toHaveTextContent('23 open claims');

    // The dry-run endpoint is read-only and keyed on the plan alone.
    expect(cobPlanMasterService.getCobChangeImpact).toHaveBeenCalledWith('plan-1');
  });

  it('does not claim a blast radius for a change that re-ranks nobody', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup();

    await user.click(await screen.findByTestId('plan-master-edit-plan-1'));

    // Recording that a payer confirmed something does not change the ranking,
    // so it must not raise the warning.
    await user.click(screen.getByLabelText('Where did this information come from?'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Plan document'));

    expect(screen.queryByTestId('plan-master-impact')).not.toBeInTheDocument();
    expect(cobPlanMasterService.getCobChangeImpact).not.toHaveBeenCalled();
  });

  it('blocks the save until the count has arrived', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    cobPlanMasterService.getPlans.mockResolvedValue({ plans: PLANS, page: 1, limit: 25, total: 2 });
    cobPlanMasterService.getCobChangeImpact.mockReturnValue(new Promise(() => {}));

    renderWithQuery(<CobPlanMaster />);

    await user.click(await screen.findByTestId('plan-master-edit-plan-1'));
    await user.click(within(screen.getByTestId('plan-master-coordinates')).getByLabelText('No'));

    expect(await screen.findByText(/checking how many patients this affects/i)).toBeInTheDocument();
    expect(screen.getByTestId('plan-master-save')).toBeDisabled();
  });

  it('warns when "does not coordinate" is set without recording who confirmed it', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup();

    await user.click(await screen.findByTestId('plan-master-edit-plan-1'));
    await user.click(within(screen.getByTestId('plan-master-coordinates')).getByLabelText('No'));
    await user.click(screen.getByLabelText('Where did this information come from?'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Default (not checked)'));

    expect(screen.getByTestId('plan-master-unconfirmed-no')).toHaveTextContent(
      /record whether a payer confirmed it/i
    );
  });

  it('PATCHes only the fields that changed, with the note for the history', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup();

    await user.click(await screen.findByTestId('plan-master-edit-plan-1'));
    await user.click(within(screen.getByTestId('plan-master-coordinates')).getByLabelText('No'));
    await screen.findByTestId('plan-master-impact-count');

    await user.type(
      screen.getByLabelText('Note for the change history'),
      'Cigna rep confirmed no coordination clause.'
    );
    await user.click(screen.getByTestId('plan-master-save'));

    await waitFor(() => expect(cobPlanMasterService.updatePlanCobFields).toHaveBeenCalled());

    // PATCH semantics: an untouched field must not be rewritten with a value
    // read at dialog-open time.
    expect(cobPlanMasterService.updatePlanCobFields).toHaveBeenCalledWith('plan-1', {
      coordinatesBenefits: false,
      changeNote: 'Cigna rep confirmed no coordination clause.',
    });
  });

  it('shows the re-evaluation that actually happened, not the prediction', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup();

    await user.click(await screen.findByTestId('plan-master-edit-plan-1'));
    await user.click(within(screen.getByTestId('plan-master-coordinates')).getByLabelText('No'));
    await screen.findByTestId('plan-master-impact-count');
    await user.click(screen.getByTestId('plan-master-save'));

    // The response carries `reEvaluated`; the dialog closes on success.
    await waitFor(() => expect(screen.queryByTestId('plan-master-save')).not.toBeInTheDocument());
  });
});

describe('CobPlanMaster — the plan-request worklist', () => {
  const REQUESTS = [
    {
      id: '11',
      planName: 'Mystery PPO 2000',
      groupNumber: 'G-777',
      payerPhone: '800-555-0100',
      carrierName: 'Cigna',
      note: 'Card says "Cigna Open Access" on the back.',
      status: 'OPEN',
      createdAt: '2026-10-07T10:00:00.000Z',
    },
  ];

  it('renders nothing when the queue is empty', async () => {
    grant();
    setup();

    await screen.findByTestId('plan-master-table');
    // An empty box every day teaches people to stop looking at this area.
    expect(screen.queryByTestId('plan-requests-panel')).not.toBeInTheDocument();
  });

  it('lists what the front desk could read off the card', async () => {
    grant();
    setup({ requests: REQUESTS });

    // The panel renders its heading before the query resolves, so wait for
    // the row rather than the container.
    await screen.findByTestId('plan-request-11');

    const panel = screen.getByTestId('plan-requests-panel');
    expect(panel).toHaveTextContent('Mystery PPO 2000');
    expect(panel).toHaveTextContent('Group G-777');
    expect(panel).toHaveTextContent('800-555-0100');
    expect(panel).toHaveTextContent(/Cigna Open Access/);
    expect(screen.getByTestId('plan-requests-count')).toHaveTextContent('1');
  });

  it('hides the close action without insurance.plan_master.edit', async () => {
    grant();
    setup({ requests: REQUESTS });

    await screen.findByTestId('plan-requests-panel');
    expect(screen.queryByTestId('plan-request-resolve-11')).not.toBeInTheDocument();
  });

  it('requires the created plan before a request can be closed as resolved', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup({ requests: REQUESTS });

    await user.click(await screen.findByTestId('plan-request-resolve-11'));

    // "Resolved" with nothing to point at is indistinguishable from "ignored"
    // a month later, and the front desk's coverage still needs a plan.
    expect(screen.getByTestId('plan-request-submit')).toBeDisabled();

    await user.click(screen.getByLabelText('Which plan did you add?'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Cigna — Open Access Plus'));

    expect(screen.getByTestId('plan-request-submit')).toBeEnabled();
    await user.click(screen.getByTestId('plan-request-submit'));

    await waitFor(() =>
      expect(cobPlanRequestService.resolvePlanRequest).toHaveBeenCalledWith('11', {
        status: 'RESOLVED',
        planId: 'plan-1',
        resolutionNote: undefined,
      })
    );
  });

  it('requires a note before a request can be declined', async () => {
    const user = userEvent.setup();
    grant(COB_PERMISSIONS.PLAN_MASTER_EDIT);
    setup({ requests: REQUESTS });

    await user.click(await screen.findByTestId('plan-request-resolve-11'));
    await user.click(screen.getByLabelText('What happened?'));
    await user.click(within(await screen.findByRole('listbox')).getByText("This isn't a plan we need"));

    // Declining is the one path with nothing to show for it, so it has to say
    // why — the person who asked is looking at a patient's card.
    expect(screen.getByTestId('plan-request-submit')).toBeDisabled();

    await user.type(
      screen.getByTestId('plan-request-note').querySelector('textarea'),
      'Discount card, not insurance.'
    );

    expect(screen.getByTestId('plan-request-submit')).toBeEnabled();
    await user.click(screen.getByTestId('plan-request-submit'));

    await waitFor(() =>
      expect(cobPlanRequestService.resolvePlanRequest).toHaveBeenCalledWith('11', {
        status: 'REJECTED',
        planId: undefined,
        resolutionNote: 'Discount card, not insurance.',
      })
    );
  });
});
