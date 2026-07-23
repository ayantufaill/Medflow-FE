import React from 'react';
import { Box } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportCheckbox } from '../ui';

const CreditAccountsReportFilters = ({
  filter, setFilter,
  includeInactive, setIncludeInactive,
  groupByCredit, setGroupByCredit,
  handleApply, handleClear
}) => {
  const topFilters = (
    <>
      <ReportSelect 
        label="PATIENTS" 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        options={[
          { value: 'All patients', label: 'All' },
          { value: 'Active patients', label: 'Active patients' },
          { value: 'Inactive patients', label: 'Inactive patients' },
        ]} 
        width="200px" 
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox 
        label="Include Inactive Patients" 
        checked={includeInactive} 
        onChange={(e) => setIncludeInactive(typeof e === 'boolean' ? e : e?.target?.checked)} 
      />
      <ReportCheckbox 
        label="Group By Patient vs Insurance Credit" 
        checked={groupByCredit} 
        onChange={(e) => setGroupByCredit(typeof e === 'boolean' ? e : e?.target?.checked)} 
      />
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={handleApply}
      onClearAll={handleClear}
      onCreateTemplate={() => console.log('Create Template clicked')}
    />
  );
};

export default CreditAccountsReportFilters;
