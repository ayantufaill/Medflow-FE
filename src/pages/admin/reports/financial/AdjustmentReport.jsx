import React from 'react';
import { Box, Tooltip, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import AdjustmentReportFilters from '../../../../components/reports/financial/AdjustmentReportFilters';
import AdjustmentReportTable from '../../../../components/reports/financial/AdjustmentReportTable';
import { useAdjustmentReport } from '../../../../hooks/reports/financial/useAdjustmentReport';

const AdjustmentReport = () => {
  const {
    dateRange, startDate, endDate, provider, adjustmentType, grouping,
    codeFilter, codeText, filterByProductionDate, showFlags, showDOB,
    showProviderColumn, filterByDOS, flagFilter, sortBy,
    loading, dropdownProviders, adjustmentTypes, sortedReportData, groupedData,
    getRowDisplayValues, getProviderLabel, handleFilterChange, handleFilterModeChange,
    handleApply, handleClear, handleExportCSV, handlePrint
  } = useAdjustmentReport();

  const Title = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      Adjustment Report
      <Tooltip title="Adjustment Details">
        <InfoOutlinedIcon sx={{ fontSize: 18, ml: 1, color: 'text.secondary', cursor: 'pointer' }} />
      </Tooltip>
    </Box>
  );

  return (
    <ReportLayout title={Title}>
      <AdjustmentReportFilters 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        provider={provider}
        adjustmentType={adjustmentType}
        grouping={grouping}
        codeFilter={codeFilter}
        codeText={codeText}
        filterByProductionDate={filterByProductionDate}
        showFlags={showFlags}
        showDOB={showDOB}
        showProviderColumn={showProviderColumn}
        filterByDOS={filterByDOS}
        flagFilter={flagFilter}
        sortBy={sortBy}
        dropdownProviders={dropdownProviders}
        adjustmentTypes={adjustmentTypes}
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

      <AdjustmentReportTable 
        loading={loading}
        sortedReportData={sortedReportData}
        groupedData={groupedData}
        grouping={grouping}
        showProviderColumn={showProviderColumn}
        showFlags={showFlags}
        showDOB={showDOB}
        getRowDisplayValues={getRowDisplayValues}
      />
    </ReportLayout>
  );
};

export default AdjustmentReport;
