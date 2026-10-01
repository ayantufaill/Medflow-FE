import React from 'react';
import { TableCell, TableRow, Box, Typography, CircularProgress } from '@mui/material';
import { ReportLayout, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import OnlineSchedulingReferralFilters from '../../../../components/reports/patient/OnlineSchedulingReferralFilters';
import { useOnlineSchedulingReferral } from '../../../../hooks/reports/patient/useOnlineSchedulingReferral';

const OnlineSchedulingReferral = () => {
  const {
    reportData,
    loading,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = useOnlineSchedulingReferral();

  const columns = [
    { label: 'Referral' },
    { label: 'UTM Source' },
    { label: 'UTM Medium' },
    { label: 'UTM Campaign' },
    { label: 'Number of Clicks' },
  ];

  const renderRow = (row, index) => (
    <TableRow 
      key={index} 
      hover
      sx={{ 
        '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
        '&:hover': { backgroundColor: '#f1f5f9' }
      }}
    >
      <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.referral}</TableCell>
      <TableCell>{row.utmSource || '-'}</TableCell>
      <TableCell>{row.utmMedium || '-'}</TableCell>
      <TableCell>{row.utmCampaign || '-'}</TableCell>
      <TableCell>{row.clicks}</TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Online Scheduling Referral">
        <Box className="hide-on-print" sx={{ mb: 2 }}>
          <OnlineSchedulingReferralFilters 
            onApplyFilters={handleApply}
            onClearAll={handleClear}
          />
        </Box>

        {/* Summary Text and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
            (number of referrals = {reportData.length})
          </Typography>
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={handleExportCSV}
              onPrint={handlePrint}
              hasData={reportData.length > 0}
            />
          </Box>
        </Box>

        <Box id="online-referral-print-area">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ReportDataTable 
              columns={columns} 
              data={reportData} 
              renderRow={renderRow} 
            />
          )}
        </Box>
      </ReportLayout>
    </React.Fragment>
  );
};

export default OnlineSchedulingReferral;
