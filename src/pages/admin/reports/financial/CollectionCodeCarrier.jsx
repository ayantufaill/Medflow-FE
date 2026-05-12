import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const CollectionPerCodePerCarrier = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Collection per code per carrier:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Start by searching for procedure codes: 
              <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}>Enter Code</Box>
            </Typography>
            <TextField 
              variant="standard" 
              fullWidth 
              placeholder="Enter code or procedure" 
              sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Date Range:</Typography>
              <Select size="small" variant="standard" defaultValue="daily" sx={{ minWidth: 80, fontSize: '0.75rem' }}>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
              <Typography variant="caption" color="primary">⬅ May 08, 2026 ⮕ Date: 05/08/2026</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Placeholder Content */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Start by searching for procedure codes:
        </Typography>
      </Box>

      {/* Disclaimers Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textDecoration: 'underline', display: 'block', mb: 1, color: 'primary.main' }}>
              Disclaimers:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}>
              • Dual coverage excluded from the total collections and average per code
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.4 }}>
              • Carrier (in network or out of network) is based on the current status of the insurance per provider. ie. If you were in network during the selected range and the carrier is currently out of network, the results will show the carrier out of network
            </Typography>
          </Box>
          <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623', ml: 4 }}>
            Print
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CollectionPerCodePerCarrier;
