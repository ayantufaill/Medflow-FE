import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NotesDrawer from './NotesDrawer';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { progressNoteService } from '../../../services/progress-note.service';
import { noteTemplateService } from '../../../services/note-template.service';
import { printNote } from './notePrint';

jest.mock('./notePrint', () => ({
  noteFields: jest.requireActual('./notePrint').noteFields,
  printNote: jest.fn(),
}));

jest.mock('react-redux', () => ({ useSelector: () => [], useDispatch: () => jest.fn() }));
jest.mock('../../../store/slices/providerSlice', () => ({ selectProviderDropdownList: jest.fn(), fetchAllProvidersForDropdown: jest.fn() }));
jest.mock('../edit-note/EditNoteForm', () => ({ patientId, providerId, onOpenActions }) => (
  <div>Clinical editor for {patientId} with provider {providerId}<button aria-label="Note actions" onClick={onOpenActions}>Actions</button></div>
));
jest.mock('../../../services/clinical-note.service', () => ({ clinicalNoteService: {
  getClinicalNotesByPatient: jest.fn(),
  getClinicalNoteById: jest.fn(),
  getHistory: jest.fn(),
  createClinicalNote: jest.fn(),
  updateClinicalNote: jest.fn(),
  signClinicalNote: jest.fn(),
} }));
jest.mock('../../../services/progress-note.service', () => ({ progressNoteService: {
  getAll: jest.fn(),
  getById: jest.fn(),
  getHistory: jest.fn(),
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
  clinicalNoteService.getHistory.mockResolvedValue([]);
  progressNoteService.getHistory.mockResolvedValue([]);
  printNote.mockResolvedValue();
});

it('keeps the full filter list and filters saved notes with removable selections', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '1', noteType: 'progress', structuredData: { title: 'Clinical allergy', tags: ['Allergy'] } },
    { _id: '2', noteType: 'progress', structuredData: { title: 'Clinical follow up', tags: ['Follow Up'] } },
  ], pagination: { pages: 1 } });
  progressNoteService.getAll.mockResolvedValue({ data: { notes: [
    { id: '3', title: 'General follow up', tags: ['Follow Up'], date: '2026-10-20T10:00:00Z' },
  ], pagination: { pages: 1 } } });

  renderDrawer();
  expect(await screen.findByText('3 results')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Filter notes' }));
  expect(screen.getByRole('menuitemcheckbox', { name: 'Clinical' })).toBeInTheDocument();
  expect(screen.getByRole('menuitemcheckbox', { name: 'General' })).toBeInTheDocument();
  expect(screen.getByRole('menuitemcheckbox', { name: 'Allergy' })).toBeInTheDocument();
  expect(screen.getByRole('menuitemcheckbox', { name: 'Birthday' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Clinical' }));
  expect(screen.getByText('2 results')).toBeInTheDocument();
  expect(screen.queryByText('General follow up')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'General' }));
  expect(screen.getByText('3 results')).toBeInTheDocument();
  expect(screen.getByText('General follow up')).toBeInTheDocument();

  fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
  fireEvent.click(document.querySelector('.MuiChip-deletable .MuiChip-deleteIcon'));
  expect(screen.getByText('1 result')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(screen.getByText('3 results')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
});

it('prints the saved record for the clicked note only', async () => {
  progressNoteService.getAll.mockResolvedValue({ data: { notes: [
    { id: '8', title: 'First', description: 'First text', date: '2026-10-16T10:00:00Z' },
    { id: '9', title: 'Second', description: 'Second text', date: '2026-10-17T10:00:00Z' },
  ], pagination: { pages: 1 } } });
  progressNoteService.getById.mockResolvedValue({ id: '8', patientId: '42', description: 'Saved full text' });
  renderDrawer();
  const firstCard = (await screen.findByText('First')).closest('.MuiPaper-root');
  fireEvent.click(firstCard.querySelector('button:last-child'));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Print' }));
  await waitFor(() => expect(progressNoteService.getById).toHaveBeenCalledWith('8'));
  expect(printNote).toHaveBeenCalledWith(expect.objectContaining({
    source: 'general', note: expect.objectContaining({ description: 'Saved full text' }),
  }));
});

it('loads real history for the clicked note and shows the saved change', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '5', noteType: 'progress', structuredData: { title: 'First clinical' } },
    { _id: '6', noteType: 'progress', structuredData: { title: 'Second clinical' } },
  ], pagination: { pages: 1 } });
  clinicalNoteService.getHistory.mockResolvedValue([{ id: '12', action: 'updated', actor: 'Dr. Test',
    occurredAt: '2026-10-17T10:00:00Z', oldValues: { content: 'Before' }, newValues: { content: 'After' } }]);
  renderDrawer();
  const secondCard = (await screen.findByText('Second clinical')).closest('.MuiPaper-root');
  fireEvent.click(secondCard.querySelector('button:last-child'));
  fireEvent.click(screen.getByRole('menuitem', { name: 'History' }));
  await waitFor(() => expect(clinicalNoteService.getHistory).toHaveBeenCalledWith('6'));
  expect(await screen.findByText('After')).toBeInTheDocument();
  expect(screen.queryByText('Zarria Sampson')).not.toBeInTheDocument();
});

