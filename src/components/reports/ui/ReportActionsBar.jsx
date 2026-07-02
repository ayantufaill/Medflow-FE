import React from 'react';
import { Box, Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

const ReportActionsBar = ({ onExportCsv, onPrint, customLeftActions, customRightActions }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {customLeftActions}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {customRightActions}
        {onExportCsv && (
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<FileDownloadOutlinedIcon />} 
            onClick={onExportCsv}
            sx={{ textTransform: 'none', bgcolor: '#2362EF', '&:hover': { bgcolor: '#1a4bbd' } }}
          >
            Export as CSV
          </Button>
        )}
        {onPrint && (
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<PrintOutlinedIcon />} 
            onClick={onPrint}
            sx={{ textTransform: 'none', bgcolor: '#00BBAB', '&:hover': { bgcolor: '#009b8e' } }}
          >
            Print
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ReportActionsBar;
