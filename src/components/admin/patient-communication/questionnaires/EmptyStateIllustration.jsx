import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Email as EmailIcon, PieChart as PieChartIcon } from '@mui/icons-material';

const EmptyStateIllustration = () => {
  return (
    <Box sx={{ position: 'relative', width: 300, height: 300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Floating Elements */}
      <Paper elevation={1} sx={{ position: 'absolute', top: 50, right: 30, width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
        <EmailIcon sx={{ color: '#1976d2', opacity: 0.6 }} />
      </Paper>
      
      <Paper elevation={1} sx={{ position: 'absolute', top: 120, left: 10, width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
        <PieChartIcon sx={{ color: '#1a3a6b' }} />
      </Paper>

      <Paper elevation={1} sx={{ position: 'absolute', bottom: 40, right: 10, width: 50, height: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <Box sx={{ width: 10, height: 10, bgcolor: '#1a3a6b', borderRadius: '50%', position: 'absolute', top: 8, right: 8 }} />
        <Box sx={{ width: '120%', height: 25, bgcolor: '#e0e0e0', borderTopLeftRadius: 20, borderTopRightRadius: 30, transform: 'rotate(-5deg)', mb: -5 }} />
      </Paper>

      {/* Main Clipboard */}
      <Paper elevation={2} sx={{ width: 140, height: 180, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, zIndex: 10, border: '1px solid #e0e0e0' }}>
        {/* Clip */}
        <Box sx={{ position: 'absolute', top: -8, width: 50, height: 16, bgcolor: '#1a3a6b', borderRadius: 1 }} />
        <Box sx={{ position: 'absolute', top: -14, width: 16, height: 16, border: '3px solid #1a3a6b', borderRadius: '50%', bgcolor: '#fff' }} />
        
        {/* Checkmark Rows */}
        <Box sx={{ width: '100%', px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 22, height: 22, bgcolor: '#4caf50', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 2 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 22, height: 22, bgcolor: '#1a3a6b', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 2 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 22, height: 22, bgcolor: '#1a3a6b', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 2 }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmptyStateIllustration;
