import React from 'react';
import { Box } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionCollectionSummaryFilters from '../../../../components/reports/financial/ProductionCollectionSummaryFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ProductionCollectionSummaryView from '../../../../components/reports/financial/ProductionCollectionSummaryView';
import { useProductionCollectionSummary } from '../../../../hooks/reports/financial/useProductionCollectionSummary';

const ProductionCollectionSummary = () => {
  const {
    filters,
    setFilters,
    loading,
    dropdownProviders,
    filteredReportData,
    globalStats,
    providerGroupsStats,
    handleExportCSV,
    handlePrint
  } = useProductionCollectionSummary();

  return (
    <ReportLayout title="Production & Collection Summary Report">
      <ProductionCollectionSummaryFilters 
        dropdownProviders={dropdownProviders}
        onApplyFilters={(f) => setFilters(f)}
      />
      
      <ProductionReportActions 
        loading={loading}
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={filteredReportData.length > 0}
      />

      <Box sx={{ p: 0, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <ProductionCollectionSummaryView 
          globalStats={globalStats}
          providerGroups={providerGroupsStats}
          grouping={filters.grouping}
        />
      </Box>
    </ReportLayout>
  );
};

export default ProductionCollectionSummary;
