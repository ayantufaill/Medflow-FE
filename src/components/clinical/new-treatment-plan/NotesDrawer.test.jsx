import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NotesDrawer from './NotesDrawer';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { progressNoteService } from '../../../services/progress-note.service';
import { noteTemplateService } from '../../../services/note-template.service';

jest.mock('react-redux', () => ({ useSelector: () => [], useDispatch: () => jest.fn() }));
jest.mock('../../../store/slices/providerSlice', () => ({ selectProviderDropdownList: jest.fn() }));
jest.mock('../edit-note/EditNoteForm', () => ({ patientId, providerId }) => (
  <div>Clinical editor for {patientId} with provider {providerId}</div>
));
jest.mock('../../../services/clinical-note.service', () => ({ clinicalNoteService: {
  getClinicalNotesByPatient: jest.fn(),
  createClinicalNote: jest.fn(),
  updateClinicalNote: jest.fn(),
  signClinicalNote: jest.fn(),
} }));
jest.mock('../../../services/progress-note.service', () => ({ progressNoteService: {
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
} }));
jest.mock('../../../services/note-template.service', () => ({ noteTemplateService: {
  getActiveTemplates: jest.fn(),
} }));

const renderDrawer = () => render(
  <NotesDrawer open onClose={() => {}} patientName="Test Patient" patientId="42" providerId="7" appointmentId="9" />
);

beforeEach(() => {
  jest.clearAllMocks();
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [], pagination: { pages: 1 } });
  progressNoteService.getAll.mockResolvedValue({ data: { notes: [], pagination: { pages: 1 } } });
  noteTemplateService.getActiveTemplates.mockResolvedValue({ noteTemplates: [] });
  progressNoteService.create.mockResolvedValue({});
  clinicalNoteService.createClinicalNote.mockResolvedValue({});
  clinicalNoteService.signClinicalNote.mockResolvedValue({});
});

