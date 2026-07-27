import React from 'react';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const ProductionReportActions = ({ onExportCsv, onPrint }) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: "right", alignItems: "center", gap: 1, mb: 2 }}>
      <Button 
        onClick={onExportCsv} 
        variant="contained" 
        size="small" 
        startIcon={<FileDownloadIcon />} 
        sx={{ textTransform: 'none', bgcolor: '#3CA2E0', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2b8ac3', boxShadow: 'none' } }}
      >
        Export as CSV
      </Button>
      <Button 
        onClick={onPrint} 
        variant="outlined" 
        size="small" 
        startIcon={<PrintIcon />} 
        sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600 }}
      >
        Print
      </Button>
    </Box>
  );
};

export default ProductionReportActions;
