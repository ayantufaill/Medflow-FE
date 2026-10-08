import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoverageFormDialog from '../CoverageFormDialog';
import { carrierFixtures, planFixtures } from './cobTestUtils';

/**
 * The coverage intake form: conditional questions, and the one required field
 * everybody forgets (the policyholder's date of birth).
 */

// DatePicker stubbed to a plain input, as the existing waitlist suites do —
// the real one renders a calendar popper that adds nothing here.
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, onChange, value, slotProps }) => {
    const mockDayjs = require('dayjs');
    const textField = slotProps?.textField || {};
    return (
      <div>
        <input
          aria-label={label}
          data-testid={textField['data-testid'] || `date-${label}`}
          value={value ? value.format('YYYY-MM-DD') : ''}
          onChange={(e) => onChange(e.target.value ? mockDayjs(e.target.value) : null)}
        />
        {textField.helperText && <span>{textField.helperText}</span>}
      </div>
    );
  },
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

const setup = (props = {}) =>
  render(
    <CoverageFormDialog
      open
      onClose={jest.fn()}
      carriers={carrierFixtures}
      plans={planFixtures}
      onSubmit={jest.fn()}
      onRequestPlan={jest.fn()}
      {...props}
    />
  );

/** Picks an option out of a MUI Select by its accessible label. */
const selectOption = async (user, label, optionText) => {
  await user.click(screen.getByLabelText(label));
  const listbox = await screen.findByRole('listbox');
  await user.click(within(listbox).getByText(optionText));
};

describe('CoverageFormDialog — conditional questions', () => {
  it('asks nothing conditional for a commercial self policy', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByLabelText('The patient'));

    expect(screen.queryByTestId('cob-subscriber-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cob-section-medicare')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cob-section-employment')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cob-section-custody')).not.toBeInTheDocument();
  });

  it('reveals the policyholder questions when the policy is not the patient’s', async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.queryByTestId('cob-subscriber-name')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Their spouse or partner'));

    expect(screen.getByTestId('cob-subscriber-name')).toBeInTheDocument();
    expect(screen.getByLabelText("Policyholder's date of birth")).toBeInTheDocument();
  });

  it('shows the Medicare reason for a Medicare payer, and the ESRD date only for ESRD', async () => {
    const user = userEvent.setup();
    setup();

    await selectOption(user, 'Insurance company', 'Medicare Part B');

    expect(screen.getByTestId('cob-section-medicare')).toBeInTheDocument();
    expect(screen.queryByTestId('cob-section-esrd')).not.toBeInTheDocument();

    await selectOption(user, 'Why does the patient have Medicare?', 'Kidney failure (ESRD)');

    expect(screen.getByTestId('cob-section-esrd')).toBeInTheDocument();

    await selectOption(user, 'Why does the patient have Medicare?', 'Age (65 or over)');

    expect(screen.queryByTestId('cob-section-esrd')).not.toBeInTheDocument();
  });

  it('asks about working and employer size only when Medicare meets employer coverage', async () => {
    const user = userEvent.setup();
    const { unmount } = setup({ context: { otherCoverages: [] } });

    await selectOption(user, 'Insurance company', 'Medicare Part B');
    expect(screen.queryByTestId('cob-section-employment')).not.toBeInTheDocument();
    unmount();

    setup({ context: { otherCoverages: [{ coverageBasis: 'EMPLOYER_GROUP' }] } });
    await selectOption(user, 'Insurance company', 'Medicare Part B');

    expect(screen.getByTestId('cob-section-employment')).toBeInTheDocument();
    // Employer size appears only once the answer is "still working".
    expect(screen.queryByTestId('cob-employer-size')).not.toBeInTheDocument();

    await selectOption(user, 'Is the policyholder still actively working?', 'Still actively working');
    expect(screen.getByTestId('cob-employer-size')).toBeInTheDocument();
  });

  it('asks custody questions only for a child on both parents’ policies, and only past “together”', async () => {
    const user = userEvent.setup();
    setup({
      context: {
        patientIsDependentChild: true,
        otherCoverages: [{ relationship: 'PARENT' }],
      },
    });

    expect(screen.queryByTestId('cob-section-custody')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Their parent'));

    expect(screen.getByTestId('cob-section-custody')).toBeInTheDocument();
    expect(screen.queryByTestId('cob-section-custody-detail')).not.toBeInTheDocument();

    await selectOption(user, 'Are the parents married or living together?', 'Married or living together');
    expect(screen.queryByTestId('cob-section-custody-detail')).not.toBeInTheDocument();

    await selectOption(user, 'Are the parents married or living together?', 'Divorced');
    expect(screen.getByTestId('cob-section-custody-detail')).toBeInTheDocument();
    expect(screen.getByTestId('cob-court-order')).toBeInTheDocument();
  });

  it('asks for employment status on COBRA and retiree coverage', async () => {
    const user = userEvent.setup();
    setup();

    await selectOption(user, 'How does the patient have this coverage?', 'COBRA continuation');

    expect(screen.getByTestId('cob-employment-status')).toBeInTheDocument();
  });
});

