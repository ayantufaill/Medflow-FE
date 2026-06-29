import React, { useState } from 'react';
import { Box, Typography, Button, ButtonGroup, useTheme } from '@mui/material';
import RecareList from './RecareList';
import RecareMonthToDay from './RecareMonthToDay';
import RecareMonthly from './RecareMonthly';

const RecareReport = () => {
  const theme = useTheme();
  const [view, setView] = useState('list'); // 'list', 'month-to-day', 'monthly'

  const renderView = () => {
    switch (view) {
      case 'list':
        return <RecareList />;
      case 'month-to-day':
        return <RecareMonthToDay />;
      case 'monthly':
        return <RecareMonthly />;
      default:
        return <RecareList />;
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Report Title */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700, color: '#1e293b' }}>
          Recare Report
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>
          {view === 'list' 
            ? "Patients due for their recare between 05/08/2026 and 06/08/2026"
            : "Select a date range to view recare statistics"}
        </Typography>
      </Box>

      {/* View Toggle Buttons */}
      <Box sx={{ display: 'flex', backgroundColor: '#fef3c7', p: 0.5, borderRadius: '24px', width: 'fit-content', mb: 3 }}>
        <Button 
          onClick={() => setView('list')}
          sx={{ 
            backgroundColor: view === 'list' ? '#f59e0b' : 'transparent',
            color: view === 'list' ? '#fff' : '#92400e',
            '&:hover': { backgroundColor: view === 'list' ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)' },
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 0.5,
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          Recare List
        </Button>
        <Button 
          onClick={() => setView('month-to-day')}
          sx={{ 
            backgroundColor: view === 'month-to-day' ? '#f59e0b' : 'transparent',
            color: view === 'month-to-day' ? '#fff' : '#92400e',
            '&:hover': { backgroundColor: view === 'month-to-day' ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)' },
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 0.5,
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          Month-to-day
        </Button>
        <Button 
          onClick={() => setView('monthly')}
          sx={{ 
            backgroundColor: view === 'monthly' ? '#f59e0b' : 'transparent',
            color: view === 'monthly' ? '#fff' : '#92400e',
            '&:hover': { backgroundColor: view === 'monthly' ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)' },
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 0.5,
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          Monthly
        </Button>
      </Box>

      {/* Content Area */}
      <Box>
        {renderView()}
      </Box>
    </Box>
  );
};

export default RecareReport;
