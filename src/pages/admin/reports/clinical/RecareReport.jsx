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
    <Box>
      {/* View Toggle Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, position: 'relative' }}>
        <ButtonGroup variant="contained" sx={{ backgroundColor: '#d1a066' }}>
          <Button 
            onClick={() => setView('list')}
            sx={{ 
              backgroundColor: view === 'list' ? '#b88a52' : '#d1a066',
              '&:hover': { backgroundColor: '#b88a52' },
              textTransform: 'none',
              px: 3
            }}
          >
            Recare List
          </Button>
          <Button 
            onClick={() => setView('month-to-day')}
            sx={{ 
              backgroundColor: view === 'month-to-day' ? '#b88a52' : '#d1a066',
              '&:hover': { backgroundColor: '#b88a52' },
              textTransform: 'none',
              px: 3
            }}
          >
            Month-to-day
          </Button>
          <Button 
            onClick={() => setView('monthly')}
            sx={{ 
              backgroundColor: view === 'monthly' ? '#b88a52' : '#d1a066',
              '&:hover': { backgroundColor: '#b88a52' },
              textTransform: 'none',
              px: 3
            }}
          >
            Monthly
          </Button>
        </ButtonGroup>

        <Button 
          variant="contained" 
          sx={{ 
            position: 'absolute', 
            right: 0, 
            backgroundColor: '#d1a066',
            '&:hover': { backgroundColor: '#b88a52' },
            textTransform: 'none'
          }}
        >
          Regenerate Recare
        </Button>
      </Box>

      {/* Report Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={600} color="#1a3a6b">
          Recare Report
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {view === 'list' 
            ? "Patients due for their recare between 05/08/2026 and 06/08/2026"
            : ""}
        </Typography>
      </Box>

      {/* Content Area */}
      <Box>
        {renderView()}
      </Box>
    </Box>
  );
};

export default RecareReport;
