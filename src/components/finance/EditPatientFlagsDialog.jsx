import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Checkbox, 
  Button
} from '@mui/material';
import Grid from '@mui/material/Grid';

const EditPatientFlagsDialog = ({ onClose }) => {
  const [flags, setFlags] = useState({});
  
  const modalHeader = '#7b8ab8';
  const labelGrey = '#333';
  const footerGrey = '#555';

  const handleFlagToggle = (flagLabel) => {
    setFlags(prev => ({
      ...prev,
      [flagLabel]: !prev[flagLabel]
    }));
  };

  const billingFlags = [
    { color: '#7dab9f', label: 'alert' },
    { color: '#5e5ba8', label: 'old patient' },
    { color: '#bc6c73', label: 'family & friends' },
    { color: '#d9975b', label: 'late payment' },
    { color: '#88b7d6', label: 'needs special care' },
    { color: '#a6f272', label: 'TDS Member' },
    { color: '#eef681', label: 'Botox/Filler' },
  ];

  const patientFlags = [
    { color: '#cf5dbd', label: 'Bioclear Patient' },
    { color: '#4d39c0', label: 'Ortho Patient' },
    { color: '#d3562f', label: 'Balance Owed' },
  ];

  const activeFlagsCount = Object.values(flags).filter(Boolean).length;

  return (
    <Box sx={{ width: '100%', maxWidth: 800, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: modalHeader, py: 1.5, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>
          Edit Patient Flags
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column: Patient Communication */}
          <Grid item xs={12} sm={5}>
            <Typography sx={{ fontWeight: 'bold', mb: 1, color: labelGrey, fontSize: '0.85rem' }}>
              Patient Communication
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Checkbox 
                size="small" 
                checked={flags['appointment_reminder'] || false}
                onChange={() => handleFlagToggle('appointment_reminder')}
                sx={{ p: 0.5, mt: -0.5 }} 
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 24, bgcolor: '#94bc74', borderRadius: '2px', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                  Send appointment reminder earlier than scheduled time
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Billing & Patient */}
          <Grid item xs={12} sm={7}>
            {/* Billing Section */}
            <Typography sx={{ fontWeight: 'bold', mb: 1, color: labelGrey, fontSize: '0.85rem' }}>
              Billing
            </Typography>
            
            {billingFlags.map((flag) => (
              <Box key={flag.label} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={flags[flag.label] || false}
                  onChange={() => handleFlagToggle(flag.label)}
                  sx={{ p: 0.5, mr: 1 }} 
                />
                <Box sx={{ width: 28, height: 28, bgcolor: flag.color, borderRadius: '2px', mr: 2, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem' }}>{flag.label}</Typography>
              </Box>
            ))}

            {/* Patient Section */}
            <Typography sx={{ fontWeight: 'bold', mt: 2, mb: 1, color: labelGrey, fontSize: '0.85rem' }}>
              Patient
            </Typography>

            {patientFlags.map((flag) => (
              <Box key={flag.label} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={flags[flag.label] || false}
                  onChange={() => handleFlagToggle(flag.label)}
                  sx={{ p: 0.5, mr: 1 }} 
                />
                <Box sx={{ width: 28, height: 28, bgcolor: flag.color, borderRadius: '2px', mr: 2, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem' }}>{flag.label}</Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Footer Text */}
        <Typography sx={{ mt: 4, fontSize: '0.75rem', color: footerGrey }}>
          You can add up to 15 flags per patient. {activeFlagsCount} flag{activeFlagsCount !== 1 ? 's' : ''} selected.
        </Typography>
      </Box>
    </Box>
  );
};

export default EditPatientFlagsDialog;
