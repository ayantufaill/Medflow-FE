import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';

const ProgressNotesActions = ({ onRefresh, onExport, onPrint }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 2, mt: 1, gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton 
          size="small" 
          onClick={onRefresh}
          sx={{ color: '#0ea5e9', '&:hover': { backgroundColor: 'rgba(14, 165, 233, 0.08)' } }}
        >
          <RefreshIcon />
        </IconButton>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<FileDownloadIcon />} 
          onClick={onExport}
          sx={{ textTransform: 'none', bgcolor: '#3CA2E0', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2b8ac3', boxShadow: 'none' } }}
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
