import React from 'react';
import { Box, Paper, Stack, Checkbox, Typography } from '@mui/material';
import { CalendarMonth, Print, Edit, NotInterested } from '@mui/icons-material';

const LedgerList = () => {
  const ledgerItems = [
    { id: '24532', date: '04/10/2026', method: 'Master Card', amount: '- $184.00', color: '#5c6bc0' },
    { id: '24531', date: '04/10/2026', method: 'Sunbit', amount: '$92.00', color: '#5c6bc0' },
    { id: '24530', date: '04/10/2026', method: 'Sunbit', amount: '$292.00', color: '#5c6bc0' },
    { id: '23003', date: '01/27/2026', method: 'Master Card', amount: '- $1.00', color: '#90a4ae' },
    { id: '8494', date: '09/20/2023', method: 'American Express', amount: '$1.00', color: '#5c6bc0', success: true },
  ];

  return (
    <Box>
      {ledgerItems.map((item, idx) => (
        <Paper 
          key={idx} 
          elevation={0} 
          sx={{ 
            p: '2px 8px', 
            mb: 0.5, 
            border: '1px solid #bbdefb', 
            borderRadius: '6px',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Checkbox size="small" sx={{ p: 0 }} />
            <Typography variant="caption" sx={{ color: item.color, fontWeight: 500 }}>
              Patient Deposit#{item.id} ({item.date} <CalendarMonth sx={{ fontSize: 12, verticalAlign: 'middle' }} />) with {item.method}: 
              <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>{item.amount}</span>
              {item.success && <span style={{ marginLeft: '20px', color: '#000' }}>SuccessfulTransaction</span>}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {!item.success && (
              <>
                <Typography variant="caption" sx={{ color: '#cfd8dc', fontSize: '10px' }}>FLO</Typography>
                <NotInterested sx={{ fontSize: 18, color: '#d32f2f' }} />
              </>
            )}
            <Print sx={{ fontSize: 18, color: '#90a4ae' }} />
            <Edit sx={{ fontSize: 18, color: '#81c784' }} />
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default LedgerList;