describe('CoverageFormDialog — validation', () => {
  it('blocks the save and explains why when the policyholder DOB is missing', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.click(screen.getByLabelText('Their spouse or partner'));
    await user.type(screen.getByTestId('cob-subscriber-name').querySelector('input'), 'Jane Doe');

    await user.click(screen.getByTestId('cob-coverage-submit'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/date of birth — it decides which plan pays first/i)
    ).toBeInTheDocument();
  });

  it('saves a self policy without asking for a policyholder DOB', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.click(screen.getByLabelText('The patient'));

    await user.click(screen.getByTestId('cob-coverage-submit'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].cobDetail.subscriberBirthdate).toBeNull();
  });

  it('clears conditional answers that are no longer on screen before saving', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    // Answer the Medicare questions, then switch to a commercial payer.
    await selectOption(user, 'Insurance company', 'Medicare Part B');
    await selectOption(user, 'Why does the patient have Medicare?', 'Age (65 or over)');
    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.click(screen.getByLabelText('The patient'));

    await user.click(screen.getByTestId('cob-coverage-submit'));

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0].cobDetail.medicareEntitlementReason).toBeNull();
  });
});

describe('CoverageFormDialog — the submit payload', () => {
  it('splits the save into the base coverage and the COB facts', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.type(screen.getByLabelText('Group number'), 'G-1');
    await user.click(screen.getByLabelText('The patient'));
    await selectOption(user, 'How does the patient have this coverage?', 'Through an employer');

    await user.click(screen.getByTestId('cob-coverage-submit'));

    const payload = onSubmit.mock.calls[0][0];

    // The payer, plan, member ID and dates belong to patplan/inssub/insplan
    // and are saved through the patient-insurance endpoints...
    expect(payload.coverage).toMatchObject({
      carrierId: 'carrier-cigna',
      planId: 'plan-cigna-oap',
      memberId: 'M-99',
      groupNumber: 'G-1',
      relationship: 'SELF',
    });

    // ...while only the coordination facts go to PATCH /coverages/:id/detail.
    expect(payload.cobDetail).toMatchObject({ coverageBasis: 'EMPLOYER_GROUP' });
    expect(payload.cobDetail).not.toHaveProperty('memberId');
    expect(payload.cobDetail).not.toHaveProperty('carrierId');
  });

  it("uses the backend validator's field name for employment status", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({ onSubmit });

    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.click(screen.getByLabelText('The patient'));
    await selectOption(user, 'How does the patient have this coverage?', 'COBRA continuation');
    await selectOption(user, 'Is the policyholder still actively working?', 'On COBRA continuation');

    await user.click(screen.getByTestId('cob-coverage-submit'));

    const { cobDetail } = onSubmit.mock.calls[0][0];
    // The endpoint calls it `subscriberEmploymentStatus`, not
    // `employmentStatus` — getting this wrong is a silent 400.
    expect(cobDetail.subscriberEmploymentStatus).toBe('COBRA');
    expect(cobDetail).not.toHaveProperty('employmentStatus');
  });

  it('sends the custody answers only once they are on screen', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({
      onSubmit,
      context: { patientIsDependentChild: true, otherCoverages: [{ relationship: 'PARENT' }] },
    });

    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.click(screen.getByLabelText('Their parent'));
    await user.type(
      screen.getByTestId('cob-subscriber-name').querySelector('input'),
      'Dana Rivera'
    );
    fireEvent.change(screen.getByLabelText("Policyholder's date of birth"), {
      target: { value: '1988-03-14' },
    });
    await selectOption(user, 'Are the parents married or living together?', 'Divorced');
    await selectOption(user, 'Whose policy is this?', 'The parent the child lives with');

    await user.click(screen.getByTestId('cob-coverage-submit'));

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0].cobDetail).toMatchObject({
      custodyArrangement: 'DIVORCED',
      custodyRole: 'CUSTODIAL',
      // The parent's DOB is what the birthday rule compares.
      subscriberBirthdate: '1988-03-14',
    });
  });

  it('nulls the custody answers when the parents turn out to be together', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    setup({
      onSubmit,
      context: { patientIsDependentChild: true, otherCoverages: [{ relationship: 'PARENT' }] },
    });

    await selectOption(user, 'Insurance company', 'Cigna');
    await selectOption(user, 'Plan', 'Open Access Plus');
    await user.type(screen.getByLabelText('Member ID'), 'M-99');
    await user.click(screen.getByLabelText('Their parent'));
    await user.type(
      screen.getByTestId('cob-subscriber-name').querySelector('input'),
      'Dana Rivera'
    );
    fireEvent.change(screen.getByLabelText("Policyholder's date of birth"), {
      target: { value: '1988-03-14' },
    });
    await selectOption(user, 'Are the parents married or living together?', 'Divorced');
    await selectOption(user, 'Whose policy is this?', 'The other parent');
    // Then corrected: they are together after all.
    await selectOption(user, 'Are the parents married or living together?', 'Married or living together');

    await user.click(screen.getByTestId('cob-coverage-submit'));

    expect(onSubmit).toHaveBeenCalled();
    const { cobDetail } = onSubmit.mock.calls[0][0];
    expect(cobDetail.custodyArrangement).toBe('TOGETHER');
    // The role question is no longer on screen, so its stale answer must not
    // reach the rule engine.
    expect(cobDetail.custodyRole).toBeNull();
    expect(cobDetail.courtOrderExists).toBe(false);
  });
});

