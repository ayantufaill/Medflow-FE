import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { ReportLayout } from '../../../../components/reports/ui';

const SavedReportCard = ({ title, count, reports = [] }) => {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: 350, 
        backgroundColor: '#f8f9fa', 
        boxShadow: 'none', 
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', fontWeight: 500 }}>
            {count} report/s
          </Typography>
          <IconButton size="small" sx={{ p: 0, color: '#999' }}>
            <Edit sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#337ab7', 
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
        '&::-webkit-scrollbar': { width: '6px' },
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
              color: '#337ab7', 
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
          <Typography variant="body2" sx={{ color: '#999', fontSize: '0.8rem', fontStyle: 'italic' }}>
            No reports saved.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const SavedReports = () => {
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
    <ReportLayout title="Saved Reports">
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr'
        },
        gap: 3,
        alignItems: 'start',
        mt: 2
      }}>
        <SavedReportCard title="Daily" count={8} reports={dailyReports} />
        <SavedReportCard title="Weekly" count={8} reports={weeklyReports} />
        <SavedReportCard title="Monthly" count={12} reports={monthlyReports} />
        <SavedReportCard title="Yearly" count={0} reports={[]} />
        <SavedReportCard title="Aging" count={3} reports={agingReports} />
        <SavedReportCard title="Custom" count={5} reports={customReports} />
      </Box>
    </ReportLayout>
  );
};

export default SavedReports;