it('opens a signed clinical note for reading without editable fields or Save', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '5', noteType: 'soap', isSigned: true, structuredData: { title: 'Signed clinical', content: 'Final clinical text' } },
  ], pagination: { pages: 1 } });
  renderDrawer();
  const card = (await screen.findByText('Signed clinical')).closest('.MuiPaper-root');
  fireEvent.click(card.querySelector('button:last-child'));
  expect(screen.getByRole('menuitem', { name: 'View' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('menuitem', { name: 'View' }));

  expect(screen.getByText('View Signed Note')).toBeInTheDocument();
  expect(screen.getByText('Final clinical text')).toBeInTheDocument();
  expect(screen.getByText('This note is signed and read-only.')).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  expect(clinicalNoteService.updateClinicalNote).not.toHaveBeenCalled();
});

it('opens a signed general note for reading', async () => {
  progressNoteService.getAll.mockResolvedValue({ data: { notes: [
    { id: '8', title: 'Signed general', description: 'Final general text', status: 'signed', date: '2026-10-20T10:00:00Z' },
  ], pagination: { pages: 1 } } });
  renderDrawer();
  const card = (await screen.findByText('Signed general')).closest('.MuiPaper-root');
  fireEvent.click(card);

  expect(screen.getByText('View Signed Note')).toBeInTheDocument();
  expect(screen.getByText('Final general text')).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  expect(progressNoteService.update).not.toHaveBeenCalled();
});

it('prints the saved signed note from its view menu', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '5', patientId: '42', noteType: 'soap', isSigned: true, structuredData: { title: 'Signed clinical', content: 'Final text' } },
  ], pagination: { pages: 1 } });
  clinicalNoteService.getClinicalNoteById.mockResolvedValue({
    id: '5', patientId: '42', isSigned: true, structuredData: { title: 'Signed clinical', content: 'Final text' },
  });
  renderDrawer();
  fireEvent.click((await screen.findByText('Signed clinical')).closest('.MuiPaper-root'));
  fireEvent.click(screen.getByRole('button', { name: 'Note actions' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Print' }));

  await waitFor(() => expect(printNote).toHaveBeenCalledWith(expect.objectContaining({
    note: expect.objectContaining({ id: '5', isSigned: true }),
  })));
});

it('shows the provider name instead of the editor user ID on signed notes', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '5', noteType: 'soap', isSigned: true, lastEditedBy: '1',
      providerId: { _id: '7', firstName: 'Ava', lastName: 'Stone' },
      structuredData: { title: 'Signed clinical', content: 'Final text' } },
  ], pagination: { pages: 1 } });
  renderDrawer();
  fireEvent.click((await screen.findByText('Signed clinical')).closest('.MuiPaper-root'));

  expect(screen.getByText('Provider: Ava Stone')).toBeInTheDocument();
  expect(screen.queryByText('1')).not.toBeInTheDocument();
});

it('shows the signer name when a signed note has no linked provider', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '5', noteType: 'soap', isSigned: true, lastEditedBy: '1',
      signedBy: { _id: '1', firstName: 'Sam', lastName: 'Rivera' },
      structuredData: { title: 'Signed clinical', content: 'Final text' } },
  ], pagination: { pages: 1 } });
  renderDrawer();
  fireEvent.click((await screen.findByText('Signed clinical')).closest('.MuiPaper-root'));

  expect(screen.getByText('Signed by: Sam Rivera')).toBeInTheDocument();
  expect(screen.queryByText('1')).not.toBeInTheDocument();
});

it('opens the same note actions from the clinical edit view', async () => {
  clinicalNoteService.getClinicalNotesByPatient.mockResolvedValue({ clinicalNotes: [
    { _id: '5', noteType: 'progress', structuredData: { title: 'Editable clinical', content: 'Saved text' } },
  ], pagination: { pages: 1 } });
  clinicalNoteService.getHistory.mockResolvedValue([{ id: '12', action: 'updated', actor: 'Dr. Test',
    newValues: { content: 'Saved text' } }]);
  renderDrawer();
  fireEvent.click((await screen.findByText('Editable clinical')).closest('.MuiPaper-root'));
  fireEvent.click(screen.getByRole('button', { name: 'Note actions' }));
  expect(screen.getByRole('menuitem', { name: 'Print' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('menuitem', { name: 'History' }));
  await waitFor(() => expect(clinicalNoteService.getHistory).toHaveBeenCalledWith('5'));
  expect(await screen.findByText('Saved text')).toBeInTheDocument();
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
    title: '', tags: [],
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

