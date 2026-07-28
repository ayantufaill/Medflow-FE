import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, NotificationsActive as BellIcon } from '@mui/icons-material';

const NotificationAlert = ({ showAlert, onClose }) => {
  if (!showAlert) return null;

  return (
    <Box 
      sx={{ 
        mb: 4, 
        p: 2,
        borderRadius: 2, 
        bgcolor: '#eff6ff', 
        color: '#1e40af',
        border: '1px solid #bfdbfe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ backgroundColor: '#2563eb', borderRadius: '50%', p: 0.75, display: 'flex' }}>
          <BellIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
        </Box>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e3a8a' }}>
          The notification reminders will check open invoices created starting from 01/25/2025.
        </Typography>
      </Box>
      <IconButton size="small" onClick={onClose} sx={{ color: '#1e3a8a' }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default NotificationAlert;
