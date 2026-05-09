import React from 'react';
import { Box, Typography, Grid, Paper, IconButton, Link as MuiLink } from '@mui/material';
import { Edit } from '@mui/icons-material';

const SavedReportCard = ({ title, count, reports = [] }) => {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: 350, 
        backgroundColor: '#f1f5f9', 
        boxShadow: 'none', 
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a3a6b' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
            {count} report/s
          </Typography>
          <IconButton size="small" sx={{ p: 0, color: '#94a3b8' }}>
            <Edit sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#3b82f6', 
              fontSize: '0.75rem', 
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            Re-order
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1,
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
      }}>
        {reports.map((report, index) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ 
              display: 'block', 
              mb: 1.5, 
              color: '#3b82f6', 
              fontSize: '0.8rem',
              cursor: 'pointer',
              lineHeight: 1.4,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {report}
          </Typography>
        ))}
        {reports.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
            No reports saved.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const SavedReports = () => {
  // ... data stays the same ...
  const dailyReports = [
    'Daily Adjustments - Total Office',
    'Daily Collection - Total Office',
    'Daily Collection By Provider',
    'Daily Collections - Default Doctor',
    'Daily Deposit Slip - Including Refunds and Deposits',
    'Daily Production - Default Doctor',
    'Daily Production - Total Office',
    'Daily Production and Collection Report - Grouped by Provider'
  ];

  const weeklyReports = [
    'Weekly Adjustments - Total Office',
    'Weekly Collection - Total Office',
    'Weekly Collection By Provider',
    'Weekly Collections - Default Doctor',
    'Weekly Deposit Slip - Including Refunds and Deposits',
    'Weekly Production - Default Doctor',
    'Weekly Production - Total Office',
    'Weekly Production and Collection Report - Grouped by Provider'
  ];

  const monthlyReports = [
    'Adjustment report grouped by adjustment type',
    'Monthly adjustments',
    'Monthly Adjustments - Total Office',
    'Monthly Collection - Total Office',
    'Monthly Collection By Provider',
    'Monthly Collections - Default Doctor',
    'Monthly Deposit Slip - Including Refunds and Deposits',
    'Monthly Production - Default Doctor',
    'Monthly Production - Total Office',
    'Monthly Production and Collection Report - Grouped by Provider',
    'Summary Collection Report',
    'Detailed Production Summary'
  ];

  const agingReports = [
    'AR for Active Patients - With or Without Open Claims',
    'AR for All Patients - With or Without Open Claims',
    'AR for Inactive Patients - With or Without Open Claims'
  ];

  const customReports = [
    'Courtesy Credit Report - To Date',
    'Credit Accounts Report - To Date',
    'Insurance coverages by Payer',
    'Referrals Top Dec 2025'
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#fff', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3a6b', mb: 6, fontSize: '1.25rem' }}>
        Saved Reports
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr'
        },
        gap: 4,
        alignItems: 'start'
      }}>
        <SavedReportCard title="Daily" count={8} reports={dailyReports} />
        <SavedReportCard title="Weekly" count={8} reports={weeklyReports} />
        <SavedReportCard title="Monthly" count={12} reports={monthlyReports} />
        <SavedReportCard title="Yearly" count={0} reports={[]} />
        <SavedReportCard title="Aging" count={3} reports={agingReports} />
        <SavedReportCard title="Custom" count={5} reports={customReports} />
      </Box>
    </Box>
  );
};

export default SavedReports;