describe('CoverageFormDialog — fixed-benefit plans', () => {
  it('warns that an indemnity plan will not be part of the claim order', async () => {
    const user = userEvent.setup();
    setup();

    await selectOption(user, 'Insurance company', 'Cigna');
    expect(screen.queryByTestId('cob-fixed-benefit-note')).not.toBeInTheDocument();

    await selectOption(user, 'Plan', 'Hospital Cash Plan');

    expect(screen.getByTestId('cob-fixed-benefit-note')).toHaveTextContent(
      /pays the patient a fixed amount directly/i
    );
  });
});

describe('CoverageFormDialog — plan not listed', () => {
  it('sends the details to the billing team instead of creating a plan', async () => {
    const user = userEvent.setup();
    const onRequestPlan = jest.fn().mockResolvedValue({ id: 'req-1' });
    setup({ onRequestPlan });

    await selectOption(user, 'Insurance company', 'Cigna');
    await user.click(screen.getByTestId('cob-plan-not-listed'));

    await user.type(screen.getByTestId('cob-plan-request-name').querySelector('input'), 'Mystery PPO');
    await user.click(screen.getByTestId('cob-plan-request-submit'));

    expect(onRequestPlan).toHaveBeenCalledWith(
      expect.objectContaining({ planName: 'Mystery PPO', carrierId: 'carrier-cigna' })
    );
    expect(await screen.findByTestId('cob-plan-request-pending')).toHaveTextContent('Mystery PPO');
  });
});
