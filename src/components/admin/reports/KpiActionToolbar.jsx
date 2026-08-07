import React from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const KpiActionToolbar = ({ subTab, setSubTab, onPrint, onExportCSV }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '62px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1.5,
        px: 3,
        borderRadius: '12px',
        border: '1px solid #DFE5EC',
        bgcolor: '#FFFFFF',
        boxSizing: 'border-box',
        '@media print': {
          display: 'none',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tabs
          value={subTab}
          onChange={(e, val) => setSubTab(val)}
          sx={{
            minHeight: '36px',
            bgcolor: '#F1F5F9',
            borderRadius: '8px',
            p: 0.5,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: '28px',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '14px',
              color: '#64748B',
              px: 2,
              py: 0.5,
              borderRadius: '6px',
              transition: 'all 0.2s',
              '&:hover': {
                color: '#1A1A1A'
              },
              '&.Mui-selected': {
                color: '#FFFFFF',
                bgcolor: '#2362EF',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
              }
            }
          }}
        >
          <Tab value={0} label="Main Dashboard" disableRipple />
          <Tab value={1} label="Provider Dashboard" disableRipple />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          onClick={onExportCSV}
          variant="contained"
          size="small"
          startIcon={<FileDownloadIcon />}
          sx={{
            textTransform: 'none',
            bgcolor: '#3CA2E0',
            borderRadius: '8px',
            px: 2,
            boxShadow: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#2b8ac3', boxShadow: 'none' }
          }}
        >
          Export as CSV
        </Button>
        <Button
          onClick={onPrint}
          variant="outlined"
          size="small"
          startIcon={<PrintIcon />}
          sx={{
            textTransform: 'none',
            borderColor: '#3b82f6',
            color: '#3b82f6',
            borderRadius: '8px',
            px: 2,
            fontWeight: 600,
            '&:hover': {
              borderColor: '#2563eb',
              bgcolor: 'rgba(59, 130, 246, 0.04)'
            }
          }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default KpiActionToolbar;
