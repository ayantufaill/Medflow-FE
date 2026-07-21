import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import CourtesyCreditReportFilters from '../../../../components/reports/financial/CourtesyCreditReportFilters';
import CourtesyCreditReportTable from '../../../../components/reports/financial/CourtesyCreditReportTable';
import { useCourtesyCreditReport } from '../../../../hooks/reports/financial/useCourtesyCreditReport';

const CourtesyCreditReport = () => {
  const {
    outstandingFilter, setOutstandingFilter,
    patientFilter, setPatientFilter,
    flagFilter, setFlagFilter,
    searchText, setSearchText,
    reportData, totalAmount, loading,
    handlePrint, handleClear, handleApply, handleExportCSV
  } = useCourtesyCreditReport();

  return (
    <ReportLayout title="Courtesy Credit Report:">
      <CourtesyCreditReportFilters 
        outstandingFilter={outstandingFilter} setOutstandingFilter={setOutstandingFilter}
        patientFilter={patientFilter} setPatientFilter={setPatientFilter}
        flagFilter={flagFilter} setFlagFilter={setFlagFilter}
        searchText={searchText} setSearchText={setSearchText}
        handleApply={handleApply} handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={reportData.length > 0}
      />

      <CourtesyCreditReportTable 
        dummyData={reportData}
        totalAmount={totalAmount}
        loading={loading}
      />
    </ReportLayout>
  );
};

export default CourtesyCreditReport;
