import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { OTHERS_REPORT_SUB_TABS } from '../../../pages/admin/ReportsConfig';

const OthersReportsSubNav = () => {
  const theme = useTheme();

  if (OTHERS_REPORT_SUB_TABS.length === 0) return null;

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        borderTop: 1,
        mx: -3,
        px: 3,
        mb: 3,
        backgroundColor: '#f0f4fa',
        display: 'flex',
        gap: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {OTHERS_REPORT_SUB_TABS.map((sub) => (
        <Typography
          key={sub.label}
          component={Link}
          to={sub.path}
          sx={{
            px: 2,
            py: 1.5,
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'text.secondary',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            borderBottom: '2px solid transparent',
            '&:hover': {
              color: theme.palette.primary.main,
              borderBottomColor: theme.palette.primary.main,
            },
          }}
        >
          {sub.label}
        </Typography>
      ))}
    </Box>
  );
};

export default OthersReportsSubNav;
