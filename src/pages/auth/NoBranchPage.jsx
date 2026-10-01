import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const NoBranchPage = () => {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC',
      p: 2
    }}>
      <Paper elevation={0} sx={{
        p: 6,
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        border: '1px solid #E2E8F0',
        borderRadius: 3
      }}>
        <Box sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 3
        }}>
          <LockIcon sx={{ fontSize: 32, color: '#EF4444' }} />
        </Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#0F172A' }}>
          Access Restricted
        </Typography>
        <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.6 }}>
          No branch is assigned to your account. You must be assigned to at least one branch to access the system. Please contact your administrator to get access.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogout}
          sx={{
            py: 1.5,
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '8px'
          }}
        >
          Return to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default NoBranchPage;