it('opens the app menu and saves a general note for the selected patient', async () => {
  progressNoteService.getAll
    .mockResolvedValueOnce({ data: { notes: [], pagination: { pages: 1 } } })
    .mockResolvedValueOnce({ data: { notes: [{ id: '8', category: 'General Notes', description: 'Patient called about care.', date: '2026-10-16T10:00:00Z' }], pagination: { pages: 1 } } });
  renderDrawer();
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  expect(await screen.findByRole('menuitem', { name: 'Blank' })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: 'Clinical Note' })).toBeInTheDocument();
  expect(screen.getByText('Clinical Note Templates')).toBeInTheDocument();
  ['Exam - Emergency Trauma', 'Exam - Hygiene', 'Exam - Limited', 'Failed TX', 'Frenectomy consult', 'Frenectomy procedure', 'Frenectomy follow up'].forEach((name) => {
    expect(screen.getByRole('menuitem', { name })).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole('menuitem', { name: 'General Note' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Note' }), { target: { value: 'Patient called about care.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
  await waitFor(() => expect(progressNoteService.create).toHaveBeenCalledWith({
    patientId: '42', providerId: '7', category: 'General Notes', description: 'Patient called about care.',
  }));
  await waitFor(() => expect(progressNoteService.getAll).toHaveBeenCalledTimes(2));
  expect(await screen.findByText('Patient called about care.')).toBeInTheDocument();
});

it('lists saved clinical and general notes and opens the clinical editor with real IDs', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({
    clinicalNotes: [{ _id: '5', noteType: 'progress', structuredData: { procedureAccomplished: 'Clinical work saved' }, updatedAt: '2026-10-15T10:00:00Z' }],
    pagination: { pages: 1 },
  });
  progressNoteService.getAll.mockResolvedValue({
    data: { notes: [{ id: '6', category: 'General Notes', description: 'General text saved', date: '2026-10-15T11:00:00Z' }], pagination: { pages: 1 } },
  });
  renderDrawer();
  expect(await screen.findByText('Clinical work saved')).toBeInTheDocument();
  expect(screen.getByText('General text saved')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Clinical work saved'));
  expect(screen.getByText('Clinical editor for 42 with provider 7')).toBeInTheDocument();
});

it('opens the clinical note form from the plus menu', async () => {
  renderDrawer();
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Clinical Note' }));
  expect(screen.getByText('Create Clinical Note')).toBeInTheDocument();
  expect(screen.getByText('Clinical editor for 42 with provider 7')).toBeInTheDocument();
});

it('prefills saved custom template fields and persists their values', async () => {
  noteTemplateService.getActiveTemplates.mockResolvedValue({ noteTemplates: [{
    _id: '12', name: 'Exam - Limited',
    templateStructure: { fields: [{ id: 'field_1', label: 'Hygiene findings', type: 'textarea', required: true }] },
    defaultContent: { field_1: 'Saved template text' },
  }] });
  renderDrawer();
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Exam - Limited' })).toBeEnabled());
  fireEvent.click(screen.getByRole('menuitem', { name: 'Exam - Limited' }));
  expect(screen.getByRole('textbox', { name: 'Hygiene findings' })).toHaveValue('Saved template text');
  fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
  await waitFor(() => expect(clinicalNoteService.createClinicalNote).toHaveBeenCalledWith(expect.objectContaining({
    patientId: '42', providerId: '7', noteType: 'soap', templateId: '12',
    structuredData: expect.objectContaining({ templateFields: [expect.objectContaining({ id: 'field_1', value: 'Saved template text' })] }),
  })));
});

it('does not save a general note without a real provider', async () => {
  render(<NotesDrawer open onClose={() => {}} patientId="42" />);
  await screen.findByText('No notes match the current filters');
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Exam - Hygiene' })).toBeEnabled());
  fireEvent.click(screen.getByRole('menuitem', { name: 'General Note' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Note' }), { target: { value: 'Needs review' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
  expect(screen.getByText('A valid patient and provider are required to save this note.')).toBeInTheDocument();
  expect(progressNoteService.create).not.toHaveBeenCalled();
});

it('saves every selected trauma field and reopens the dedicated form', async () => {
  const saved = {
    _id: '91', noteType: 'soap', structuredData: {
      formType: 'emergencyTrauma', templateName: 'Exam - Emergency Trauma',
      emergencyTrauma: { chiefComplaint: 'Tooth injury', examType: 'LOE', presentedWith: ['MOC'], asaStatus: 'II', treatmentWith: 'Nitrous oxide' },
    },
  };
  clinicalNoteService.createClinicalNote.mockResolvedValue({ _id: '91' });
  clinicalNoteService.getClinicalNotesByPatient
    .mockResolvedValueOnce({ clinicalNotes: [], pagination: { pages: 1 } })
    .mockResolvedValue({ clinicalNotes: [saved], pagination: { pages: 1 } });
  renderDrawer();
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Exam - Emergency Trauma' }));
  expect(screen.getByRole('textbox', { name: 'Trauma History' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Pain History' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'EOE/IOE Findings' })).toBeInTheDocument();
  expect(screen.getByText('Pitt Dental')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: 'Chief Complaint' }), { target: { value: 'Tooth injury' } });
  fireEvent.click(screen.getByRole('radio', { name: 'LOE' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'MOC' }));
  fireEvent.click(screen.getByRole('radio', { name: 'II' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Nitrous oxide' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
  await waitFor(() => expect(clinicalNoteService.createClinicalNote).toHaveBeenCalledWith(expect.objectContaining({
    patientId: '42', providerId: '7', noteType: 'soap',
    structuredData: expect.objectContaining({ formType: 'emergencyTrauma', emergencyTrauma: expect.objectContaining({ chiefComplaint: 'Tooth injury', examType: 'LOE', presentedWith: ['MOC'], asaStatus: 'II', treatmentWith: 'Nitrous oxide' }) }),
  })));
  expect(await screen.findByText('Tooth injury')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Tooth injury'));
  expect(screen.getByRole('textbox', { name: 'Chief Complaint' })).toHaveValue('Tooth injury');
  expect(screen.getByRole('radio', { name: 'LOE' })).toBeChecked();
});

it('signs the saved trauma note when Complete is selected', async () => {
  clinicalNoteService.createClinicalNote.mockResolvedValue({ _id: '92' });
  renderDrawer();
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Exam - Emergency Trauma' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Chief Complaint' }), { target: { value: 'Injury' } });
  fireEvent.click(screen.getByRole('checkbox', { name: 'Complete' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
  await waitFor(() => expect(clinicalNoteService.signClinicalNote).toHaveBeenCalledWith('92'));
});

it('saves every selected hygiene field and reopens the dedicated form', async () => {
  const saved = {
    _id: '95', noteType: 'soap', structuredData: {
      formType: 'hygiene', templateName: 'Exam - Hygiene',
      hygiene: { appt: 'Periodic exam', panoramicXrayTaken: 'Yes', rightMolar: 'Class 1', complete: false },
    },
  };
  clinicalNoteService.createClinicalNote.mockResolvedValue({ _id: '95' });
  clinicalNoteService.getClinicalNotesByPatient
    .mockResolvedValueOnce({ clinicalNotes: [], pagination: { pages: 1 } })
    .mockResolvedValue({ clinicalNotes: [saved], pagination: { pages: 1 } });
  renderDrawer();
  fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Exam - Hygiene' }));
  expect(screen.getByRole('radio', { name: 'Periodic exam' })).toBeInTheDocument();
  expect(screen.getByText('Was occlusion deferred?')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('radio', { name: 'Periodic exam' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(clinicalNoteService.createClinicalNote).toHaveBeenCalledWith(expect.objectContaining({
    patientId: '42', providerId: '7', noteType: 'soap',
    structuredData: expect.objectContaining({ formType: 'hygiene', hygiene: expect.objectContaining({ appt: 'Periodic exam' }) }),
  })));
});

