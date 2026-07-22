import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportLayout } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import CollectionCodeCarrierFilters from '../../../../components/reports/financial/CollectionCodeCarrierFilters';
import CollectionCodeCarrierTable from '../../../../components/reports/financial/CollectionCodeCarrierTable';
import { useCollectionCodeCarrier } from '../../../../hooks/reports/financial/useCollectionCodeCarrier';

const CollectionCodeCarrier = () => {
  const {
    dateRange,
    startDate,
    endDate,
    codeFilter,
    codeText,
    loading,
    reportData,
    setStartDate,
    setEndDate,
    setCodeFilter,
    setCodeText,
    handleFilterModeChange,
    handleClearAll,
    handleApply,
    handleExportCSV,
    handlePrint
  } = useCollectionCodeCarrier();

  return (
    <ReportLayout title="Collection per code per carrier:">
      <CollectionCodeCarrierFilters 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        codeFilter={codeFilter}
        codeText={codeText}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setCodeFilter={setCodeFilter}
        setCodeText={setCodeText}
        handleFilterModeChange={handleFilterModeChange}
        handleApply={handleApply}
        handleClearAll={handleClearAll}
      />

      <ProductionReportActions 
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={reportData.length > 0}
      />

      <CollectionCodeCarrierTable 
        loading={loading}
        reportData={reportData}
      />

      {/* Disclaimers Section */}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textDecoration: 'underline', display: 'block', mb: 1, color: '#337ab7' }}>
              Disclaimers:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}>
              • Dual coverage excluded from the total collections and average per code
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.4 }}>
              • Carrier (in network or out of network) is based on the current status of the insurance per provider. ie. If you were in network during the selected range and the carrier is currently out of network, the results will show the carrier out of network
            </Typography>
          </Box>
        </Box>
      </Box>
    </ReportLayout>
  );
};

export default CollectionCodeCarrier;
