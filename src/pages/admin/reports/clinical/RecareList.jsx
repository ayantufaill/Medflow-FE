import React from 'react';
import { Box } from '@mui/material';
import RecareListFilters from './RecareListFilters';
import RecareListTable from './RecareListTable';

const RecareList = () => {
  // Mock data for the table
  const rows = [
    {
      id: 1,
      patient: 'Patient A',
      flags: 'red',
      age: 37,
      contact: '(555) 123-4567',
      recallDate: '05/24/2026',
      lastExam: '02/24/2026',
      lastProphy: '02/24/2026',
      lastMaintenance: '',
      lastComm: '',
      note: 'left message to schedule recare apt',
      contactAgain: 'Y',
      followUp: '',
      apptDate: '',
      contactCount: 1
    },
    {
      id: 2,
      patient: 'Patient B',
      flags: '',
      age: 54,
      contact: '(555) 987-6543',
      recallDate: '05/18/2026',
      lastExam: '11/18/2025',
      lastProphy: '11/18/2025',
      lastMaintenance: '',
      lastComm: '',
      note: '',
      contactAgain: 'Y',
      followUp: '',
      apptDate: '',
      contactCount: 0
    },
    {
      id: 3,
      patient: 'Patient C',
      flags: '',
      age: 44,
      contact: '(555) 456-7890',
      recallDate: '05/13/2026',
      lastExam: '11/13/2025',
      lastProphy: '11/13/2025',
      lastMaintenance: '',
      lastComm: '',
      note: '',
      contactAgain: 'Y',
      followUp: '',
      apptDate: '',
      contactCount: 0
    }
  ];

  return (
    <Box>
      <RecareListFilters />
      <RecareListTable rows={rows} />
    </Box>
  );
};

export default RecareList;
