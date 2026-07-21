import React from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionCollectionFilters from '../../../../components/reports/financial/ProductionCollectionFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import ProductionReportTable from '../../../../components/reports/financial/ProductionReportTable';
import { useProductionCollection } from '../../../../hooks/reports/financial/useProductionCollection';

const ProductionCollection = () => {
  const {
    filters,
    setFilters,
    loading,
    dropdownProviders,
    transformedReportData,
    handleExportCSV,
    handlePrint,
    handleExportGroupCSV,
    handlePrintGroup
  } = useProductionCollection();

  const customLeftActions = (
    <MuiLink sx={{ fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', color: '#337ab7', mr: 2 }}>Office (no provider section)</MuiLink>
  );

  return (
    <ReportLayout title="Production & Collection Report">
      <ProductionCollectionFilters 
        dropdownProviders={dropdownProviders}
        onApplyFilters={(f) => setFilters(f)}
      />

      <ProductionReportActions 
        loading={loading}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        hasData={transformedReportData.length > 0}
        customLeftActions={customLeftActions}
      />

      <Box sx={{ p: 0, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <ProductionReportTable 
          sortedReportData={transformedReportData}
          grouping={filters.grouping}
          showFlags={filters.showFlags}
          showDOB={filters.showDOB}
          showProvider={filters.showProvider}
          handleExportGroupCSV={handleExportGroupCSV}
          handlePrintGroup={handlePrintGroup}
        />
      </Box>
    </ReportLayout>
  );
};

export default ProductionCollection;