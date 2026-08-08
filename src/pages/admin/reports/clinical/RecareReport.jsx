import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import RecareList from './RecareList';
import RecareMonthToDay from './RecareMonthToDay';
import RecareMonthly from './RecareMonthly';

const RecareReport = () => {
  const [view, setView] = useState('list'); // 'list', 'month-to-day', 'monthly'
  const [subtitle, setSubtitle] = useState('');

  const renderView = () => {
    switch (view) {
      case 'list':
        return <RecareList setSubtitle={setSubtitle} />;
      case 'month-to-day':
        return <RecareMonthToDay setSubtitle={setSubtitle} />;
      case 'monthly':
        return <RecareMonthly setSubtitle={setSubtitle} />;
      default:
        return <RecareList setSubtitle={setSubtitle} />;
    }
  };

  const handleTabChange = (event, newValue) => {
    setView(newValue);
  };

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Report Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5, color: '#1e293b' }}>
          Recare Report
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* View Toggle Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={view} 
          onChange={handleTabChange} 
          textColor="primary" 
          indicatorColor="primary"
        >
          <Tab label="Recare List" value="list" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' }} />
          <Tab label="Month-to-Day" value="month-to-day" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' }} />
          <Tab label="Monthly" value="monthly" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' }} />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box>
        {renderView()}
      </Box>
    </Box>
  );
};

export default RecareReport;
