import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MovePatientDataCard from '../../components/admin/movedata/MovePatientDataCard';
import MoveProviderDataCard from '../../components/admin/movedata/MoveProviderDataCard';

const MoveData = () => {
  // Left Column (Patient) state
  const [fromPatient, setFromPatient] = useState('');
  const [toPatient, setToPatient] = useState('');
  const [patientChecklist, setPatientChecklist] = useState({
    medicalHistory: false,
    notes: true,
    insurance: true,
    billing: true,
    treatmentPlan: true,
    exam: true,
  });

  // Right Column (Provider) state
  const [fromProvider, setFromProvider] = useState('Select Provider');
  const [toProvider, setToProvider] = useState('Select Provider');

  const handlePatientCheckboxChange = (name) => {
    setPatientChecklist(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleMovePatientData = () => {
    alert(`Moving patient data from "${fromPatient}" to "${toPatient}"...`);
  };

  const handleMoveProviderData = () => {
    alert(`Moving provider future data from "${fromProvider}" to "${toProvider}"...`);
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#FBFCFE', 
        borderRadius: '12px', 
        border: '1px solid #e0e0e0', 
        p: { xs: 2, sm: 3, md: 4 },
        fontFamily: '"Segoe UI", sans-serif'
      }}
    >
      {/* --- HEADER SECTION --- */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#11223F">
          Move Data
        </Typography>
      </Box>

      {/* Side-by-side Cards Container */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Left Column: Move Patient Data */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' }, maxWidth: '565px' }}>
          <MovePatientDataCard 
            fromPatient={fromPatient}
            setFromPatient={setFromPatient}
            toPatient={toPatient}
            setToPatient={setToPatient}
            patientChecklist={patientChecklist}
            handlePatientCheckboxChange={handlePatientCheckboxChange}
            handleMovePatientData={handleMovePatientData}
          />
        </Box>

        {/* Right Column: Move Provider Future Data */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' }, maxWidth: '565px' }}>
          <MoveProviderDataCard 
            fromProvider={fromProvider}
            setFromProvider={setFromProvider}
            toProvider={toProvider}
            setToProvider={setToProvider}
            handleMoveProviderData={handleMoveProviderData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MoveData;
