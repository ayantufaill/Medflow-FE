import React from 'react';
import { Button } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput } from '../../../../components/reports/ui';

const RecareListFilters = () => {
  const topFilters = (
    <>
      <ReportSelect label="05/08/2026 — 06/08/2026" prefix="RANGE" defaultValue="05/08/2026 — 06/08/2026" width="274.76px" />
      <ReportSelect label="All Dentists" prefix="DENTIST" defaultValue="All Dentists" width="176.13px" />
      <ReportSelect label="All Hygienists" prefix="HYGIENIST" defaultValue="All Hygienists" width="203.53px" />
      <ReportSelect label="With or Without" prefix="FLAGS" defaultValue="With or Without" width="193.24px" />
      <ReportSearchInput placeholder="Search patient" width="224px" />
    </>
  );

  const topActions = (
    <Button 
      variant="contained" 
      size="small" 
      sx={{ 
        textTransform: 'none', 
        bgcolor: '#00BBAB', 
        borderRadius: '8px', 
        px: 2, 
        fontWeight: 600, 
        boxShadow: 'none', 
        whiteSpace: 'nowrap', 
        '&:hover': { bgcolor: '#00A395', boxShadow: 'none' } 
      }}
    >
      Regenerate Recare
    </Button>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Include Appointed" />
      <ReportCheckbox label="Show Flags in Report" defaultChecked />
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      topRowActions={topActions}
      bottomRowFilters={bottomFilters}
      onClearAll={() => console.log('Clear all')}
      onApplyFilters={() => console.log('Apply Filters')}
      onCreateTemplate={() => console.log('Create Template')}
      onPrint={() => window.print()}
      onExportCsv={() => console.log('Export CSV')}
    />
  );
};

export default RecareListFilters;
