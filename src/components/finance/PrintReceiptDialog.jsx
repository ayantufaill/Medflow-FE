import React, { useState } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';

const PrintReceiptDialog = ({ onClose, initialIncludeFamily = false }) => {
  const [startDate, setStartDate] = useState('05/06/2026');
  const [endDate, setEndDate] = useState('05/06/2026');
  const [includeFamily, setIncludeFamily] = useState(initialIncludeFamily);

  const blueHeader = '#7788bb';
  const tanButton = '#d2b48c';

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: blueHeader,
          color: 'white',
          padding: '8px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', fontSize: '15px' }}>
          Print Receipt
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ padding: '20px' }}>
        {/* Start Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ color: '#333', fontSize: '13px', mr: 2, width: '70px' }}>
            start date:
          </Typography>
          <TextField
            variant="standard"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ 
              width: '160px',
              '& .MuiInput-input': { fontSize: '13px', py: 0.2 }
            }}
          />
        </Box>

        {/* End Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ color: '#333', fontSize: '13px', mr: 2, width: '70px' }}>
            end date:
          </Typography>
          <TextField
            variant="standard"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ 
              width: '160px',
              '& .MuiInput-input': { fontSize: '13px', py: 0.2 }
            }}
          />
        </Box>

        {/* Include Family Payments */}
        <Box sx={{ mb: 2.5 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={includeFamily} 
                onChange={(e) => setIncludeFamily(e.target.checked)}
                size="small"
                sx={{ color: '#333', '&.Mui-checked': { color: '#333' }, p: 0.5 }}
              />
            }
            label="Include Family Payments"
            sx={{ '& .MuiTypography-root': { fontSize: '13px', color: '#333' } }}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: tanButton,
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              padding: '4px 16px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c1a37b', boxShadow: 'none' },
            }}
          >
            Prepare Receipt
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onClose}
            sx={{
              backgroundColor: '#9ca3af',
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              padding: '4px 16px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#8b949e', boxShadow: 'none' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PrintReceiptDialog;
