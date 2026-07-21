import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import CreditAccountsReportFilters from '../../../../components/reports/financial/CreditAccountsReportFilters';
import CreditAccountsReportTable from '../../../../components/reports/financial/CreditAccountsReportTable';
import { useCreditAccountsReport } from '../../../../hooks/reports/financial/useCreditAccountsReport';

const CreditAccountsReport = () => {
  const {
    filter, setFilter,
    includeInactive, setIncludeInactive,
    groupByCredit, setGroupByCredit,
    reportData, loading,
    handlePrint, handleClear, handleApply, handleExportCSV
  } = useCreditAccountsReport();

  return (
    <ReportLayout title="Credit Accounts Report:">
      <CreditAccountsReportFilters 
        filter={filter} setFilter={setFilter}
        includeInactive={includeInactive} setIncludeInactive={setIncludeInactive}
        groupByCredit={groupByCredit} setGroupByCredit={setGroupByCredit}
        handleApply={handleApply} handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={reportData.length > 0}
      />

      <CreditAccountsReportTable dummyData={reportData} loading={loading} />
    </ReportLayout>
  );
};

export default CreditAccountsReport;
