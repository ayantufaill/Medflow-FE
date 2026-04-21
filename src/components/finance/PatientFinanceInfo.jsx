import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import {
  AccountBalanceWallet,
  Security,
  AddCircle,
  SettingsBackupRestore,
  Savings,
  Print,
  CloudUpload,
  CalendarMonth,
} from '@mui/icons-material';

const PatientFinanceInfo = ({ view }) => {
  return (
    <Box sx={{ width: '38%', flexShrink: 0, pr: 2 }}>
      <Box sx={{ borderTop: '4px solid #7986cb', width: 'fit-content', minWidth: '80px', textAlign: 'center', p: 1, border: '1px solid #ddd', borderTopWidth: '4px' }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', fontWeight: 'bold', whiteSpace: 'nowrap' }}>test test</Typography>
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', cursor: 'pointer' }}>Billing flags: <span style={{ color: '#1976d2' }}>+add flags</span></Typography>
        <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer' }}>+add account note</Typography>
      </Stack>

      {/* Custom Icon Toolbar - Hidden in Family View */}
      {view !== 'family' && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {[
            { icon: AccountBalanceWallet, color: '#5d4037' },
            { icon: Security, color: '#fff', bgcolor: '#81c784' },
            { icon: Security, color: '#90a4ae' },
            { icon: AddCircle, color: '#5c6bc0' },
            { icon: SettingsBackupRestore, color: '#795548' },
            { icon: Savings, color: '#f8bbd0' },
            { icon: Print, color: '#90a4ae' },
            { icon: CloudUpload, color: '#90a4ae' },
            { icon: AddCircle, color: '#81c784' },
            { icon: CalendarMonth, color: '#5c6bc0' },
          ].map((item, i) => (
            <IconButton key={i} size="small">
              {item.bgcolor ? (
                <Box sx={{ bgcolor: item.bgcolor, borderRadius: '4px', p: '2px', display: 'flex' }}>
                  <item.icon sx={{ fontSize: 16, color: item.color }} />
                </Box>
              ) : (
                <item.icon fontSize="small" sx={{ color: item.color }} />
              )}
            </IconButton>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PatientFinanceInfo;
