import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { FINANCIAL_REPORT_SUB_TABS } from '../../../pages/admin/ReportsConfig';

const FinancialReportsSubNav = () => {
  const theme = useTheme();
  const location = useLocation();

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
      {FINANCIAL_REPORT_SUB_TABS.map((sub) => {
        const isActive = location.pathname === sub.path;
        return (
          <Typography
            key={sub.label}
            component={Link}
            to={sub.path}
            sx={{
              px: 2,
              py: 1.5,
              fontSize: '0.8rem',
              fontWeight: 500,
              color: isActive ? theme.palette.primary.main : 'text.secondary',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              borderBottom: '2px solid',
              borderBottomColor: isActive ? theme.palette.primary.main : 'transparent',
              '&:hover': {
                color: theme.palette.primary.main,
                borderBottomColor: theme.palette.primary.main,
              },
            }}
          >
            {sub.label}
          </Typography>
        );
      })}
    </Box>
  );
};

export default FinancialReportsSubNav;
