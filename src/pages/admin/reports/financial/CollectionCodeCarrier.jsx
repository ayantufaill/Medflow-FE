import React from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, Button, TextField
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect } from '../../../../components/reports/ui';

const CollectionCodeCarrier = () => {
  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Start by searching for procedure codes: 
          <Box component="span" sx={{ ml: 1, color: '#337ab7', cursor: 'pointer', textDecoration: 'underline' }}>Enter Code</Box>
        </Typography>
        <TextField 
          variant="standard" 
          placeholder="Enter code or procedure" 
          sx={{ ml: 2, minWidth: 200, '& .MuiInputBase-input': { fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} 
        />
      </Box>

      <ReportSelect 
        label="daily" 
        prefix="Date Range:" 
        defaultValue="daily"
        options={[{ value: 'daily', label: 'Daily' }]}
        sx={{ ml: 4 }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600 }}>⬅ May 08, 2026 ⮕</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7' }}>05/08/2026</Typography>
      </Box>
    </>
  );

  return (
    <ReportLayout title="Collection per code per carrier:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply')}
        onPrint={() => window.print()}
      />

      {/* Placeholder Content */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Start by searching for procedure codes:
        </Typography>
      </Box>

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

