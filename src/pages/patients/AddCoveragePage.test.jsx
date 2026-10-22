import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCoveragePage from './AddCoveragePage';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockNavigate = jest.fn();
const mockSnackbar = jest.fn();
let mockPayerId;
let mockSelectedPayerId;
let mockInsuranceId;

jest.mock('@mui/icons-material', () => ({
  Business: () => null, GppGood: () => null, BookmarkBorder: () => null,
  Edit: () => <span data-testid="EditIcon" />,
  CheckCircle: () => null, CalendarToday: () => null, PeopleOutline: () => null,
  InfoOutlined: () => null, Visibility: () => null, VisibilityOff: () => null,
}));
jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({ LocalizationProvider: ({ children }) => children }));
jest.mock('@mui/x-date-pickers/DatePicker', () => ({ DatePicker: () => null }));
jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({ AdapterDayjs: jest.fn() }));
jest.mock('@mui/icons-material/KeyboardDoubleArrowRight', () => () => null);
jest.mock('react-router-dom', () => ({
  useParams: () => ({ patientId: '1', insuranceId: mockInsuranceId }),
  useNavigate: () => mockNavigate,
}));
jest.mock('../../contexts/SnackbarContext', () => ({ useSnackbar: () => ({ showSnackbar: mockSnackbar }) }));
jest.mock('../../hooks/redux/usePatient', () => ({ usePatient: () => ({ currentPatient: null }) }));
jest.mock('../../hooks/redux/usePatientInsurance', () => ({
  usePatientInsurance: () => ({ create: mockCreate, update: mockUpdate }),
}));
jest.mock('../../services/patient.service', () => ({ patientService: {
  getAllPatients: jest.fn().mockResolvedValue([]),
  getAllPatientInsurances: jest.fn().mockResolvedValue([]),
} }));
jest.mock('./hooks/useCoverageData', () => ({
  useCoverageData: (_patientId, _insuranceId, _patient, _fetchPatient, _form, setFormData) => {
    const { useEffect } = require('react');
    useEffect(() => {
      setFormData(prev => ({
        ...prev,
        insuranceCompanyId: '42', carrierName: 'Test Carrier', payerId: mockPayerId,
        insurancePlan: 'Test Plan', groupName: 'Test Group', groupNumber: '123',
        subscriber: { relationship: 'Self', name: 'Test Patient', subscriberId: 'AB1234', dateOfBirth: '1990-01-01', ssn: '' },
      }));
    }, [setFormData]);
    return { loading: false, feeGuides: [], allCompanies: [], coverageTemplates: [] };
  },
}));
jest.mock('../../components/insurance', () => ({
  InsuranceInformation: require('../../components/insurance/components/InsuranceInformation').default,
  SubscriberInformation: require('../../components/insurance/components/SubscriberInformation').default, RenewalSection: () => null,
  AdvancedSection: () => null, PlanFeeGuideSection: () => null,
  DeductiblesTable: () => null, CoverageTable: () => null,
  PolicyNotes: () => null, CoverageBookSummary: () => null,
  FeeGuideModal: () => null, CoverageBookModal: () => null, COVERAGE_DATA: [],
}));
jest.mock('../../components/insurance/insurance-info/CarrierSearchDropdown', () => ({ handleSelectResult }) => (
  <button onClick={() => handleSelectResult({
    id: '43', name: 'Selected Carrier', payerId: mockSelectedPayerId,
    groupName: 'Test Group', groupNumber: '123', planName: 'Test Plan',
  })}>Select carrier</button>
));
jest.mock('../../components/insurance/insurance-info/PlanBillingTable', () => () => null);
jest.mock('../../components/shared/PhoneNumberInput', () => () => null);
jest.mock('../../components/shared/ConfirmationDialog', () => () => null);
jest.mock('../../components/appointments/right-panel/RightPanel', () => () => null);
jest.mock('../../components/appointments/right-panel/RightPanelCollapsed', () => () => null);

const payerInput = () => screen.getByPlaceholderText('3 to 10 letters or numbers');
const save = () => fireEvent.click(screen.getByRole('button', { name: 'Save' }));

beforeEach(() => {
  jest.clearAllMocks();
  mockPayerId = '';
  mockSelectedPayerId = 'chp01';
  mockInsuranceId = undefined;
  mockCreate.mockReturnValue({ unwrap: () => Promise.resolve({}) });
  mockUpdate.mockReturnValue({ unwrap: () => Promise.resolve({}) });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(() => jest.restoreAllMocks());

it.each(['chp01', '00621', 'ABC', 'ABCDEFGHIJ'])('saves %s as an uppercase string', async (value) => {
  render(<AddCoveragePage />);
  fireEvent.change(payerInput(), { target: { value } });
  expect(payerInput()).toHaveValue(value.toUpperCase());
  save();
  await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ payerId: value.toUpperCase() })));
});

it.each(['AB 12', 'AB-12', 'AB@12', 'ABCDEFGHIJK', 'ß12'])('rejects the complete invalid input %j and allows correction', (value) => {
  mockPayerId = '00621';
  render(<AddCoveragePage />);
  fireEvent.change(payerInput(), { target: { value } });
  expect(payerInput()).toHaveValue('00621');
  expect(payerInput()).toHaveAttribute('aria-invalid', 'true');
  fireEvent.change(payerInput(), { target: { value: 'abc12' } });
  expect(payerInput()).toHaveValue('ABC12');
  expect(payerInput()).toHaveAttribute('aria-invalid', 'false');
});

