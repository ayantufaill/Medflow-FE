import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ProductionPerCodeFilters from '../../../../components/reports/financial/ProductionPerCodeFilters';
import ProductionPerCodeTable from '../../../../components/reports/financial/ProductionPerCodeTable';
import { useProductionPerCode } from '../../../../hooks/reports/financial/useProductionPerCode';

const ProductionPerCode = () => {
  const {
    dateRange,
    startDate,
    endDate,
    provider,
    referralProvider,
    groupBy,
    codeFilter,
    codeText,
    showCollection,
    reportData,
    loading,
    dropdownProviders,
    getProviderLabel,
    handleFilterChange,
    handleFilterModeChange,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = useProductionPerCode();

  return (
    <ReportLayout title="Production per code:">
      <ProductionPerCodeFilters 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        provider={provider}
        referralProvider={referralProvider}
        groupBy={groupBy}
        codeFilter={codeFilter}
        codeText={codeText}
        showCollection={showCollection}
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
      />

      <ProductionPerCodeTable 
        loading={loading}
        reportData={reportData}
      />
    </ReportLayout>
  );
};

export default ProductionPerCode;