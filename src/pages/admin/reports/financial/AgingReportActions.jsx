import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const AgingReportActions = ({ hidePatientNames, setHidePatientNames }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', pt: 0 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f8fafc', color: '#1e293b', borderRadius: '8px', px: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#e2e8f0', boxShadow: 'none' } }}>
          Generate Batch Statement
        </Button>
        <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#14b8a6', borderRadius: '8px', px: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#0d9488', boxShadow: 'none' } }}>
          View Generated Statements
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControlLabel 
          control={
            <Checkbox 
              size="small" 
              icon={<RadioButtonUncheckedIcon sx={{ color: '#3b82f6' }} />} 
              checkedIcon={<RadioButtonUncheckedIcon sx={{ color: '#2563eb' }} />}
              checked={hidePatientNames} 
              onChange={(e) => setHidePatientNames(e.target.checked)} 
            />
          } 
          label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>Hide Patient Names</Typography>} 
        />
        <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#3b82f6', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600 }}>
          Export as CSV
        </Button>
        <Button variant="outlined" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600 }}>
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default AgingReportActions;
