import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput } from '../../../../components/reports/ui';

const CourtesyCreditModifications = () => {
  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Start Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', borderBottom: '1px solid #ccc', pb: 0.5, mr: 2 }}>05/08/2026</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>End Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', borderBottom: '1px solid #ccc', pb: 0.5, mr: 2 }}>05/08/2026</Typography>
      </Box>
      <ReportSelect defaultValue="all" prefix="Filter by Adjustment Type:" options={[{ value: 'all', label: 'All' }]} width="200px" />
      <ReportSelect defaultValue="all" prefix="Filter by Action:" options={[{ value: 'all', label: 'All' }]} width="160px" />
      <ReportSelect defaultValue="all" prefix="Filter by Patients:" options={[{ value: 'all', label: 'All' }]} width="160px" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSelect defaultValue="pts" prefix="Filter by Flags:" options={[{ value: 'pts', label: 'Patients with or without flags' }]} width="240px" />
      <ReportSelect defaultValue="all" prefix="Filter by Users:" options={[{ value: 'all', label: 'All' }]} width="160px" />
      <ReportCheckbox label="Group By Adjustment Type" />
      <ReportSearchInput placeholder="Search by patient name" width="300px" />
    </>
  );

  return (
    <ReportLayout title="Courtesy Credit Modifications Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />
    </ReportLayout>
  );
};

export default CourtesyCreditModifications;
