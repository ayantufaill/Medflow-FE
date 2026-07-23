import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SectionHeader = ({ number, icon: Icon, title, subtitle }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2.5,
      py: 1.5,
      backgroundColor: '#F2F6FC',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    }}
  >
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {number}
    </Box>
    {Icon && <Icon sx={{ color: '#1d4ed8', fontSize: '1.25rem' }} />}
    <Box>
      <Typography fontWeight={700} fontSize="0.85rem" sx={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

export default SectionHeader;
