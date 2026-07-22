import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui'; 
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { useProviderCollectionPaymentType } from '../../../../hooks/reports/financial/useProviderCollectionPaymentType';
import ProviderCollectionPaymentTypeFilters from '../../../../components/reports/financial/ProviderCollectionPaymentTypeFilters';
import ProviderCollectionPaymentTypeTable from '../../../../components/reports/financial/ProviderCollectionPaymentTypeTable';

const ProviderCollectionPerPaymentType = () => {
  const {
    dateRange,
    startDate,
    endDate,
    provider,
    showFlags,
    flagFilter,
    sortBy,
    loading,
    dropdownProviders,
    sortedReportData,
    summaryStats,
    totals,
    getProviderLabel,
    handleFilterChange,
    handleFilterModeChange,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = useProviderCollectionPaymentType();

  return (
    <ReportLayout title="Provider Collection Per Payment Type:">
      <ProviderCollectionPaymentTypeFilters 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        provider={provider}
        showFlags={showFlags}
        flagFilter={flagFilter}
        sortBy={sortBy}
        dropdownProviders={dropdownProviders}
        getProviderLabel={getProviderLabel}
        handleFilterChange={handleFilterChange}
        handleFilterModeChange={handleFilterModeChange}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={sortedReportData.length > 0}
      />

      <ProviderCollectionPaymentTypeTable 
        loading={loading}
        sortedReportData={sortedReportData}
        showFlags={showFlags}
        totals={totals}
        summaryStats={summaryStats}
      />
    </ReportLayout>
  );
};

export default ProviderCollectionPerPaymentType;