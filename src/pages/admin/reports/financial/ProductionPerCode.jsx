import React from 'react';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ProductionPerCodeFilters from '../../../../components/reports/financial/ProductionPerCodeFilters';
import ProductionPerCodeTable from '../../../../components/reports/financial/ProductionPerCodeTable';
import { useProductionPerCode } from '../../../../hooks/reports/financial/useProductionPerCode';

const ProductionPerCode = () => {
  const {
    rawReportData,
    reportData,
    loading,
    dropdownProviders,
    getProviderLabel,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = useProductionPerCode();

  return (
    <ReportLayout title="Production per code:">
      <ProductionPerCodeFilters 
        reportData={rawReportData}
        dropdownProviders={dropdownProviders}
        getProviderLabel={getProviderLabel}
        onApplyFilters={handleApply}
        onClearAll={handleClear}
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