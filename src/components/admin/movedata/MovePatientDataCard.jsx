import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, TextField } from '@mui/material';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

const MovePatientDataCard = ({
  fromPatient,
  setFromPatient,
  toPatient,
  setToPatient,
  patientChecklist,
  handlePatientCheckboxChange,
  handleMovePatientData
}) => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      minHeight: '475px',
      borderRadius: '10px',
      border: '1px solid #E2E8F0',
      bgcolor: '#FFFFFF',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{
        width: '100%',
        height: '40px',
        bgcolor: '#F2F6FC',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        px: 2
      }}>
        <FileCopyOutlinedIcon sx={{ color: '#2F6FED', fontSize: '1.2rem', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#11223F', fontSize: '12px' }}>
          MOVE PATIENT DATA
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
        {/* From Patient */}
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', mb: 0.5 }}>
            From Patient
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter Patient Name"
            value={fromPatient}
            onChange={(e) => setFromPatient(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { fontSize: '14px', py: 1 },
              '& .MuiOutlinedInput-root': { borderRadius: '8px' }
            }}
          />
        </Box>

        {/* To Patient */}
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', mb: 0.5 }}>
            To Patient
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter Patient Name"
            value={toPatient}
            onChange={(e) => setToPatient(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { fontSize: '14px', py: 1 },
              '& .MuiOutlinedInput-root': { borderRadius: '8px' }
            }}
          />
        </Box>

        {/* Checklist */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mt: 1 }}>
          {[
            { key: 'medicalHistory', label: 'Medical and Dental History' },
            { key: 'notes', label: 'Notes' },
            { key: 'insurance', label: 'Insurance' },
            { key: 'billing', label: 'Billing' },
            { key: 'treatmentPlan', label: 'Treatment Plan' },
            { key: 'exam', label: 'Exam' }
          ].map((item) => (
            <FormControlLabel
              key={item.key}
              control={
                <Checkbox
                  size="small"
                  checked={patientChecklist[item.key]}
                  onChange={() => handlePatientCheckboxChange(item.key)}
                  sx={{
                    color: '#D1D5DB',
                    '&.Mui-checked': { color: '#2F6FED' },
                    py: 0.5
                  }}
                />
              }
              label={
                <Typography 
                  sx={{ 
                    fontSize: '14px', 
                    color: patientChecklist[item.key] ? '#2F6FED' : '#11223F' 
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
          ))}
        </Box>

        {/* Action Button - Pushed to bottom */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 2 }}>
          <Button
            variant="contained"
            onClick={handleMovePatientData}
            sx={{
              bgcolor: '#2F6FED',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#2558be',
                boxShadow: 'none'
              }
            }}
          >
            Move Patient Data
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MovePatientDataCard;
