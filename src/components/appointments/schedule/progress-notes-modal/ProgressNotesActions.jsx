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
          sx={{ color: '#2362EF', '&:hover': { backgroundColor: 'rgba(35, 98, 239, 0.08)' } }}
        >
          <RefreshIcon />
        </IconButton>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<FileDownloadIcon />} 
          onClick={onExport}
          sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#1a50cc', boxShadow: 'none' } }}
        >
          Export as CSV
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<PrintIcon />} 
          onClick={onPrint}
          sx={{ textTransform: 'none', borderColor: '#2362EF', color: '#2362EF', borderRadius: '8px', px: 2, fontWeight: 600, '&:hover': { borderColor: '#1a50cc', backgroundColor: 'rgba(35, 98, 239, 0.04)' } }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default ProgressNotesActions;
