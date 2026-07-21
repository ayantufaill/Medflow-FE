import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import CourtesyCreditModificationsFilters from '../../../../components/reports/financial/CourtesyCreditModificationsFilters';
import CourtesyCreditModificationsTable from '../../../../components/reports/financial/CourtesyCreditModificationsTable';
import { useCourtesyCreditModifications } from '../../../../hooks/reports/financial/useCourtesyCreditModifications';

const CourtesyCreditModifications = () => {
  const {
    startDate, setStartDate,
    endDate, setEndDate,
    adjustmentType, setAdjustmentType,
    action, setAction,
    patients, setPatients,
    flags, setFlags,
    users, setUsers,
    groupByAdj, setGroupByAdj,
    searchText, setSearchText,
    reportData, loading, adjustmentTypes, dropdownProviders,
    handlePrint, handleClear, handleApply, handleExportCSV
  } = useCourtesyCreditModifications();

  return (
    <ReportLayout title="Courtesy Credit Modifications Report:">
      <CourtesyCreditModificationsFilters 
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        adjustmentType={adjustmentType} setAdjustmentType={setAdjustmentType}
        action={action} setAction={setAction}
        patients={patients} setPatients={setPatients}
        flags={flags} setFlags={setFlags}
        users={users} setUsers={setUsers}
        groupByAdj={groupByAdj} setGroupByAdj={setGroupByAdj}
        searchText={searchText} setSearchText={setSearchText}
        adjustmentTypes={adjustmentTypes} dropdownProviders={dropdownProviders}
        handleApply={handleApply} handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={reportData.length > 0}
      />

      <CourtesyCreditModificationsTable 
        dummyData={reportData}
        loading={loading}
      />
    </ReportLayout>
  );
};

export default CourtesyCreditModifications;
