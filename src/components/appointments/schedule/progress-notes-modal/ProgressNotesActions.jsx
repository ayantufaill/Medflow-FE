import React from 'react';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';

const ProgressNotesActions = ({ onRefresh, onExport, onPrint }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 2, mt: 1, gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<RefreshIcon />} 
          onClick={onRefresh}
          sx={{ textTransform: 'none', bgcolor: '#0ea5e9', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#0284c7' } }}
        >
          Refresh
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<FileDownloadIcon />} 
          onClick={onExport}
          sx={{ textTransform: 'none', bgcolor: '#3b82f6', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2563eb' } }}
        >
          Export as CSV
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<PrintIcon />} 
          onClick={onPrint}
          sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600 }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default ProgressNotesActions;
