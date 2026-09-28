import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui'; 
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { useProviderCollectionPaymentType } from '../../../../hooks/reports/financial/useProviderCollectionPaymentType';
import ProviderCollectionPaymentTypeFilters from '../../../../components/reports/financial/ProviderCollectionPaymentTypeFilters';
import ProviderCollectionPaymentTypeTable from '../../../../components/reports/financial/ProviderCollectionPaymentTypeTable';

const ProviderCollectionPerPaymentType = () => {
  const {
    filters,
    loading,
    dropdownProviders,
    sortedReportData,
    summaryStats,
    totals,
    getProviderLabel,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = useProviderCollectionPaymentType();

  return (
    <ReportLayout title="Provider Collection Per Payment Type:">
      <ProviderCollectionPaymentTypeFilters 
        initialFilters={filters}
        dropdownProviders={dropdownProviders}
        getProviderLabel={getProviderLabel}
        onApplyFilters={handleApply}
        onClearAll={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={sortedReportData.length > 0}
      />

      <ProviderCollectionPaymentTypeTable 
        loading={loading}
        sortedReportData={sortedReportData}
        showFlags={filters.showFlags}
        totals={totals}
        summaryStats={summaryStats}
      />
    </ReportLayout>
  );
};

export default ProviderCollectionPerPaymentType;