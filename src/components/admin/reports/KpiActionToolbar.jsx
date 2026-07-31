import React from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

const KpiActionToolbar = ({ subTab, setSubTab, onPrint, onExportCSV }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '62px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
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

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onPrint}
          startIcon={<PrintIcon sx={{ fontSize: 18 }} />}
          sx={{
            color: '#1A1A1A',
            borderColor: '#DFE5EC',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 400,
            borderRadius: '6px',
            height: '36px',
            px: 2,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#F8FAFC',
              borderColor: '#DFE5EC',
            }
          }}
        >
          Print
        </Button>
        <Button
          variant="contained"
          onClick={onExportCSV}
          startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          sx={{
            backgroundColor: '#2362EF',
            color: '#FFFFFF',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 400,
            borderRadius: '6px',
            height: '36px',
            px: 2,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1b4ecc',
              boxShadow: 'none'
            }
          }}
        >
          Export CSV
        </Button>
      </Box>
    </Box>
  );
};

export default KpiActionToolbar;
