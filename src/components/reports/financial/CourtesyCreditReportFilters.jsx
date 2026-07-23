import React from 'react';
import { ReportFilterBar, ReportSelect, ReportSearchInput } from '../ui';

const CourtesyCreditReportFilters = ({
  outstandingFilter, setOutstandingFilter,
  patientFilter, setPatientFilter,
  flagFilter, setFlagFilter,
  searchText, setSearchText,
  handleApply, handleClear
}) => {
  const topFilters = (
    <>
      <ReportSelect 
        label="OUTSTANDING"
        value={outstandingFilter}
        onChange={(e) => setOutstandingFilter(e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'with_bal', label: 'With outstanding balance' },
          { value: 'without_bal', label: 'Without outstanding balance' }
        ]} 
        width="200px" 
      />
      <ReportSelect 
        label="PATIENTS"
        value={patientFilter}
        onChange={(e) => setPatientFilter(e.target.value)}
        options={[{ value: 'all', label: 'All' }]} 
        width="200px" 
      />
      <ReportSelect 
        label="FLAGS"
        value={flagFilter}
        onChange={(e) => setFlagFilter(e.target.value)}
        options={[
          { value: 'pts', label: 'Pts with or without flags' },
          { value: 'with_flags', label: 'Pts with flags' },
          { value: 'without_flags', label: 'Pts without flags' }
        ]} 
        width="240px" 
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSearchInput 
        placeholder="Search by patient name" 
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        width="250px" 
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

export default CourtesyCreditReportFilters;