it('allows partial typing and deletion but blocks short or empty IDs on save', () => {
  render(<AddCoveragePage />);
  fireEvent.change(payerInput(), { target: { value: 'ab' } });
  expect(payerInput()).toHaveValue('AB');
  save();
  expect(screen.getByText('Payer ID must be between 3 and 10 characters')).toBeInTheDocument();
  fireEvent.change(payerInput(), { target: { value: '' } });
  save();
  expect(screen.getByText('Payer ID is required')).toBeInTheDocument();
  expect(mockCreate).not.toHaveBeenCalled();
});

it.each(['AB', 'ABCDEFGHIJK', 'AB 12', 'AB-12'])('blocks invalid prepopulated ID %s on save', (value) => {
  mockPayerId = value;
  render(<AddCoveragePage />);
  save();
  expect(payerInput()).toHaveAttribute('aria-invalid', 'true');
  expect(mockCreate).not.toHaveBeenCalled();
});

it('normalizes a selected carrier and replaces a previous ID with an invalid selection for correction', () => {
  render(<AddCoveragePage />);
  fireEvent.click(screen.getByRole('button', { name: 'Select carrier' }));
  expect(payerInput()).toHaveValue('CHP01');
  mockSelectedPayerId = 'AB-12';
  fireEvent.click(screen.getByRole('button', { name: 'Select carrier' }));
  expect(payerInput()).toHaveValue('AB-12');
  save();
  expect(mockCreate).not.toHaveBeenCalled();
});

it('normalizes an existing lowercase ID in the update payload', async () => {
  mockPayerId = 'chp01';
  mockInsuranceId = '99';
  render(<AddCoveragePage />);
  fireEvent.click(screen.getAllByRole('button').find(button => button.querySelector('[data-testid="EditIcon"]')));
  save();
  await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith('99', expect.objectContaining({ payerId: 'CHP01' })));
});

it('shows a backend Payer ID error on the field and clears it after correction', async () => {
  mockPayerId = 'ABC12';
  mockCreate.mockReturnValue({ unwrap: () => Promise.reject({ data: { error: { errors: { payerId: ['Payer ID was rejected'] } } } }) });
  render(<AddCoveragePage />);
  save();
  expect(await screen.findByText('Payer ID was rejected')).toBeInTheDocument();
  fireEvent.change(payerInput(), { target: { value: 'abc13' } });
  expect(screen.queryByText('Payer ID was rejected')).not.toBeInTheDocument();
});

describe.each([false, true])('SSN editing with visibility %s', (visible) => {
  const setupSsn = async () => {
    const user = userEvent.setup();
    render(<AddCoveragePage />);
    if (visible) await user.click(screen.getByRole('button', { name: 'toggle SSN visibility' }));
    const input = screen.getByPlaceholderText('•••-••-••••');
    await user.click(input);
    await user.paste('123456789');
    expect(input).toHaveValue('123-45-6789');
    expect(input).toHaveAttribute('type', visible ? 'text' : 'password');
    return { user, input };
  };

  it('keeps the caret at the first digit after Backspace and allows replacement', async () => {
    const { user, input } = await setupSsn();
    input.setSelectionRange(1, 1);
    await user.keyboard('{Backspace}');
    expect(input).toHaveValue('234-56-789');
    expect(input.selectionStart).toBe(0);
    await user.keyboard('9');
    expect(input).toHaveValue('923-45-6789');
    expect(input.selectionStart).toBe(1);
  });

  it.each([
    [5, '{Backspace}', '123-56-789', 4],
    [4, '{Backspace}', '124-56-789', 2],
    [7, '{Backspace}', '123-46-789', 5],
    [3, '{Delete}', '123-56-789', 3],
    [6, '{Delete}', '123-45-789', 6],
  ])('deletes at position %s using %s without jumping to the end', async (position, key, expected, caret) => {
    const { user, input } = await setupSsn();
    input.setSelectionRange(position, position);
    await user.keyboard(key);
    expect(input).toHaveValue(expected);
    expect(input.selectionStart).toBe(caret);
  });

  it('preserves the caret after replacing a selected range and after invalid input', async () => {
    const { user, input } = await setupSsn();
    input.setSelectionRange(4, 6);
    await user.paste('98');
    expect(input).toHaveValue('123-98-6789');
    expect(input.selectionStart).toBe(6);
    await user.keyboard('x');
    expect(input).toHaveValue('123-98-6789');
    expect(input.selectionStart).toBe(6);
    await user.clear(input);
    expect(input).toHaveValue('');
    expect(input.selectionStart).toBe(0);
  });

  it.each([
    ['deleteContentBackward', '124-56-789', 2],
    ['deleteContentForward', '123-56-789', 3],
  ])('handles separator deletion without keydown (%s)', async (inputType, expected, caret) => {
    const { input } = await setupSsn();
    fireEvent.input(input, {
      target: { value: '12345-6789', selectionStart: 3, selectionEnd: 3 },
      inputType,
    });
    expect(input).toHaveValue(expected);
    expect(input.selectionStart).toBe(caret);
  });

  it('formats pasted digits, enforces nine digits, and sends digits only on save', async () => {
    mockPayerId = 'ABC12';
    const { user, input } = await setupSsn();
    await user.clear(input);
    await user.paste('234-56-789012');
    expect(input).toHaveValue('234-56-7890');
    expect(input.selectionStart).toBe(11);
    save();
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ subscriberSsn: '234567890' })));
  });
});
