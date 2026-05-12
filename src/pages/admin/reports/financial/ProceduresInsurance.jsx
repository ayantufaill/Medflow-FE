import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
} from '@mui/material';

const ProceduresInsurance = () => {
  const [payerName, setPayerName] = useState('');

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Procedures By Insurance Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Date Range:</Typography>
            <Select value="Daily" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
              <MenuItem value="Daily">Daily</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', ml: 1 }}>← May 08, 2026 →</Typography>
            <Typography sx={{ fontSize: '0.85rem' }}>Date: 05/08/2026</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Provider:</Typography>
            <Select value="All" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
              <MenuItem value="All">All</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Search by Payer:</Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter Name"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            sx={{ width: 220, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto', opacity: 0.7 }}
          >
            Apply Filters
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto' }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderTop: '1px solid #dcb265', pt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto' }}
          >
            Print
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>Please select a payer</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProceduresInsurance;

