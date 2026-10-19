import React from 'react';
import { render, screen } from '@testing-library/react';
import EditNoteForm from './EditNoteForm';

jest.mock('react-redux', () => {
  const providers = [];
  return { useSelector: () => providers };
});
jest.mock('../../../store/slices/providerSlice', () => ({ selectProviderDropdownList: jest.fn() }));
jest.mock('../../../services/provider.service', () => ({ providerService: {} }));
jest.mock('../../../services/clinical-note.service', () => ({ clinicalNoteService: {} }));
jest.mock('../../../services/clinical-exam.service', () => ({ clinicalExamService: {} }));

it('opens a clinical note for the selected patient without crashing while preparing defaults', () => {
  render(
    <EditNoteForm
      view="create"
      patientId="42"
      providerId="7"
      currentPatient={{ _id: '42', firstName: 'Test', lastName: 'Patient', gender: 'Female' }}
      selectedProcedures={[{ code: 'D0120', description: 'Periodic exam', provider: '7', site: '-' }]}
    />
  );

  expect(screen.getByText('Restorative - Extractions')).toBeInTheDocument();
  expect(screen.getByText('Clinical')).toBeInTheDocument();
});
